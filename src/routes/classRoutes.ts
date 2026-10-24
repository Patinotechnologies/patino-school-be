import { Router } from "express";
import { classController } from "../controllers/classController";
import { authenticate } from "../middlewares/authenticate";
import { validate, validateQuery } from "../middlewares/validate";
import { createClassSchema, listClassesQuerySchema, updateClassSchema } from "../validations/classValidation";

export const classRoutes = Router();

classRoutes.use(authenticate);
classRoutes.get("/", validateQuery(listClassesQuerySchema), classController.list);
classRoutes.post("/", validate(createClassSchema), classController.create);
classRoutes.get("/:id", classController.getOne);
classRoutes.patch("/:id", validate(updateClassSchema), classController.update);
