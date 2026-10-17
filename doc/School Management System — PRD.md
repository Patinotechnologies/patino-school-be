# School Management System — PRD

Oct 16, 2026 · @Moses Tyav

## Problem Statement

Private school groups running nursery, primary, and secondary arms under one proprietor manage enrollment, attendance, grading, and fees through paper registers, spreadsheets, and disconnected tools, one set per school level. Proprietors have no single view of enrollment, attendance, or fee collection across their schools, and teachers have no consistent digital way to mark attendance or submit exam scores, so admin staff retype their notebooks by hand.

This fragmentation causes delayed report cards, lost or unreconciled fee records, and no early warning on falling attendance or collection rates. The cost falls on proprietors (lost revenue visibility, slow decisions), admin staff (duplicate data entry), and teachers (no single place to do their core recurring tasks).

## Goals and Non-Goals

### Goals (V1)

1. A proprietor can register an organization, add a new school, and complete onboarding (grades, terms, staff count) in under 15 minutes end to end.
2. A proprietor has one login that switches between every school in their organization and sees consolidated enrollment, attendance, and fee-collection stats on the dashboard.
3. At least 90% of classes have their attendance marked and exam scores entered directly by the assigned teacher through their own portal, with no admin intermediary, within the first term of use.
4. Term report cards generate in minutes once scores are entered, replacing a manual compilation process that previously took days.
5. Bursars can see fee collection rate by school and by term in real time, without manually reconciling receipts.

### Non-Goals (V1) — deferred to V2

- **Parent portal.** The primary pain today is internal (admin and teacher) workflow; parent-facing access is valuable but not required to prove the core loop.
- **SMS/email notifications.** Useful for engagement, but not required to validate that admins and teachers will use the system for their core recurring tasks.
- **Payroll processing.** Staff salary payment is a distinct financial workflow with its own compliance requirements; including it would roughly double the finance module's scope.
- **Transport/bus routing and library management.** Niche modules not common to every school; better scoped as optional add-ons once core adoption is proven.
- **Lesson notes and extracurricular/club management.** Useful but secondary to the core academic-record and fee-collection loop V1 is built to prove.

## User Roles and Personas

| Role | Who they are | Primary needs | Scope of access |
|---|---|---|---|
| Proprietor / Principal | Owns the organization; oversees all schools under it | Cross-school visibility, org-level settings, financial oversight | All schools in the organization |
| School Admin | Runs day-to-day operations for one school | Pupil and staff management, class setup, day-to-day exceptions | One school at a time (selected via sidebar) |
| Bursar | Manages fees and payments for one or more schools | Fee structure setup, invoicing, payment tracking, reconciliation | One or more assigned schools |
| Class Teacher | Owns one class, mainly in nursery/primary | Attendance marking, scores entry, pupil roster for their class | Their assigned class only |
| Subject Teacher | Teaches one or more subjects across classes, mainly in secondary | Scores entry per subject per class they teach | Only their assigned classes and subjects |

## User Stories

### Proprietor / Principal

- As a proprietor, I want to register my organization once so that I can add every school I own under a single account.
- As a proprietor, I want to switch between my nursery, primary, and secondary schools from a sidebar dropdown so that I don't need separate logins per school.
- As a proprietor, I want a dashboard with enrollment, attendance, and fee-collection stats per school so that I can spot problems without visiting each school.
- As a proprietor, I want to assign roles (admin, bursar, teacher) to staff so that each person only sees what they need.

### School Admin

- As a school admin, I want to complete an onboarding wizard (staff count, grade structure, terms) when a new school is added so that the system is configured correctly from day one.
- As a school admin, I want to enroll a pupil and assign them to a class/grade so that they appear in attendance, exam, and fee records immediately.
- As a school admin, I want to record a pupil's guardian contact information so that the school has it on file even before the parent portal exists.
- As a school admin, I want to create classes and assign a class teacher and subject teachers to them so that the right people can mark attendance and enter scores.

### Bursar

- As a bursar, I want to define a fee structure per grade/term so that invoices are generated consistently.
- As a bursar, I want to generate and send a fee invoice to a pupil's record so that I have a traceable record of what is owed.
- As a bursar, I want to record a payment against an invoice so that I can track who has paid and who has not.
- As a bursar, I want to see a fee collection rate by school and term so that I can report on outstanding balances without manual reconciliation.

