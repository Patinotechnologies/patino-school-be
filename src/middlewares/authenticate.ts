import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken, type AuthTokenPayload } from "../utils/jwt";
import { tokenBlocklistRepository } from "../repositories/tokenBlocklistRepository";
import { AppError } from "../utils/AppError";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing or invalid Authorization header"));
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAuthToken(token);
    if (payload.role !== "proprietor") {
      return next(new AppError(401, "Invalid or expired token"));
    }
    if (await tokenBlocklistRepository.isRevoked(payload.jti)) {
      return next(new AppError(401, "Invalid or expired token"));
    }
    req.auth = payload;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}
