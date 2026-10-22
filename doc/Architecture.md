# Architecture & Tech Stack

Companion doc to the [PRD](./School%20Management%20System%20—%20PRD.md). Covers system-level decisions (data store, multi-tenancy model, application layers, offline support, hosting) and the backend's own folder structure, tooling, and API. Frontend architecture lives in its own repo: [`patino-school-fe/doc/Architecture.md`](../../patino-school-fe/doc/Architecture.md).

## Database: PostgreSQL

The data is deeply relational — pupils belong to classes, classes belong to schools, schools belong to organizations, scores tie to subjects and terms, invoices tie to fee structures. Core operations are constant joins (a report card pulls scores across subjects for one pupil in one term; a dashboard aggregates attendance and fees across schools), which is exactly what a relational database is built for. It also gives transactional integrity for money — invoices and payments must never double-count or lose a record.

- **Postgres over MySQL** for its stronger JSON support (useful for flexible fields like onboarding config and grade templates that differ by school level) and row-level security, which maps well to multi-tenancy.
- **Skip a document database (MongoDB)** as the primary store — it would make cross-entity reporting (the dashboard, report cards) harder, not easier, given how relational this data is.

**Query layer: [Prisma](https://www.prisma.io/) (switched from Knex — decided).** The project started on Knex specifically to avoid an ORM hiding tenant-scoping behind a generated client (see the original reasoning, preserved in git history). After building the first vertical slice, the team switched to Prisma anyway, while **keeping the concern that motivated Knex**: `repositories/` stays the only layer that talks to the database, so `organization_id`/`school_id` filters are still enforced in one place — services and controllers never import `@prisma/client` or `src/config/prisma.ts` directly, only `repositories/*`. Prisma's `PrismaClient` sits *inside* each repository function, not in place of the repository layer. Two things made the switch worth it even so: `schema.prisma` as one file that's simultaneously the DB's own documentation (constraints — `@unique`, nullability, relations, `onDelete` — declared right on the field, visible without opening a migration) and the migration source of truth (`prisma migrate dev` generates SQL migrations from schema diffs, instead of hand-writing each one); and `@updatedAt`, which actually keeps `updated_at` current on every write — the original Knex `timestamps(true, true)` only set it once, at insert, since no trigger was ever added.

**Models: Prisma's generated types, not hand-written (decided, after going back and forth).** The team briefly tried hand-writing `models/*.ts` again post-switch (mirroring the pre-Prisma Knex era) to avoid depending on `@prisma/client`'s generated `User`/`Organization`/`School`/`SchoolLevel` types — the concern being two sources of truth (`schema.prisma` and `models/*.ts`) that could drift. That was undone: `models/` is gone again, and repositories/services import types straight from `@prisma/client`. A TypeORM-style alternative (decorator-based `@Entity` classes as the actual single source of truth — no separate schema file at all) was also considered and explicitly declined in favor of staying on Prisma. Net result: `schema.prisma` is the one and only schema/type source of truth; nothing hand-maintained duplicates it.

## Multi-tenancy model

Shared database, shared schema: every tenant-scoped table (pupils, staff, classes, invoices) carries an `organization_id` and `school_id` column, enforced with Postgres row-level security so a query can never leak across tenants even if application code has a bug. This is the standard choice for B2B SaaS with many small-to-mid tenants — far simpler to operate and migrate than database-per-tenant, and the data volume per school doesn't justify the heavier isolation model.

## Application layers

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (App Router), with role-based routing splitting admin/bursar views from the teacher portal | One codebase, two experiences — avoids maintaining separate apps |
| Backend API | Node.js + Express + TypeScript, REST | Already scaffolded this way in `patino-schools-be`; REST is a natural fit for the relational, resource-oriented data model |
| Auth | JWT-based sessions with role + school-scope claims | Lets permission checks (which schools/classes a user can touch) happen at the token level, not just in UI |
| Background jobs | A queue (e.g., Redis + BullMQ) for report card generation and invoice generation | These are bursty, multi-step operations that shouldn't block the request-response cycle |
| File storage | S3-compatible object storage | Pupil photos, uploaded documents, exported report cards/invoices as PDFs |
| Hosting | Render, as a modular monolith | Scale doesn't justify microservices yet; split out services only if a specific module (e.g., report card generation) becomes a bottleneck |

## Offline support (decided)

The teacher portal must work offline — attendance marking and score entry can't assume a teacher always has live internet, given inconsistent connectivity across schools. This is a deliberate architectural decision made early, since it changes the build shape rather than being a retrofit:

- Build the teacher portal as a **PWA** (installable, works without a live connection).
- Use **local-first storage (IndexedDB)** on the device for the teacher's roster, attendance, and scores.
- **Sync to Postgres** when connectivity returns, with conflict resolution for records edited offline (e.g., last-write-wins with a server-side audit trail, since attendance/score edits are rarely concurrent for the same pupil).
- The admin/bursar/proprietor dashboards can remain standard server-rendered/online-only experiences — offline support is scoped to the teacher's core recurring tasks (attendance, scores), not the full app.

## Hosting: Render

Deploy as a modular monolith on Render:
- Render Web Service for the API.
- Render Static Site or Web Service for the frontend (Next.js).
- Render Postgres (managed) as the primary database, with row-level security configured for multi-tenancy.
- Render Key Value (Redis) for the background job queue.
- S3-compatible object storage (e.g., Cloudflare R2 or AWS S3) for file storage, since Render doesn't offer object storage natively.

## Folder Structure — `patino-schools-be`

Express + TypeScript, layered by responsibility (controllers → services → repositories → Prisma Client), as already scaffolded:

```
patino-schools-be/
├── doc/                  # PRD and architecture docs
├── prisma/
│   ├── schema.prisma     # DB schema — relations, constraints (@unique, onDelete, native enums); the migration source of truth
│   └── migrations/       # Generated SQL migrations (one timestamped folder per `prisma migrate dev`)
├── prisma.config.ts      # DATABASE_URL for the Prisma CLI (migrate/studio) — separate from the runtime client, see note below
├── src/
│   ├── app.ts            # Express app entrypoint — middleware + route wiring
│   ├── config/
│   │   ├── env.ts         # Typed env var loader (dotenv)
│   │   └── prisma.ts      # PrismaClient singleton (with the pg driver adapter), cached on globalThis in dev
│   ├── controllers/      # authController, schoolController — parse req, call services, shape res
│   ├── interface/        # DTOs — auth.ts (RegisterRequest/AuthResponse), school.ts (CreateSchoolRequest/SchoolResponse/SchoolLevel)
│   ├── middlewares/      # authenticate (JWT), validate (Zod), errorHandler
│   ├── repositories/     # userRepository, organizationRepository, schoolRepository — the only layer that imports Prisma Client
│   ├── routes/           # authRoutes (/api/auth), schoolRoutes (/api/schools)
│   ├── services/         # authService (register/login), schoolService — business logic, calls repositories
│   ├── utils/            # password.ts (bcrypt), jwt.ts (sign/verify), AppError.ts
│   └── validations/      # Zod schemas — authValidation, schoolValidation
├── .nvmrc                # Pins this project to Node 24.14.0 — Prisma 7's CLI requires it (see note below)
├── .env.example           # Documents required env vars (DATABASE_URL, JWT_SECRET, PORT, NODE_ENV); copy to .env locally
├── package.json
└── tsconfig.json
```

Request flow: `routes` → `controllers` → `services` (business logic) → `repositories` (data access, tenant-scoped) → Prisma Client (query execution, types inferred from `schema.prisma`). `models/` is gone — see "Models: Prisma's generated types" above. `interface/` stays independent of `@prisma/client` (e.g. `interface/school.ts` defines its own `SchoolLevel` union) — those are API DTOs, not DB shapes, and shouldn't change just because the ORM does.

Suggested additions as the backend grows (not yet present):
- `src/jobs/` — background job definitions (report card generation, invoice generation) for the Redis/BullMQ queue

### Backend tooling (installed)

| Package | Role |
|---|---|
| `express` | HTTP server / routing |
| `@prisma/client` | Generated, type-safe database client — used only inside `repositories/` |
| `prisma` *(dev)* | CLI — `migrate dev`/`migrate deploy`/`generate`/`studio` |
| `@prisma/adapter-pg` | Postgres driver adapter Prisma 7's `PrismaClient` requires explicitly (brings in `pg` as a transitive dependency — no direct `pg`/`@types/pg` needed anymore) |
| `dotenv` | Loads `.env` into `process.env` for local dev |
| `zod` | Request payload validation (`validate` middleware parses `req.body` against a schema) |
| `bcrypt` | Password hashing (12 salt rounds) |
| `jsonwebtoken` | Signs/verifies the auth token (`sub`, `organizationId`, `role` claims — matches the "JWT with role + school-scope claims" decision above) |
| `cors` | Allows the frontend (a different origin — Next.js runs on 3001, the API on 3000) to call this API from the browser |
| `tsx` *(dev)* | Runs TypeScript directly — used by nodemon's `exec` |
| `nodemon` *(dev)* | Watches `src/**/*.ts` and restarts `tsx src/app.ts` on change — driven by `nodemon.json` at the repo root (`"exec": "tsx src/app.ts"`) |
| `typescript`, `@types/*` *(dev)* | Type-checking and type defs |

**CORS (decided):** allowed origins come from `CORS_ORIGIN` (comma-separated), defaulting to `http://localhost:3001` for local dev — see `env.corsOrigins` in `src/config/env.ts`, applied via `app.use(cors({ origin: env.corsOrigins }))` as the very first middleware in `src/app.ts`, before `express.json()`. In production (Render), set `CORS_ORIGIN` to the deployed frontend's actual URL(s); an unlisted origin gets no `Access-Control-Allow-Origin` header, so the browser blocks it client-side even though the server still processes the request server-side (verified directly: a disallowed-origin request still got a normal JSON response, just without the CORS header — that's correct, expected behavior, not a bug).

