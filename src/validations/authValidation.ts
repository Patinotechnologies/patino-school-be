import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(255),
  organizationName: z.string().trim().min(2).max(255),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});
