import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(255).optional(),
  phone: z.string().trim().min(1).max(50).nullable().optional(),
  email: z.string().trim().toLowerCase().email().nullable().optional(),
});
