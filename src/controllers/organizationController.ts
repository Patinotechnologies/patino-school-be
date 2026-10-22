import type { Request, Response } from "express";
import { organizationService } from "../services/organizationService";

export const organizationController = {
  async getMe(req: Request, res: Response) {
    const result = await organizationService.getCurrent(req.auth!);
    res.status(200).json(result);
  },

  async updateMe(req: Request, res: Response) {
    const result = await organizationService.updateCurrent(req.auth!, req.body);
    res.status(200).json(result);
  },
};
