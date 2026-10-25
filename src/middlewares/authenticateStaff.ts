import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export interface StaffAuthPayload {
  staffId: string;
  organizationId: string;
}

declare global {
  namespace Express {
    interface Request {
      staffAuth?: StaffAuthPayload;
    }
  }
}

/** Separate from `authenticate` — verifies a staff-issued token (role "staff") rather than an admin/proprietor one. */
export function authenticateStaff(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing or invalid Authorization header"));
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAuthToken(token);
    if (payload.role !== "staff") {
      return next(new AppError(401, "Invalid or expired token"));
    }
    req.staffAuth = { staffId: payload.sub, organizationId: payload.organizationId };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}
