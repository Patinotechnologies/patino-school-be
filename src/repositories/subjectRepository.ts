import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

export const subjectRepository = {
  listBySchool(schoolId: string, client: Client = prisma) {
    return client.subject.findMany({ where: { schoolId }, orderBy: { createdAt: "asc" } });
  },

  /** Scoped by organizationId (via the owning school) so a subject can never be read across tenants. */
  findById(id: string, organizationId: string, client: Client = prisma) {
    return client.subject.findFirst({ where: { id, school: { organizationId } } });
  },

  findByName(schoolId: string, name: string, client: Client = prisma) {
    return client.subject.findUnique({ where: { schoolId_name: { schoolId, name } } });
  },

  create(
    data: { schoolId: string; name: string; testMaxScore?: number; assignmentMaxScore?: number; examMaxScore?: number },
    client: Client = prisma,
  ) {
    return client.subject.create({ data });
  },

  update(
    id: string,
    data: { name?: string; testMaxScore?: number; assignmentMaxScore?: number; examMaxScore?: number },
    client: Client = prisma,
  ) {
    return client.subject.update({ where: { id }, data });
  },
};