**Node version (required): 24.14.0+, pinned via `.nvmrc`.** The `prisma` CLI (v7) requires Node `^22.18.0 || ^24.11.0 || >=26.0.0` — this machine's active Node was 22.17.0, just below the cutoff, so the project is pinned to a newer version already available locally (`nvm use`, or any nvm-aware shell picks up `.nvmrc` automatically) rather than changing the machine's global Node default. `@prisma/client` itself has no such restriction; only the CLI does. After switching Node versions, native modules (`bcrypt`) needed a clean reinstall (`rm -rf node_modules && yarn install`) to rebuild for the new ABI — verified directly (`bcrypt.hash()` call) rather than assumed.

**Why `prisma.config.ts` exists separately from `schema.prisma`:** Prisma 7 removed `datasource { url = env("DATABASE_URL") }` support from the schema file for Migrate — the CLI now reads the connection string from `prisma.config.ts`'s `datasource.url` instead (`schema.prisma`'s `datasource` block keeps only `provider`). This is unrelated to the `src/config/prisma.ts` runtime client, which builds its own connection via `@prisma/adapter-pg` — two separate config paths for the CLI vs. the running app, both ultimately reading `DATABASE_URL`.

**Local Postgres instance:**

Any local Postgres works — a few common ways to get one:
- **Homebrew (macOS):** `brew install postgresql@16` then `brew services start postgresql@16`
- **Docker:** `docker run --name patino-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16`
- **Managed/cloud for dev too:** a free-tier Render Postgres instance (see Hosting below) works fine for local dev as well, if you'd rather not run Postgres on your machine

