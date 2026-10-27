import { Router } from "express";
import { staffAuthController } from "../controllers/staffAuthController";
import { authenticateStaff } from "../middlewares/authenticateStaff";
import { validate } from "../middlewares/validate";
import { acceptStaffInviteSchema, staffLoginSchema } from "../validations/staffAuthValidation";

export const staffAuthRoutes = Router();

staffAuthRoutes.post("/accept-invite", validate(acceptStaffInviteSchema), staffAuthController.acceptInvite);
staffAuthRoutes.post("/login", validate(staffLoginSchema), staffAuthController.login);
staffAuthRoutes.get("/me", authenticateStaff, staffAuthController.me);
staffAuthRoutes.post("/logout", authenticateStaff, staffAuthController.logout);
