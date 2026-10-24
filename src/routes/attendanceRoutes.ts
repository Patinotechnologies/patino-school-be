import { Router } from "express";
import { attendanceController } from "../controllers/attendanceController";
import { authenticate } from "../middlewares/authenticate";
import { validate, validateQuery } from "../middlewares/validate";
import { listAttendanceQuerySchema, markAttendanceSchema } from "../validations/attendanceValidation";

export const attendanceRoutes = Router();

attendanceRoutes.use(authenticate);
attendanceRoutes.get("/", validateQuery(listAttendanceQuerySchema), attendanceController.list);
attendanceRoutes.post("/", validate(markAttendanceSchema), attendanceController.mark);
