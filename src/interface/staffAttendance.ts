import type { StaffRole } from "./staff";

export type StaffAttendanceStatus = "present" | "late" | "absent";

export interface StaffAttendanceSettingsResponse {
  checkInTime: string;
  gracePeriodMinutes: number;
}

export interface UpdateStaffAttendanceSettingsRequest {
  checkInTime: string;
  gracePeriodMinutes: number;
}

export interface StaffCheckInResponse {
  staffId: string;
  date: string;
  checkInAt: string;
  status: StaffAttendanceStatus;
}

export interface ListStaffAttendanceQuery {
  date?: string;
}

export interface StaffAttendanceEntry {
  staffId: string;
  fullName: string;
  role: StaffRole;
  checkInAt: string | null;
  status: StaffAttendanceStatus;
}

export interface StaffAttendanceHistoryEntry {
  date: string;
  checkInAt: string;
  status: StaffAttendanceStatus;
}
