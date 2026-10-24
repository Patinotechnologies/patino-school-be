import { z } from "zod";

export const createClassSchema = z.object({
  schoolId: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  classTeacherId: z.string().uuid().nullable().optional(),
});

export const updateClassSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  classTeacherId: z.string().uuid().nullable().optional(),
});

export const listClassesQuerySchema = z.object({
  schoolId: z.string().uuid(),
});
