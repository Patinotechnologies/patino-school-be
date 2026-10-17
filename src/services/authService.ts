import { db } from "../config/db";
import { userRepository } from "../repositories/userRepository";
import { organizationRepository } from "../repositories/organizationRepository";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAuthToken, type AuthTokenPayload } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import type { AuthResponse, MeResponse, RegisterRequest } from "../interface/auth";

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError(409, "An account with this email already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const { user, organization } = await db.transaction(async (trx) => {
      const user = await userRepository.create(
        { email: data.email, full_name: data.fullName, password_hash: passwordHash },
        trx,
      );
      const organization = await organizationRepository.create(
        { name: data.organizationName, owner_id: user.id },
        trx,
      );
      return { user, organization };
    });

    const token = signAuthToken({ sub: user.id, organizationId: organization.id, role: "proprietor" });

    return {
      token,
      user: { id: user.id, email: user.email, fullName: user.full_name },
      organization: { id: organization.id, name: organization.name },
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      throw new AppError(401, "Invalid email or password");
    }

    const organization = await db("organizations").where({ owner_id: user.id }).first();
    if (!organization) {
      throw new AppError(404, "No organization found for this account");
    }

    const token = signAuthToken({ sub: user.id, organizationId: organization.id, role: "proprietor" });

    return {
      token,
      user: { id: user.id, email: user.email, fullName: user.full_name },
      organization: { id: organization.id, name: organization.name },
    };
  },

  async getCurrentUser(auth: AuthTokenPayload): Promise<MeResponse> {
    const user = await userRepository.findById(auth.sub);
    if (!user) {
      throw new AppError(401, "User no longer exists");
    }

    const organization = await organizationRepository.findById(auth.organizationId);
    if (!organization) {
      throw new AppError(401, "Organization no longer exists");
    }

    return {
      user: { id: user.id, email: user.email, fullName: user.full_name },
      organization: { id: organization.id, name: organization.name },
    };
  },
};
