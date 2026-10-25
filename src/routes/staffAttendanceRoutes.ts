import { Router } from "express";
import { staffAttendanceController } from "../controllers/staffAttendanceController";
import { authenticate } from "../middlewares/authenticate";
import { authenticateStaff } from "../middlewares/authenticateStaff";
import { validate, validateQuery } from "../middlewares/validate";
import { listStaffAttendanceQuerySchema, upsertStaffAttendanceSettingsSchema } from "../validations/staffAttendanceValidation";

export const staffAttendanceRoutes = Router();

// Admin-facing — settings and the org-wide attendance list.
staffAttendanceRoutes.get("/settings", authenticate, staffAttendanceController.getSettings);
staffAttendanceRoutes.put(
  "/settings",
  authenticate,
  validate(upsertStaffAttendanceSettingsSchema),
  staffAttendanceController.updateSettings,
);
staffAttendanceRoutes.get("/", authenticate, validateQuery(listStaffAttendanceQuerySchema), staffAttendanceController.list);

// Staff-facing (PWA) — check-in, authenticated as the staff member themselves.
staffAttendanceRoutes.post("/check-in", authenticateStaff, staffAttendanceController.checkIn);
staffAttendanceRoutes.get("/check-in/today", authenticateStaff, staffAttendanceController.getTodayCheckIn);
