import { z } from "zod";

export const listPupilsForClassQuerySchema = z.object({
  classId: z.string().uuid(),
});
