export interface CreateSubjectRequest {
  schoolId: string;
  name: string;
  testMaxScore?: number;
  assignmentMaxScore?: number;
  examMaxScore?: number;
}

/** Renaming a subject and/or changing its score weighting — e.g. Test 20, Assignment 20, Exam 60. */
export interface UpdateSubjectRequest {
  name?: string;
  testMaxScore?: number;
  assignmentMaxScore?: number;
  examMaxScore?: number;
}

export interface SubjectResponse {
  id: string;
  schoolId: string;
  name: string;
  testMaxScore: number;
  assignmentMaxScore: number;
  examMaxScore: number;
}

export interface ListSubjectsQuery {
  schoolId: string;
}

/** Assigns a subject to a class — "introducing a subject on a class" — with an optional subject teacher. */
export interface AssignClassSubjectRequest {
  classId: string;
  subjectId: string;
  subjectTeacherId?: string | null;
}

export interface UpdateClassSubjectRequest {
  subjectTeacherId?: string | null;
}

export interface SubjectTeacherSummary {
  id: string;
  fullName: string;
}

export interface ClassSubjectResponse {
  id: string;
  classId: string;
  subject: SubjectResponse;
  subjectTeacher: SubjectTeacherSummary | null;
}

export interface ListClassSubjectsQuery {
  classId: string;
}
