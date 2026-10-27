import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../utils/jwt";
import { tokenBlocklistRepository } from "../repositories/tokenBlocklistRepository";
import { AppError } from "../utils/AppError";

export interface StaffAuthPayload {
  staffId: string;
  organizationId: string;
  jti: string;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      staffAuth?: StaffAuthPayload;
    }
  }
}

/** Separate from `authenticate` — verifies a staff-issued token (role "staff") rather than an admin/proprietor one. */
export async function authenticateStaff(req: Request, _res: Response, next: NextFunction) {
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
    if (await tokenBlocklistRepository.isRevoked(payload.jti)) {
      return next(new AppError(401, "Invalid or expired token"));
    }
    req.staffAuth = { staffId: payload.sub, organizationId: payload.organizationId, jti: payload.jti, exp: payload.exp };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}
