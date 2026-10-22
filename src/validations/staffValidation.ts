import { z } from "zod";

export const createStaffSchema = z.object({
  fullName: z.string().trim().min(2).max(255),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().min(1).max(50).nullable().optional(),
  role: z.enum(["school_admin", "bursar", "class_teacher", "subject_teacher"]),
});

export const listStaffQuerySchema = z.object({
  search: z.string().trim().min(1).max(255).optional(),
  role: z.enum(["school_admin", "bursar", "class_teacher", "subject_teacher"]).optional(),
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});
