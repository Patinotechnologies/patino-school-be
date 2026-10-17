import { z } from "zod";

export const createSchoolSchema = z.object({
  name: z.string().trim().min(2).max(255),
  level: z.enum(["nursery", "primary", "secondary"]),
});
