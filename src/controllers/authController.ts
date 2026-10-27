import type { Request, Response } from "express";
import { authService } from "../services/authService";

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  },

  async me(req: Request, res: Response) {
    const result = await authService.getCurrentUser(req.auth!);
    res.status(200).json(result);
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.auth!);
    res.status(204).send();
  },
};
