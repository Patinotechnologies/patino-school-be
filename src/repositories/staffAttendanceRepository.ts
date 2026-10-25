import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

export const staffAttendanceRepository = {
  findSettings(organizationId: string, client: Client = prisma) {
    return client.staffAttendanceSettings.findUnique({ where: { organizationId } });
  },

  upsertSettings(
    organizationId: string,
    data: { checkInTime: string; gracePeriodMinutes: number },
    client: Client = prisma,
  ) {
    return client.staffAttendanceSettings.upsert({
      where: { organizationId },
      create: { organizationId, ...data },
      update: data,
    });
  },

  findRecordForDate(staffId: string, date: Date, client: Client = prisma) {
    return client.staffAttendanceRecord.findUnique({ where: { staffId_date: { staffId, date } } });
  },

  createCheckIn(staffId: string, date: Date, checkInAt: Date, client: Client = prisma) {
    return client.staffAttendanceRecord.create({ data: { staffId, date, checkInAt } });
  },

  /** Every check-in recorded for the org on a given date — scoped via the staff relation. */
  listRecordsForDate(organizationId: string, date: Date, client: Client = prisma) {
    return client.staffAttendanceRecord.findMany({ where: { date, staff: { organizationId } } });
  },

  /** Most recent check-ins for one staff member — only days they actually checked in, newest first. */
  listRecordsForStaff(staffId: string, limit: number, client: Client = prisma) {
    return client.staffAttendanceRecord.findMany({ where: { staffId }, orderBy: { date: "desc" }, take: limit });
  },
};
