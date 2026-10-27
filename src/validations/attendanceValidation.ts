import { z } from "zod";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a date in YYYY-MM-DD format");

export const markAttendanceSchema = z.object({
  classId: z.string().uuid(),
  date: dateSchema,
  subjectId: z.string().uuid().nullable().optional(),
  activity: z.string().trim().min(1).max(255).nullable().optional(),
  records: z
    .array(
      z.object({
        pupilId: z.string().uuid(),
        status: z.enum(["present", "absent", "late"]),
      }),
    )
    .min(1, "Add at least one pupil"),
});

export const listAttendanceQuerySchema = z.object({
  classId: z.string().uuid(),
  date: dateSchema.optional(),
});

export const listAttendanceLogQuerySchema = z.object({
  schoolId: z.string().uuid(),
  classId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(200).optional().default(100),
});
