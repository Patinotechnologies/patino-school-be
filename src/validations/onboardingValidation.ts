import { z } from "zod";
import { createSchoolSchema } from "./schoolValidation";
import { createStaffSchema } from "./staffValidation";

export const completeOnboardingSchema = z.object({
  organization: z.object({
    phone: z.string().trim().min(1).max(50).nullable().optional(),
    email: z.string().trim().toLowerCase().email().nullable().optional(),
  }),
  schools: z.array(createSchoolSchema).min(1, "Add at least one school"),
  staff: z
    .array(createStaffSchema)
    .default([])
    .refine((staff) => new Set(staff.map((s) => s.email)).size === staff.length, {
      message: "Staff emails must be unique",
    }),
});
