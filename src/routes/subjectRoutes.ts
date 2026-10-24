import { Router } from "express";
import { subjectController } from "../controllers/subjectController";
import { authenticate } from "../middlewares/authenticate";
import { validate, validateQuery } from "../middlewares/validate";
import { createSubjectSchema, listSubjectsQuerySchema, updateSubjectSchema } from "../validations/subjectValidation";

export const subjectRoutes = Router();

subjectRoutes.use(authenticate);
subjectRoutes.get("/", validateQuery(listSubjectsQuerySchema), subjectController.list);
subjectRoutes.post("/", validate(createSubjectSchema), subjectController.create);
subjectRoutes.patch("/:id", validate(updateSubjectSchema), subjectController.update);