### Class Teacher

- As a class teacher, I want to log into my own portal so that I don't depend on an admin to do my daily tasks.
- As a class teacher, I want to mark daily attendance for my class so that the record is accurate and timely.
- As a class teacher, I want to see my class roster with pupil names and photos so that I can take attendance quickly, especially for younger pupils.

### Subject Teacher

- As a subject teacher, I want to see only the classes and subjects assigned to me so that I don't accidentally edit another teacher's records.
- As a subject teacher, I want to enter exam scores for my subject per class so that report cards can be generated once all subjects are in.
- As a subject teacher, I want to be warned if I try to submit a report card with missing scores so that I don't generate incomplete report cards.

## Key User Flows

### Organization and school setup

One organization, many schools, one dashboard:

```
Register organization → Add a school → Onboarding wizard (staff, grades, terms) → Dashboard (switch schools via sidebar)
                              ↑                                                            |
                              └──────────────────── add another school ────────────────────┘
```

4 steps, loop back to add more schools.

### Teacher portal login

1. Teacher receives an invite (email/username) created by the school admin during staff setup.
2. Teacher logs into their own portal, separate from the admin dashboard, scoped to their assigned school.
3. Teacher lands on a simplified home screen showing only their assigned classes/subjects, attendance, and exam entry.

### Attendance marking (class teacher)

1. Teacher opens their class roster for the current date.
2. Teacher marks each pupil present, absent, or late.
3. Submitted attendance is locked for editing after a configurable window (for example, end of day) unless an admin reopens it.
4. Attendance stats roll up to the school dashboard in real time.

### Exam score entry (subject teacher)

1. Admin opens the exam/term window, making score entry available for a specific term and subject.
2. Subject teacher selects their class and subject, and enters scores per pupil (or imports from a template).
3. System validates scores against the maximum for that assessment and flags missing entries.
4. Once all subjects for a class are submitted, the admin or system triggers report card generation for that class and term.

### Fee payment (bursar)

1. Bursar defines or confirms the fee structure for a grade and term.
2. System (or bursar manually) generates an invoice per pupil in that grade for the term.
3. Bursar records a payment against an invoice (full or partial) as it is received.
4. Dashboard and school-level fee stats update to reflect the new collection rate.

## Requirements by Module

### Organization & School Setup

**P0**
- Proprietor can register an organization with a name and their own admin credentials.
- Proprietor can add multiple schools under one organization, each tagged by level (nursery, primary, secondary).
- Sidebar school switcher lets any authorized user move between schools they have access to without re-logging in.
- Onboarding wizard captures staff count, grade/class structure, and term/session structure for a newly added school before it becomes active.

**P1**
- Organization-level branding (logo, color) applied across all schools under it.
- Bulk-import of grade/class templates from a prior school when adding a new one.

**Acceptance criteria**
- [ ] Given a new organization is registered, when the proprietor adds a school, then it appears in the sidebar switcher only after onboarding is completed.
- [ ] Given onboarding is incomplete, when any user tries to access that school's dashboard, then they are redirected back to onboarding.

### Roles & Permissions

**P0**
- Define roles: proprietor, school admin, bursar, class teacher, subject teacher.
- Each role's sidebar and available actions are restricted to what that role needs (for example, a subject teacher cannot see fee records).
- A staff member can be assigned a role scoped to one or more specific schools in the organization.

**P1**
- Custom roles with configurable permission sets.

**Acceptance criteria**
- [ ] Given a subject teacher logs in, when they view the sidebar, then Bursary and Staff management are not shown.
- [ ] Given a class teacher is assigned to School A only, when they log in, then School B does not appear in their sidebar switcher.

### Pupils

**P0**
- Enroll a pupil with name, date of birth, class/grade assignment, and guardian contact details (name, phone, relationship).
- View and edit a pupil's profile and enrollment history.
- Transfer a pupil between classes or schools within the organization.

**P1**
- Bulk-import pupils via spreadsheet upload.
- Pupil photo upload for attendance roster recognition.

