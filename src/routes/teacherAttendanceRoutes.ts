import { Router } from "express";
import { teacherAttendanceController } from "../controllers/teacherAttendanceController";
import { authenticateStaff } from "../middlewares/authenticateStaff";
import { validate, validateQuery } from "../middlewares/validate";
import { listPupilsForClassQuerySchema } from "../validations/teacherAttendanceValidation";
import { listAttendanceQuerySchema, markAttendanceSchema } from "../validations/attendanceValidation";

export const teacherAttendanceRoutes = Router();

teacherAttendanceRoutes.use(authenticateStaff);
teacherAttendanceRoutes.get("/pupils", validateQuery(listPupilsForClassQuerySchema), teacherAttendanceController.listPupils);
teacherAttendanceRoutes.get("/sessions", validateQuery(listAttendanceQuerySchema), teacherAttendanceController.listSessions);
teacherAttendanceRoutes.post("/mark", validate(markAttendanceSchema), teacherAttendanceController.markAttendance);
