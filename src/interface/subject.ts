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

export interface ClassSummaryForSubject {
  id: string;
  name: string;
}

export interface ClassSubjectResponse {
  id: string;
  classId: string;
  class: ClassSummaryForSubject;
  subject: SubjectResponse;
  subjectTeacher: SubjectTeacherSummary | null;
}

/** Either classId or subjectTeacherId must be given — scopes to one class's subjects, or one teacher's subjects across all classes. */
export interface ListClassSubjectsQuery {
  classId?: string;
  subjectTeacherId?: string;
}