**Acceptance criteria**
- [ ] Given a pupil is enrolled, when the admin assigns them to a class, then they appear on that class teacher's attendance roster immediately.
- [ ] Given a pupil has no guardian contact on file, when the admin tries to save the enrollment, then they are warned but not blocked (guardian info is required for V2 parent portal readiness, not a hard V1 gate).

### Staff

**P0**
- Create a staff profile with name, role, and contact details.
- Assign a staff member to one or more classes and/or subjects.
- Deactivate a staff member without deleting their historical records (attendance/scores they submitted remain intact).

**P1**
- Staff attendance/leave tracking.

**Acceptance criteria**
- [ ] Given a staff member is assigned as a class teacher, when they log into their portal, then their assigned class's roster is visible by default.
- [ ] Given a staff member is deactivated, when an admin views past report cards they submitted scores for, then those records are unchanged.

### Classes / Grades

**P0**
- Define grade/class structure per school level during onboarding (for example, Nursery 1-2, Primary 1-6, JSS 1-3, SSS 1-3).
- Assign a class teacher to each class, and subject teachers to subjects within a class.
- Each class is scoped to a specific school and academic session.

**P1**
- Class capacity limits with warnings on over-enrollment.

**Acceptance criteria**
- [ ] Given a class is created, when a pupil is assigned to it, then the pupil's class shows correctly on their profile and on the teacher's roster.

### Attendance

**P0**
- Class teacher marks daily attendance (present/absent/late) for their own class only.
- Attendance is scoped to a specific date and academic term.
- Admin can view attendance summaries by class and by school.

**P1**
- Attendance auto-locks after a configurable daily cutoff, reopenable only by an admin.
- Attendance trends/alerts for pupils with repeated absences.

**Acceptance criteria**
- [ ] Given a class teacher marks attendance for today, when they view the dashboard, then today's attendance stat updates for their school.
- [ ] Given attendance was marked yesterday, when the class teacher tries to edit it today without admin reopening it, then the edit is blocked.

### Exams & Report Cards

**P0**
- Admin opens a scoring window for a specific term and set of subjects.
- Subject teacher enters scores for their assigned subject and class, scoped to the open term.
- System validates scores against a configured maximum and flags missing entries before report card generation.
- System generates a term report card per pupil once all subjects for their class are submitted.

**P1**
- Automatic computation of class position/ranking.
- Report card templates customizable per school level (nursery vs secondary need different layouts).

**Acceptance criteria**
- [ ] Given a subject teacher submits scores for all pupils in their class, when the last required subject is submitted, then the report card generation becomes available for that class and term.
- [ ] Given a score exceeds the configured maximum, when the teacher tries to save it, then they see a validation error and cannot submit.

### Finance / Bursary

**P0**
- Bursar defines a fee structure per grade and term.
- System generates an invoice per pupil based on the fee structure for their grade and term.
- Bursar records full or partial payments against an invoice.
- Dashboard shows fee collection rate (collected vs invoiced) per school and term.

**P1**
- Payment receipt generation (PDF/printable).
- Outstanding-balance report exportable by class or by school.

**Acceptance criteria**
- [ ] Given a fee structure is defined for Primary 3, Term 1, when a pupil in that grade is enrolled, then an invoice is generated for them automatically.
- [ ] Given a payment is recorded against an invoice, when the bursar views the school's collection rate, then it updates to reflect that payment.

### Dashboard

**P0**
- Shows enrollment count, attendance rate, and fee collection rate for the currently selected school.
- Proprietor view aggregates these stats across all schools in the organization.

**P1**
- Trend charts (enrollment or collection rate over the last several terms).

**Acceptance criteria**
- [ ] Given a proprietor switches schools via the sidebar, when the dashboard reloads, then all stats reflect only the newly selected school.

### Settings & Logout

**P0**
- Update organization and school-level settings (name, academic calendar, terms).
- Logout ends the session and returns to the login screen.

**Acceptance criteria**
- [ ] Given a user clicks logout, when they try to navigate back, then they are redirected to the login screen, not the dashboard.

## Data Model Overview

