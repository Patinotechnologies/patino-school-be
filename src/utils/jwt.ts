import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env";

export type AuthRole = "proprietor" | "staff";

export interface AuthTokenPayload {
  sub: string;
  organizationId: string;
  role: AuthRole;
  /** Unique per issued token — lets a single token be revoked (on logout) without affecting others. */
  jti: string;
  /** Standard JWT expiry claim (unix seconds), present on every verified token. */
  exp: number;
}

export function signAuthToken(payload: { sub: string; organizationId: string; role: AuthRole }): string {
  return jwt.sign({ ...payload, jti: crypto.randomUUID() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}
