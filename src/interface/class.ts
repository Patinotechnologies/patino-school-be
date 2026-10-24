export interface CreateClassRequest {
  schoolId: string;
  name: string;
  classTeacherId?: string | null;
}

export interface UpdateClassRequest {
  name?: string;
  classTeacherId?: string | null;
}

export interface ClassTeacherSummary {
  id: string;
  fullName: string;
  email: string;
}

export interface ClassResponse {
  id: string;
  schoolId: string;
  name: string;
  classTeacher: ClassTeacherSummary | null;
}
