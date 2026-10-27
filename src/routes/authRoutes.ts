import { Router } from "express";
import { authController } from "../controllers/authController";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../validations/authValidation";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), authController.register);
authRoutes.post("/login", validate(loginSchema), authController.login);
authRoutes.get("/me", authenticate, authController.me);
authRoutes.post("/logout", authenticate, authController.logout);
