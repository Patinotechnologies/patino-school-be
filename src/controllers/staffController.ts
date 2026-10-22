import type { Request, Response } from "express";
import { staffService } from "../services/staffService";
import type { ListStaffQuery } from "../interface/staff";

export const staffController = {
  async list(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const query = req.validatedQuery as ListStaffQuery;
    const result = await staffService.listForOrganization(organizationId, query);
    res.status(200).json(result);
  },

  async create(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const staff = await staffService.create(organizationId, req.body);
    res.status(201).json(staff);
  },
};
