import { Router } from "express";
import { userController } from "../controllers/userController";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import { updateUserSchema } from "../validations/userValidation";

export const userRoutes = Router();

userRoutes.use(authenticate);
userRoutes.get("/me", userController.getMe);
userRoutes.patch("/me", validate(updateUserSchema), userController.updateMe);
