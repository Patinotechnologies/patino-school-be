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
