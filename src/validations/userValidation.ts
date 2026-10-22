import { z } from "zod";

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(2).max(255).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  phone: z.string().trim().min(1).max(50).nullable().optional(),
});
