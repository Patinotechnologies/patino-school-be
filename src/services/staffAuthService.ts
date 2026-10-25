import crypto from "node:crypto";
import { staffRepository } from "../repositories/staffRepository";
import { classRepository } from "../repositories/classRepository";
import { classSubjectRepository } from "../repositories/classSubjectRepository";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAuthToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import { emailService } from "./emailService";
import type {
  AcceptStaffInviteRequest,
  StaffAssignment,
  StaffAuthResponse,
  StaffAuthSummary,
  StaffLoginRequest,
  StaffMeResponse,
} from "../interface/staffAuth";
import type { Staff } from "@prisma/client";
import type { StaffRole } from "../interface/staff";

const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function toStaffAuthSummary(staff: Staff): StaffAuthSummary {
  return { id: staff.id, fullName: staff.fullName, email: staff.email, role: staff.role as StaffRole };
}

export const staffAuthService = {
  newInvite(): { inviteToken: string; inviteTokenExpiresAt: Date } {
    return {
      inviteToken: crypto.randomBytes(32).toString("hex"),
      inviteTokenExpiresAt: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
    };
  },

  async sendInviteEmail(staff: Pick<Staff, "email" | "fullName" | "inviteToken">): Promise<void> {
    const inviteLink = `${env.staffInviteBaseUrl}/set-password?token=${staff.inviteToken}`;
    await emailService.sendStaffInviteEmail(staff.email, staff.fullName, inviteLink);
  },

  async acceptInvite(data: AcceptStaffInviteRequest): Promise<StaffAuthResponse> {
    const staff = await staffRepository.findByInviteToken(data.token);
    if (!staff || !staff.inviteTokenExpiresAt || staff.inviteTokenExpiresAt < new Date()) {
      throw new AppError(400, "This invite link is invalid or has expired");
    }

    const passwordHash = await hashPassword(data.password);
    const updated = await staffRepository.acceptInvite(staff.id, passwordHash);

    const token = signAuthToken({ sub: updated.id, organizationId: updated.organizationId, role: "staff" });
    return { token, staff: toStaffAuthSummary(updated) };
  },

  async login(data: StaffLoginRequest): Promise<StaffAuthResponse> {
    const staff = await staffRepository.findByEmail(data.email);
    if (!staff || !staff.passwordHash || !(await verifyPassword(data.password, staff.passwordHash))) {
      throw new AppError(401, "Invalid email or password");
    }
    if (!staff.active) {
      throw new AppError(403, "This account has been deactivated");
    }

    const token = signAuthToken({ sub: staff.id, organizationId: staff.organizationId, role: "staff" });
    return { token, staff: toStaffAuthSummary(staff) };
  },

  /** Profile plus everything this staff member can take attendance for — their classes (as class teacher) and subjects (as subject teacher). */
  async getMe(staffId: string, organizationId: string): Promise<StaffMeResponse> {
    const staff = await staffRepository.findById(staffId, organizationId);
    if (!staff) {
      throw new AppError(404, "Staff member not found");
    }

    const [classes, classSubjects] = await Promise.all([
      classRepository.listByClassTeacher(staffId, organizationId),
      classSubjectRepository.listBySubjectTeacher(staffId, organizationId),
    ]);

    const assignments: StaffAssignment[] = [
      ...classes.map((cls) => ({ type: "class" as const, classId: cls.id, className: cls.name })),
      ...classSubjects.map((cs) => ({
        type: "subject" as const,
        classId: cs.classId,
        className: cs.class.name,
        subjectId: cs.subject.id,
        subjectName: cs.subject.name,
      })),
    ];

    return { staff: toStaffAuthSummary(staff), assignments };
  },
};
