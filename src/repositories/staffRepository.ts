import type { Prisma, StaffRole } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

export const staffRepository = {
  /** Scoped by organizationId so a staff member can never be read across tenants. */
  findById(id: string, organizationId: string, client: Client = prisma) {
    return client.staff.findFirst({ where: { id, organizationId } });
  },

  listByOrganization(
    organizationId: string,
    options: { search?: string; role?: StaffRole; active?: boolean; page: number; pageSize: number },
    client: Client = prisma,
  ) {
    const where: Prisma.StaffWhereInput = {
      organizationId,
      ...(options.role ? { role: options.role } : {}),
      ...(options.active !== undefined ? { active: options.active } : {}),
      ...(options.search
        ? {
            OR: [
              { fullName: { contains: options.search, mode: "insensitive" } },
              { email: { contains: options.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    return Promise.all([
      client.staff.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip: (options.page - 1) * options.pageSize,
        take: options.pageSize,
      }),
      client.staff.count({ where }),
    ]);
  },

  /** Email is globally unique across staff (not just within an org) — needed for unscoped login lookup. */
  findByEmail(email: string, client: Client = prisma) {
    return client.staff.findUnique({ where: { email } });
  },

  findByInviteToken(token: string, client: Client = prisma) {
    return client.staff.findUnique({ where: { inviteToken: token } });
  },

  /** All active staff in the org, unpaginated — small enough lists (one school group's staff) to fetch in one go. */
  listActiveByOrganization(organizationId: string, client: Client = prisma) {
    return client.staff.findMany({ where: { organizationId, active: true }, orderBy: { fullName: "asc" } });
  },

  create(
    data: {
      organizationId: string;
      fullName: string;
      email: string;
      phone?: string | null;
      role: StaffRole;
      inviteToken: string;
      inviteTokenExpiresAt: Date;
    },
    client: Client = prisma,
  ) {
    return client.staff.create({ data });
  },

  acceptInvite(id: string, passwordHash: string, client: Client = prisma) {
    return client.staff.update({
      where: { id },
      data: { passwordHash, inviteToken: null, inviteTokenExpiresAt: null },
    });
  },

  /** Hard delete — class/subject-teacher assignments are set null (schema default) and attendance records cascade-delete. */
  delete(id: string, client: Client = prisma) {
    return client.staff.delete({ where: { id } });
  },
};
