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
      deletedAt: null,
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

  /** Scoped by organizationId (via the owning school) so a pupil can never be read across tenants. Excludes soft-deleted pupils. */
  findById(id: string, organizationId: string, client: Client = prisma) {
    return client.pupil.findFirst({
      where: { id, deletedAt: null, school: { organizationId } },
      include: { class: true },
    });
  },

  findManyByIds(ids: string[], organizationId: string, client: Client = prisma) {
    return client.pupil.findMany({
      where: { id: { in: ids }, deletedAt: null, school: { organizationId } },
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

  /** Soft delete — marks the pupil as deleted rather than removing the row, so attendance/exam history is preserved. */
  softDelete(id: string, client: Client = prisma) {
    return client.pupil.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  suspend(id: string, reason: string, client: Client = prisma) {
    return client.pupil.update({
      where: { id },
      data: { status: "suspended", suspensionReason: reason },
      include: { class: true },
    });
  },

  reactivate(id: string, client: Client = prisma) {
    return client.pupil.update({
      where: { id },
      data: { status: "active", suspensionReason: null },
      include: { class: true },
    });
  },

  moveMany(pupilIds: string[], classId: string | null, client: Client = prisma) {
    return client.pupil.updateMany({ where: { id: { in: pupilIds } }, data: { classId } });
  },
};