| Entity | Key fields | Relationships |
|---|---|---|
| Organization | name, owner (proprietor) | Has many Schools |
| School | name, level (nursery/primary/secondary), org_id | Belongs to Organization; has many Classes, Pupils, Staff, Terms |
| Term/Session | name, school_id, start_date, end_date | Belongs to School; has many Attendance records, Exam windows, Invoices |
| Class/Grade | name, school_id, level, class_teacher_id | Belongs to School; has many Pupils; has many Subject assignments |
| Staff | name, role, contact, school_ids | Assigned to one or more Schools, Classes, and/or Subjects |
| Pupil | name, date_of_birth, class_id, guardian_name, guardian_phone | Belongs to one Class; has many Attendance records, Scores, Invoices |
| Attendance | pupil_id, class_id, date, status (present/absent/late) | Belongs to Pupil and Class, scoped to a Term |
| Subject | name, class_id, subject_teacher_id | Belongs to Class; has many Scores |
| Score | pupil_id, subject_id, term_id, value, max_value | Belongs to Pupil, Subject, and Term; feeds Report Card |
| Report Card | pupil_id, term_id, generated_at | Generated from all Scores for a Pupil in a Term |
| Fee Structure | grade_id, term_id, amount | Belongs to a grade within a School and Term |
| Invoice | pupil_id, term_id, amount_due, amount_paid, status | Generated from Fee Structure; belongs to Pupil and Term |
| Payment | invoice_id, amount, date, recorded_by | Belongs to Invoice |

A Pupil, Staff member, and Class always resolve to exactly one School; a School always resolves to exactly one Organization. This single-parent chain is what makes the sidebar school switcher and the proprietor's cross-school dashboard aggregation straightforward.

## Success Metrics

### Leading indicators (first 30 days of use per school)

| Metric | Target |
|---|---|
| Onboarding completion rate (org registered to first school active) | 80% complete within 15 minutes |
| % of classes with teacher-entered attendance (not admin-entered) | 90% by end of first term |
| % of assigned subjects with teacher-entered scores (not admin-entered) | 90% by end of first term |
| Time to generate a term report card once all scores are in | Under 5 minutes, system-generated |
| Daily active admin/teacher logins per school | 70% of staff log in at least 3x per week |

### Lagging indicators (one term and beyond)

| Metric | Target |
|---|---|
| Fee collection rate visibility (bursar can state current rate without manual reconciliation) | 100% of schools using the system |
| Reduction in time admin staff spend on manual record compilation | 50% reduction vs. pre-system baseline |
| Proprietor retention (organizations still active after one full term) | 85% |
| Schools adding a second school to their organization within 6 months | 30% (signals the multi-school value prop is working) |

## Open Questions

- Should a staff member hold different roles at different schools within the same organization (for example, bursar at School A and class teacher at School B)? (product, blocking — affects the roles & permissions data model)
- What happens to a pupil's historical attendance and scores when they transfer between schools in the same organization mid-term? (product, blocking — affects Pupil/Class relationship design)
- Does the report card format need to differ meaningfully between nursery (often skills/behavior-based, no numeric scores) and primary/secondary (numeric scores, class position)? (design, blocking — affects the Score and Report Card data model)
- ~~What is the offline/low-connectivity expectation for teachers marking attendance or entering scores, given many schools may have inconsistent internet access?~~ **Resolved:** the teacher portal must work offline. See [Architecture.md](./Architecture.md).
- Is there a target market/region to validate currency, academic calendar conventions (term vs semester), and grading scale defaults against? (stakeholder, blocking — affects Fee Structure currency and Term defaults)

## Timeline / Phasing

No hard external deadline is set for V1; phasing is sequenced by validating the core admin + teacher workflow before investing in parent-facing or niche operational features.

| Phase | Scope | Rationale |
|---|---|---|
| V1 | Org & school setup, roles & permissions, pupils, staff, classes/grades, attendance, exams & report cards, finance/bursary, dashboard, settings | Proves the core internal workflow loop: admins and teachers can run a school's daily academic and financial record-keeping end to end without paper or spreadsheets |
| V2 | Parent portal, SMS/email notifications, lesson notes, extracurricular/clubs | Adds engagement and communication once the core record-keeping loop is validated with real schools |
| V3 (parking lot, not yet scoped) | Payroll, library management, transport/bus routing, exam timetable generator | Niche or compliance-heavy modules best tackled once V1/V2 usage shows which schools actually need them |
