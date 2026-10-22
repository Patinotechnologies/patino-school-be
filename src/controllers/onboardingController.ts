import type { Request, Response } from "express";
import { onboardingService } from "../services/onboardingService";

export const onboardingController = {
  async complete(req: Request, res: Response) {
    const result = await onboardingService.complete(req.auth!, req.body);
    res.status(200).json(result);
  },
};
