import { Router } from "express";
import { staffAuthController } from "../controllers/staffAuthController";
import { validate } from "../middlewares/validate";
import { acceptStaffInviteSchema, staffLoginSchema } from "../validations/staffAuthValidation";

export const staffAuthRoutes = Router();

staffAuthRoutes.post("/accept-invite", validate(acceptStaffInviteSchema), staffAuthController.acceptInvite);
staffAuthRoutes.post("/login", validate(staffLoginSchema), staffAuthController.login);
