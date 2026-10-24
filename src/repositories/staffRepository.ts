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

  findByEmail(organizationId: string, email: string, client: Client = prisma) {
    return client.staff.findUnique({ where: { organizationId_email: { organizationId, email } } });
  },

  create(
    data: { organizationId: string; fullName: string; email: string; phone?: string | null; role: StaffRole },
    client: Client = prisma,
  ) {
    return client.staff.create({ data });
  },
};