This machine already had Postgres running via Homebrew (`postgresql@14`, `brew services list` to check), with a superuser role `mac` using trust auth (no password) over `localhost:5432`. The dev database was created with:
```bash
createdb -U "$(whoami)" -h localhost patino_schools_dev
```

**Local setup:**
```bash
nvm use                # picks up .nvmrc (Node 24.14.0)
cp .env.example .env   # then set DATABASE_URL to match your local Postgres role/password
yarn install            # postinstall runs `prisma generate`
yarn migrate:dev        # applies all pending migrations (and generates the client)
```

`.env.example` assumes a `postgres`/`postgres` user/password (the common Docker default) — adjust `DATABASE_URL` to whatever role your local Postgres actually has (e.g. `postgres://mac@localhost:5432/patino_schools_dev` for a trust-auth Homebrew setup with no password).

**npm scripts:**

| Script | Purpose |
|---|---|
| `yarn dev` | Runs the Express app via nodemon (`nodemon.json` → `tsx src/app.ts`), auto-restarting on any `src/**/*.ts` change |
| `yarn migrate:dev` | Diffs `schema.prisma` against the DB, generates + applies a migration, regenerates the client (local dev only — needs a shadow DB, which Prisma creates/drops automatically) |
| `yarn migrate:deploy` | Applies already-generated migrations without diffing — what production/CI runs |
| `yarn prisma:studio` | Opens Prisma Studio, a GUI for browsing/editing the DB (alternative to Postico) |
| *(auto)* `postinstall` | Runs `prisma generate` after every `yarn install`, so the client is always in sync with `schema.prisma` |

