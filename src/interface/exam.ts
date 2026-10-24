import type { Term } from "./academic";

export interface ExamScoreResponse {
  id: string;
  pupilId: string;
  classId: string;
  subjectId: string;
  term: Term;
  session: string;
  score: number;
}

export interface RecordExamScoreEntry {
  pupilId: string;
  score: number;
}

/** Scores for a class are entered one subject/term at a time, as a batch — matches the Exams page's score-entry table. */
export interface BulkRecordExamScoresRequest {
  classId: string;
  subjectId: string;
  term: Term;
  session: string;
  scores: RecordExamScoreEntry[];
}

export interface ListExamScoresQuery {
  classId: string;
  subjectId?: string;
  term: Term;
  session: string;
}

export interface ReportCardSubjectScore {
  subjectName: string;
  score: number;
}

/** One pupil's scores across every subject for a term — backs the report card preview. */
export interface ReportCardResponse {
  pupilId: string;
  classId: string;
  term: Term;
  session: string;
  subjects: ReportCardSubjectScore[];
  average: number;
}
