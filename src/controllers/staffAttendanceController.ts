import type { Request, Response } from "express";
import { staffAttendanceService } from "../services/staffAttendanceService";
import type { ListStaffAttendanceQuery } from "../interface/staffAttendance";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export const staffAttendanceController = {
  async getSettings(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const settings = await staffAttendanceService.getSettings(organizationId);
    res.status(200).json(settings);
  },

  async updateSettings(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const settings = await staffAttendanceService.updateSettings(organizationId, req.body);
    res.status(200).json(settings);
  },

  async list(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const { date } = req.validatedQuery as ListStaffAttendanceQuery;
    const entries = await staffAttendanceService.listForDate(organizationId, date ?? todayIsoDate());
    res.status(200).json(entries);
  },

  async getForStaff(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const entries = await staffAttendanceService.listForStaff(organizationId, req.params.staffId as string);
    res.status(200).json(entries);
  },

  async checkIn(req: Request, res: Response) {
    const { staffId, organizationId } = req.staffAuth!;
    const result = await staffAttendanceService.checkIn(staffId, organizationId);
    res.status(201).json(result);
  },

  async getTodayCheckIn(req: Request, res: Response) {
    const { staffId, organizationId } = req.staffAuth!;
    const result = await staffAttendanceService.getTodayCheckIn(staffId, organizationId);
    res.status(200).json(result);
  },
};
