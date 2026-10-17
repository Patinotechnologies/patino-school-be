import { Router } from "express";
import { schoolController } from "../controllers/schoolController";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import { createSchoolSchema } from "../validations/schoolValidation";

export const schoolRoutes = Router();

schoolRoutes.use(authenticate);
schoolRoutes.post("/", validate(createSchoolSchema), schoolController.create);
schoolRoutes.get("/", schoolController.list);
