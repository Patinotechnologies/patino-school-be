import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

export const classSubjectRepository = {
  listByClass(classId: string, client: Client = prisma) {
    return client.classSubject.findMany({
      where: { classId },
      include: { subject: true, subjectTeacher: true, class: true },
      orderBy: { createdAt: "asc" },
    });
  },

  /** Every subject a given staff member teaches, across all classes — scoped by organizationId via the owning school. */
  listBySubjectTeacher(subjectTeacherId: string, organizationId: string, client: Client = prisma) {
    return client.classSubject.findMany({
      where: { subjectTeacherId, class: { school: { organizationId } } },
      include: { subject: true, subjectTeacher: true, class: true },
      orderBy: { createdAt: "asc" },
    });
  },

  findByClassAndSubject(classId: string, subjectId: string, client: Client = prisma) {
    return client.classSubject.findUnique({
      where: { classId_subjectId: { classId, subjectId } },
      include: { subject: true, subjectTeacher: true, class: true },
    });
  },

  create(data: { classId: string; subjectId: string; subjectTeacherId?: string | null }, client: Client = prisma) {
    return client.classSubject.create({ data, include: { subject: true, subjectTeacher: true, class: true } });
  },

  update(id: string, data: { subjectTeacherId?: string | null }, client: Client = prisma) {
    return client.classSubject.update({
      where: { id },
      data,
      include: { subject: true, subjectTeacher: true, class: true },
    });
  },
};
