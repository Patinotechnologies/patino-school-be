import { Router } from "express";
import { staffController } from "../controllers/staffController";
import { authenticate } from "../middlewares/authenticate";
import { validate, validateQuery } from "../middlewares/validate";
import { createStaffSchema, listStaffQuerySchema } from "../validations/staffValidation";

export const staffRoutes = Router();

staffRoutes.use(authenticate);
staffRoutes.get("/", validateQuery(listStaffQuerySchema), staffController.list);
staffRoutes.post("/", validate(createStaffSchema), staffController.create);
staffRoutes.get("/:id", staffController.getOne);
staffRoutes.delete("/:id", staffController.remove);
