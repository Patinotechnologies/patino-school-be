import { z } from "zod";

export const createSubjectSchema = z.object({
  schoolId: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  testMaxScore: z.coerce.number().min(0).optional().default(0),
  assignmentMaxScore: z.coerce.number().min(0).optional().default(0),
  examMaxScore: z.coerce.number().min(0).optional().default(0),
});

export const updateSubjectSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  testMaxScore: z.coerce.number().min(0).optional(),
  assignmentMaxScore: z.coerce.number().min(0).optional(),
  examMaxScore: z.coerce.number().min(0).optional(),
});

export const listSubjectsQuerySchema = z.object({
  schoolId: z.string().uuid(),
});

export const assignClassSubjectSchema = z.object({
  classId: z.string().uuid(),
  subjectId: z.string().uuid(),
  subjectTeacherId: z.string().uuid().nullable().optional(),
});

export const listClassSubjectsQuerySchema = z.object({
  classId: z.string().uuid(),
});
