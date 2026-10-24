import { Router } from "express";
import { classSubjectController } from "../controllers/classSubjectController";
import { authenticate } from "../middlewares/authenticate";
import { validate, validateQuery } from "../middlewares/validate";
import { assignClassSubjectSchema, listClassSubjectsQuerySchema } from "../validations/subjectValidation";

export const classSubjectRoutes = Router();

classSubjectRoutes.use(authenticate);
classSubjectRoutes.get("/", validateQuery(listClassSubjectsQuerySchema), classSubjectController.list);
classSubjectRoutes.post("/", validate(assignClassSubjectSchema), classSubjectController.assign);
