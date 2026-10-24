import type { Request, Response } from "express";
import { attendanceService } from "../services/attendanceService";
import type { ListAttendanceSessionsQuery } from "../interface/attendance";

export const attendanceController = {
  async list(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const query = req.validatedQuery as ListAttendanceSessionsQuery;
    const sessions = await attendanceService.listForClass(organizationId, query);
    res.status(200).json(sessions);
  },

  async mark(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const session = await attendanceService.markAttendance(organizationId, req.body);
    res.status(200).json(session);
  },
};