**Migrations so far** (now a single generated migration, since the switch from Knex re-created the schema from `schema.prisma` rather than translating the old migration history):
- `20261020163032_init` — creates `users`, `organizations`, `schools` with the same constraints the five original Knex migrations built up: `users.email` unique; `organizations.owner_id` → `users.id` (`RESTRICT` on delete); `schools.organization_id` → `organizations.id` (`CASCADE` on delete) with an index; `schools.level` as a native Postgres enum (`school_level`); `schools.onboarded_at` nullable, null until onboarding completes (PRD acceptance criterion: a school only appears in the sidebar switcher once onboarding is done); `users.full_name` required. The **users-vs-staff split** (auth identity vs. school-scoped profile, a `staff.user_id` FK added later for staff who log in) still holds — it was a data-model decision, not a Knex-specific one.

**API endpoints so far** (first vertical slice — PRD Goal #1, "register an organization, add a school"):

| Method & path | Auth | Body | Notes |
|---|---|---|---|
| `POST /api/auth/register` | — | `{ fullName, organizationName, email, password }` | Creates `users` + `organizations` in one transaction (`owner_id` set), returns a JWT. Rejects a duplicate email with 409. |
| `POST /api/auth/login` | — | `{ email, password }` | Verifies password, looks up the organization owned by that user, returns a fresh JWT. |
| `GET /api/auth/me` | Bearer JWT | — | Returns the authenticated user + their organization, looked up fresh from the DB each call (not just decoded from the token) — returns 401 if either no longer exists. |
| `POST /api/schools` | Bearer JWT | `{ name, level }` | Creates a school under the authenticated proprietor's `organizationId` (from the token, not the request body — can't create a school in someone else's org). |
| `GET /api/schools` | Bearer JWT | — | Lists schools for the authenticated proprietor's organization. |

All endpoints were manually tested end-to-end against the local DB (register → login → `/me` → create school → list school → reject with no token → reject invalid/garbage token → reject invalid payload) before the test data was cleared.

**Not yet built:** the onboarding wizard endpoint (`PATCH /schools/:id/onboard`, setting `onboarded_at`) — it needs a `terms` table (and a decision on how grade/class structure is captured) that hasn't been designed yet.

## Frontend — `patino-school-fe`

Moved to its own doc, in its own repo: [`patino-school-fe/doc/Architecture.md`](../../patino-school-fe/doc/Architecture.md). Covers the frontend's folder structure, state management (Zustand + TanStack Query), UI kit, and the V1 design pass (mock-data screens for every PRD module). Kept here only as a pointer, since frontend architecture belongs in the frontend repo, not duplicated across both.
