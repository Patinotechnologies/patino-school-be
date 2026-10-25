import type { Staff } from "@prisma/client";
import { staffRepository } from "../repositories/staffRepository";
import { staffAuthService } from "./staffAuthService";
import { AppError } from "../utils/AppError";
import type { CreateStaffRequest, ListStaffQuery, PaginatedStaffResponse, StaffResponse, StaffRole, StaffStatus } from "../interface/staff";

function toStaffStatus(staff: Staff): StaffStatus {
  if (!staff.active) return "inactive";
  return staff.passwordHash ? "active" : "pending";
}

export function toStaffResponse(staff: Staff): StaffResponse {
  return {
    id: staff.id,
    fullName: staff.fullName,
    email: staff.email,
    phone: staff.phone,
    role: staff.role as StaffRole,
    active: staff.active,
    status: toStaffStatus(staff),
  };
}

export const staffService = {
  async getById(organizationId: string, staffId: string): Promise<StaffResponse> {
    const staff = await staffRepository.findById(staffId, organizationId);
    if (!staff) {
      throw new AppError(404, "Staff member not found");
    }
    return toStaffResponse(staff);
  },

  async listForOrganization(organizationId: string, query: ListStaffQuery): Promise<PaginatedStaffResponse> {
    const [staff, total] = await staffRepository.listByOrganization(organizationId, query);
    return {
      data: staff.map(toStaffResponse),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
      },
    };
  },

  async create(organizationId: string, data: CreateStaffRequest): Promise<StaffResponse> {
    const existing = await staffRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError(409, "A staff member with this email already exists");
    }

    const { inviteToken, inviteTokenExpiresAt } = staffAuthService.newInvite();
    const staff = await staffRepository.create({
      organizationId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      inviteToken,
      inviteTokenExpiresAt,
    });

    await staffAuthService.sendInviteEmail(staff);
    return toStaffResponse(staff);
  },

  async delete(organizationId: string, staffId: string): Promise<void> {
    const existing = await staffRepository.findById(staffId, organizationId);
    if (!existing) {
      throw new AppError(404, "Staff member not found");
    }
    await staffRepository.delete(staffId);
  },
};
