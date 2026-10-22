import type { Staff } from "@prisma/client";
import { staffRepository } from "../repositories/staffRepository";
import { AppError } from "../utils/AppError";
import type { CreateStaffRequest, ListStaffQuery, PaginatedStaffResponse, StaffResponse, StaffRole } from "../interface/staff";

export function toStaffResponse(staff: Staff): StaffResponse {
  return {
    id: staff.id,
    fullName: staff.fullName,
    email: staff.email,
    phone: staff.phone,
    role: staff.role as StaffRole,
    active: staff.active,
  };
}

export const staffService = {
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
    const existing = await staffRepository.findByEmail(organizationId, data.email);
    if (existing) {
      throw new AppError(409, "A staff member with this email already exists");
    }

    const staff = await staffRepository.create({
      organizationId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role,
    });
    return toStaffResponse(staff);
  },
};
