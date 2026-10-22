import type { Request, Response } from "express";
import { userService } from "../services/userService";

export const userController = {
  async getMe(req: Request, res: Response) {
    const result = await userService.getProfile(req.auth!);
    res.status(200).json(result);
  },

  async updateMe(req: Request, res: Response) {
    const result = await userService.updateProfile(req.auth!, req.body);
    res.status(200).json(result);
  },
};
