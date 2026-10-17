import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AuthRole = "proprietor";

export interface AuthTokenPayload {
  sub: string;
  organizationId: string;
  role: AuthRole;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}
