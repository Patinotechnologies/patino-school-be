import type { Request, Response } from "express";
import { classService } from "../services/classService";

export const classController = {
  async list(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const { schoolId } = req.validatedQuery as { schoolId: string };
    const classes = await classService.listForSchool(organizationId, schoolId);
    res.status(200).json(classes);
  },

  async create(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const cls = await classService.create(organizationId, req.body);
    res.status(201).json(cls);
  },

  async getOne(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const cls = await classService.getById(organizationId, req.params.id as string);
    res.status(200).json(cls);
  },

  async update(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const cls = await classService.update(organizationId, req.params.id as string, req.body);
    res.status(200).json(cls);
  },
};
