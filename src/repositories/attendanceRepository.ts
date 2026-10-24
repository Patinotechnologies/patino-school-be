import type { AttendanceStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

const sessionInclude = {
  subject: true,
  records: { include: { pupil: true }, orderBy: { createdAt: "asc" } as const },
} satisfies Prisma.AttendanceSessionInclude;

export const attendanceRepository = {
  listSessionsByClass(classId: string, date: string | undefined, client: Client = prisma) {
    return client.attendanceSession.findMany({
      where: { classId, ...(date ? { date: new Date(date) } : {}) },
      include: sessionInclude,
      orderBy: { date: "desc" },
    });
  },

  findSession(
    params: { classId: string; date: Date; subjectId: string | null; activity: string | null },
    client: Client = prisma,
  ) {
    return client.attendanceSession.findFirst({
      where: { classId: params.classId, date: params.date, subjectId: params.subjectId, activity: params.activity },
      include: sessionInclude,
    });
  },

  createSession(
    data: { classId: string; date: Date; subjectId: string | null; activity: string | null },
    client: Client = prisma,
  ) {
    return client.attendanceSession.create({ data, include: sessionInclude });
  },

  getSession(id: string, client: Client = prisma) {
    return client.attendanceSession.findUniqueOrThrow({ where: { id }, include: sessionInclude });
  },

  upsertRecord(sessionId: string, pupilId: string, status: AttendanceStatus, client: Client = prisma) {
    return client.attendanceRecord.upsert({
      where: { sessionId_pupilId: { sessionId, pupilId } },
      create: { sessionId, pupilId, status },
      update: { status },
    });
  },
};
