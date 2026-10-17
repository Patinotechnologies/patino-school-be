export const SCHOOLS_TABLE = "schools";

export type SchoolLevel = "nursery" | "primary" | "secondary";

export interface School {
  id: string;
  /** FK → organizations.id, ON DELETE CASCADE (see 20261016000004_create_schools_table). Not unique — an org can have many schools. */
  organization_id: string;
  /** Not unique — two schools in the same org could share a name; nothing currently prevents it. */
  name: string;
  /** Postgres native enum `school_level`, not just a TS union — the DB rejects any value outside SchoolLevel too. */
  level: SchoolLevel;
  /** Nullable; null until the onboarding wizard completes (gates sidebar visibility per the PRD). */
  onboarded_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/** Shape required to insert a row — id/timestamps are DB-generated, and onboarded_at defaults to null until onboarding completes. */
export type NewSchool = Omit<School, "id" | "onboarded_at" | "created_at" | "updated_at">;
