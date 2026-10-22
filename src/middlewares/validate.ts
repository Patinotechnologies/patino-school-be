import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../utils/AppError";

declare global {
  namespace Express {
    interface Request {
      /** Set by validateQuery — the zod-parsed (and coerced/defaulted) req.query. */
      validatedQuery?: unknown;
    }
  }
}

function formatIssues(error: { issues: { path: PropertyKey[]; message: string }[] }): string {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
}

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new AppError(400, formatIssues(result.error)));
    }
    req.body = result.data;
    next();
  };
}

/** Like validate, but for req.query — stored on req.validatedQuery since req.query's type can't be reassigned to an arbitrary shape. */
export function validateQuery(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(new AppError(400, formatIssues(result.error)));
    }
    req.validatedQuery = result.data;
    next();
  };
}
