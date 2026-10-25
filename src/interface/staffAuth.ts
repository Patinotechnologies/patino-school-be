import type { StaffRole } from "./staff";

export interface AcceptStaffInviteRequest {
  token: string;
  password: string;
}

export interface StaffLoginRequest {
  email: string;
  password: string;
}

export interface StaffAuthSummary {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
}

export interface StaffAuthResponse {
  token: string;
  staff: StaffAuthSummary;
}

/** One thing a staff member can take attendance for — either their whole class, or one subject they teach in it. */
export interface StaffAssignment {
  type: "class" | "subject";
  classId: string;
  className: string;
  subjectId?: string;
  subjectName?: string;
}

export interface StaffMeResponse {
  staff: StaffAuthSummary;
  assignments: StaffAssignment[];
}
