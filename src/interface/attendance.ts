export type AttendanceStatus = "present" | "absent" | "late";

export interface MarkAttendanceEntry {
  pupilId: string;
  status: AttendanceStatus;
}

/**
 * Takes attendance for a class, a subject period, or a named extra activity — pass `subjectId` for a
 * real Subject, `activity` as free text otherwise (e.g. "Sports Day"), or neither for whole-class/homeroom
 * attendance. Reuses the matching session for this class+date+subject/activity if one already exists,
 * so re-submitting the same roster corrects it in place rather than creating a duplicate.
 */
export interface MarkAttendanceRequest {
  classId: string;
  date: string;
  subjectId?: string | null;
  activity?: string | null;
  records: MarkAttendanceEntry[];
}

export interface AttendancePupilSummary {
  id: string;
  fullName: string;
}

export interface AttendanceRecordEntryResponse {
  id: string;
  pupil: AttendancePupilSummary;
  status: AttendanceStatus;
}

export interface AttendanceSessionResponse {
  id: string;
  classId: string;
  subjectId: string | null;
  subjectName: string | null;
  activity: string | null;
  date: string;
  records: AttendanceRecordEntryResponse[];
}

export interface ListAttendanceSessionsQuery {
  classId: string;
  date?: string;
}

/** One pupil's attendance record, flattened across all classes in a school — for the admin attendance log. */
export interface AttendanceLogEntry {
  pupilId: string;
  pupilName: string;
  classId: string;
  className: string;
  subjectId: string | null;
  subjectName: string | null;
  activity: string | null;
  date: string;
  status: AttendanceStatus;
}

export interface ListAttendanceLogQuery {
  schoolId: string;
  classId?: string;
  page: number;
  pageSize: number;
}

export interface PaginatedAttendanceLogResponse {
  data: AttendanceLogEntry[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
