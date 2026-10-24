import type { Request, Response } from "express";
import { classSubjectService } from "../services/classSubjectService";

export const classSubjectController = {
  async list(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const { classId } = req.validatedQuery as { classId: string };
    const classSubjects = await classSubjectService.listForClass(organizationId, classId);
    res.status(200).json(classSubjects);
  },

  async assign(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const classSubject = await classSubjectService.assign(organizationId, req.body);
    res.status(200).json(classSubject);
  },
};
