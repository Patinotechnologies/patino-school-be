export type GuardianRelationship = "mother" | "father" | "guardian";
export type PupilStatus = "active" | "suspended";

export interface CreatePupilRequest {
  schoolId: string;
  classId?: string | null;
  fullName: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelationship: GuardianRelationship;
  address?: string | null;
}

export interface UpdatePupilRequest {
  classId?: string | null;
  fullName?: string;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelationship?: GuardianRelationship;
  address?: string | null;
}

export interface PupilClassSummary {
  id: string;
  name: string;
}

export interface PupilResponse {
  id: string;
  schoolId: string;
  class: PupilClassSummary | null;
  fullName: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelationship: GuardianRelationship;
  address: string | null;
  status: PupilStatus;
  suspensionReason: string | null;
}

export interface ListPupilsQuery {
  schoolId: string;
  classId?: string;
  search?: string;
  page: number;
  pageSize: number;
}

export interface PaginatedPupilResponse {
  data: PupilResponse[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/** Moves one or more pupils to a different class in one request — or unassigns them with classId: null. */
export interface MovePupilsRequest {
  pupilIds: string[];
  classId: string | null;
}

export interface SuspendPupilRequest {
  reason: string;
}
