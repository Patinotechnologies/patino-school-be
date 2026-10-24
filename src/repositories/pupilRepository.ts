import type { GuardianRelationship, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

export const pupilRepository = {
  listBySchool(
    schoolId: string,
    options: { classId?: string; search?: string; page: number; pageSize: number },
    client: Client = prisma,
  ) {
    const where: Prisma.PupilWhereInput = {
      schoolId,
      ...(options.classId ? { classId: options.classId } : {}),
      ...(options.search
        ? {
            OR: [
              { fullName: { contains: options.search, mode: "insensitive" } },
              { guardianName: { contains: options.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    return Promise.all([
      client.pupil.findMany({
        where,
        include: { class: true },
        orderBy: { createdAt: "asc" },
        skip: (options.page - 1) * options.pageSize,
        take: options.pageSize,
      }),
      client.pupil.count({ where }),
    ]);
  },

  /** Scoped by organizationId (via the owning school) so a pupil can never be read across tenants. */
  findById(id: string, organizationId: string, client: Client = prisma) {
    return client.pupil.findFirst({
      where: { id, school: { organizationId } },
      include: { class: true },
    });
  },

  findManyByIds(ids: string[], organizationId: string, client: Client = prisma) {
    return client.pupil.findMany({
      where: { id: { in: ids }, school: { organizationId } },
      include: { class: true },
    });
  },

  create(
    data: {
      schoolId: string;
      classId?: string | null;
      fullName: string;
      dateOfBirth: Date;
      guardianName: string;
      guardianPhone: string;
      guardianRelationship: GuardianRelationship;
      address?: string | null;
    },
    client: Client = prisma,
  ) {
    return client.pupil.create({ data, include: { class: true } });
  },

  update(
    id: string,
    data: {
      classId?: string | null;
      fullName?: string;
      dateOfBirth?: Date;
      guardianName?: string;
      guardianPhone?: string;
      guardianRelationship?: GuardianRelationship;
      address?: string | null;
    },
    client: Client = prisma,
  ) {
    return client.pupil.update({ where: { id }, data, include: { class: true } });
  },

  delete(id: string, client: Client = prisma) {
    return client.pupil.delete({ where: { id } });
  },

  moveMany(pupilIds: string[], classId: string | null, client: Client = prisma) {
    return client.pupil.updateMany({ where: { id: { in: pupilIds } }, data: { classId } });
  },
};
