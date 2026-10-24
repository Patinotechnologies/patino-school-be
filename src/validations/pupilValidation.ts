import { z } from "zod";

const dateOfBirthSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a date in YYYY-MM-DD format");

export const createPupilSchema = z.object({
  schoolId: z.string().uuid(),
  classId: z.string().uuid().nullable().optional(),
  fullName: z.string().trim().min(2).max(255),
  dateOfBirth: dateOfBirthSchema,
  guardianName: z.string().trim().min(2).max(255),
  guardianPhone: z.string().trim().min(1).max(50),
  guardianRelationship: z.enum(["mother", "father", "guardian"]),
  address: z.string().trim().min(1).max(500).nullable().optional(),
});

export const updatePupilSchema = z.object({
  classId: z.string().uuid().nullable().optional(),
  fullName: z.string().trim().min(2).max(255).optional(),
  dateOfBirth: dateOfBirthSchema.optional(),
  guardianName: z.string().trim().min(2).max(255).optional(),
  guardianPhone: z.string().trim().min(1).max(50).optional(),
  guardianRelationship: z.enum(["mother", "father", "guardian"]).optional(),
  address: z.string().trim().min(1).max(500).nullable().optional(),
});

export const movePupilsSchema = z.object({
  pupilIds: z.array(z.string().uuid()).min(1, "Select at least one pupil"),
  classId: z.string().uuid().nullable(),
});

export const suspendPupilSchema = z.object({
  reason: z.string().trim().min(1, "A reason is required").max(500),
});

export const listPupilsQuerySchema = z.object({
  schoolId: z.string().uuid(),
  classId: z.string().uuid().optional(),
  search: z.string().trim().min(1).max(255).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});
