import type { Request, Response } from "express";
import { classSubjectService } from "../services/classSubjectService";
import type { ListClassSubjectsQuery } from "../interface/subject";

export const classSubjectController = {
  async list(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const { classId, subjectTeacherId } = req.validatedQuery as ListClassSubjectsQuery;
    const classSubjects = classId
      ? await classSubjectService.listForClass(organizationId, classId)
      : await classSubjectService.listForTeacher(organizationId, subjectTeacherId!);
    res.status(200).json(classSubjects);
  },

  async assign(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const classSubject = await classSubjectService.assign(organizationId, req.body);
    res.status(200).json(classSubject);
  },
};
