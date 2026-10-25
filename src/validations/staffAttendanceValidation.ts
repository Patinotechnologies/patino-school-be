import { z } from "zod";

export const upsertStaffAttendanceSettingsSchema = z.object({
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected a 24-hour HH:MM time"),
  gracePeriodMinutes: z.coerce.number().int().min(0).max(240),
});

export const listStaffAttendanceQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a date in YYYY-MM-DD format")
    .optional(),
});
