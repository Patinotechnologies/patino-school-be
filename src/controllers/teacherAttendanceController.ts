import type { Request, Response } from "express";
import { teacherAttendanceService } from "../services/teacherAttendanceService";
import type { ListAttendanceSessionsQuery } from "../interface/attendance";

export const teacherAttendanceController = {
  async listPupils(req: Request, res: Response) {
    const { staffId, organizationId } = req.staffAuth!;
    const { classId } = req.validatedQuery as { classId: string };
    const pupils = await teacherAttendanceService.listPupils(staffId, organizationId, classId);
    res.status(200).json(pupils);
  },

  async listSessions(req: Request, res: Response) {
    const { staffId, organizationId } = req.staffAuth!;
    const { classId, date } = req.validatedQuery as ListAttendanceSessionsQuery;
    const sessions = await teacherAttendanceService.listSessions(staffId, organizationId, classId, date);
    res.status(200).json(sessions);
  },

  async markAttendance(req: Request, res: Response) {
    const { staffId, organizationId } = req.staffAuth!;
    const session = await teacherAttendanceService.markAttendance(staffId, organizationId, req.body);
    res.status(200).json(session);
  },
};
