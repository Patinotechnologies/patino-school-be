import type { Request, Response } from "express";
import { schoolService } from "../services/schoolService";

export const schoolController = {
  async create(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const school = await schoolService.create(organizationId, req.body);
    res.status(201).json(school);
  },

  async list(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const schools = await schoolService.listForOrganization(organizationId);
    res.status(200).json(schools);
  },
};
