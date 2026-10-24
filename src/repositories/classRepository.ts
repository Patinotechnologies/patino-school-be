import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

export const classRepository = {
  listBySchool(schoolId: string, client: Client = prisma) {
    return client.class.findMany({
      where: { schoolId },
      include: { classTeacher: true },
      orderBy: { createdAt: "asc" },
    });
  },

  /** Scoped by organizationId (via the owning school) so a class can never be read across tenants. */
  findById(id: string, organizationId: string, client: Client = prisma) {
    return client.class.findFirst({
      where: { id, school: { organizationId } },
      include: { classTeacher: true },
    });
  },

  create(data: { schoolId: string; name: string; classTeacherId?: string | null }, client: Client = prisma) {
    return client.class.create({ data, include: { classTeacher: true } });
  },

  update(id: string, data: { name?: string; classTeacherId?: string | null }, client: Client = prisma) {
    return client.class.update({ where: { id }, data, include: { classTeacher: true } });
  },
};
