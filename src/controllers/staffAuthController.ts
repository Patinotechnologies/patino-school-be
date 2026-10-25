import type { Request, Response } from "express";
import { staffAuthService } from "../services/staffAuthService";

export const staffAuthController = {
  async acceptInvite(req: Request, res: Response) {
    const result = await staffAuthService.acceptInvite(req.body);
    res.status(200).json(result);
  },

  async login(req: Request, res: Response) {
    const result = await staffAuthService.login(req.body);
    res.status(200).json(result);
  },

  async me(req: Request, res: Response) {
    const { staffId, organizationId } = req.staffAuth!;
    const result = await staffAuthService.getMe(staffId, organizationId);
    res.status(200).json(result);
  },
};
