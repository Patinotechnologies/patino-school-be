import { z } from "zod";

export const acceptStaffInviteSchema = z.object({
  token: z.string().trim().min(1),
  password: z.string().min(8).max(72),
});

export const staffLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});
