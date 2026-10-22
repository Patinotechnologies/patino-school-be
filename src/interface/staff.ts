export type StaffRole = "school_admin" | "bursar" | "class_teacher" | "subject_teacher";

export interface CreateStaffRequest {
  fullName: string;
  email: string;
  phone?: string | null;
  role: StaffRole;
}

export interface StaffResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: StaffRole;
  active: boolean;
}

export interface ListStaffQuery {
  search?: string;
  role?: StaffRole;
  active?: boolean;
  page: number;
  pageSize: number;
}

export interface PaginatedStaffResponse {
  data: StaffResponse[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
