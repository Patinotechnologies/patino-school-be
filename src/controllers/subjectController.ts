import type { Request, Response } from "express";
import { subjectService } from "../services/subjectService";

export const subjectController = {
  async list(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const { schoolId } = req.validatedQuery as { schoolId: string };
    const subjects = await subjectService.listForSchool(organizationId, schoolId);
    res.status(200).json(subjects);
  },

  async create(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const subject = await subjectService.create(organizationId, req.body);
    res.status(201).json(subject);
  },

  async update(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const subject = await subjectService.update(organizationId, req.params.id as string, req.body);
    res.status(200).json(subject);
  },
};
