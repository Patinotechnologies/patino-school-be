import type { User } from "@prisma/client";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../utils/AppError";
import type { AuthTokenPayload } from "../utils/jwt";
import type { UpdateUserRequest, UserProfileResponse } from "../interface/user";

function toResponse(user: User, role: string): UserProfileResponse {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    role,
  };
}

export const userService = {
  async getProfile(auth: AuthTokenPayload): Promise<UserProfileResponse> {
    const user = await userRepository.findById(auth.sub);
    if (!user) {
      throw new AppError(401, "User no longer exists");
    }
    return toResponse(user, auth.role);
  },

  async updateProfile(auth: AuthTokenPayload, data: UpdateUserRequest): Promise<UserProfileResponse> {
    const user = await userRepository.findById(auth.sub);
    if (!user) {
      throw new AppError(401, "User no longer exists");
    }

    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing) {
        throw new AppError(409, "An account with this email already exists");
      }
    }

    const updated = await userRepository.update(auth.sub, data);
    return toResponse(updated, auth.role);
  },
};
