import { Router } from "express";
import { organizationController } from "../controllers/organizationController";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import { updateOrganizationSchema } from "../validations/organizationValidation";

export const organizationRoutes = Router();

organizationRoutes.use(authenticate);
organizationRoutes.get("/me", organizationController.getMe);
organizationRoutes.patch("/me", validate(updateOrganizationSchema), organizationController.updateMe);
organizationRoutes.get("/stats", organizationController.getStats);
