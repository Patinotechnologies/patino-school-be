import type { Prisma, SchoolLevel } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

export const schoolRepository = {
  /** Scoped by organizationId so a school can never be read across tenants. */
  findById(id: string, organizationId: string, client: Client = prisma) {
    return client.school.findFirst({ where: { id, organizationId } });
  },

  listByOrganization(organizationId: string, client: Client = prisma) {
    return client.school.findMany({ where: { organizationId }, orderBy: { createdAt: "asc" } });
  },

  create(
    data: {
      organizationId: string;
      name: string;
      level: SchoolLevel;
      address?: string | null;
      onboardedAt?: Date;
    },
    client: Client = prisma,
  ) {
    return client.school.create({ data });
  },
};
