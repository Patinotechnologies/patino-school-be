import { Router } from "express";
import { onboardingController } from "../controllers/onboardingController";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import { completeOnboardingSchema } from "../validations/onboardingValidation";

export const onboardingRoutes = Router();

onboardingRoutes.use(authenticate);
onboardingRoutes.post("/complete", validate(completeOnboardingSchema), onboardingController.complete);
