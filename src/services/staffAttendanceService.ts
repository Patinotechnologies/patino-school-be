import { staffAttendanceRepository } from "../repositories/staffAttendanceRepository";
import { staffRepository } from "../repositories/staffRepository";
import { AppError } from "../utils/AppError";
import type {
  StaffAttendanceEntry,
  StaffAttendanceSettingsResponse,
  StaffAttendanceStatus,
  StaffCheckInResponse,
  UpdateStaffAttendanceSettingsRequest,
} from "../interface/staffAttendance";
import type { StaffRole } from "../interface/staff";

const DEFAULT_SETTINGS: StaffAttendanceSettingsResponse = { checkInTime: "08:00", gracePeriodMinutes: 15 };

function toDateOnly(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** present if checkInAt falls at/before checkInTime + grace on that same calendar day, otherwise late. */
function computeStatus(checkInAt: Date, settings: StaffAttendanceSettingsResponse): StaffAttendanceStatus {
  const [hours, minutes] = settings.checkInTime.split(":").map(Number);
  const cutoff = new Date(checkInAt);
  cutoff.setHours(hours!, minutes! + settings.gracePeriodMinutes, 0, 0);
  return checkInAt <= cutoff ? "present" : "late";
}

export const staffAttendanceService = {
  async getSettings(organizationId: string): Promise<StaffAttendanceSettingsResponse> {
    const settings = await staffAttendanceRepository.findSettings(organizationId);
    return settings ? { checkInTime: settings.checkInTime, gracePeriodMinutes: settings.gracePeriodMinutes } : DEFAULT_SETTINGS;
  },

  async updateSettings(organizationId: string, data: UpdateStaffAttendanceSettingsRequest): Promise<StaffAttendanceSettingsResponse> {
    const settings = await staffAttendanceRepository.upsertSettings(organizationId, data);
    return { checkInTime: settings.checkInTime, gracePeriodMinutes: settings.gracePeriodMinutes };
  },

  async checkIn(staffId: string, organizationId: string): Promise<StaffCheckInResponse> {
    const isoDate = todayIsoDate();
    const date = toDateOnly(isoDate);

    const existing = await staffAttendanceRepository.findRecordForDate(staffId, date);
    if (existing) {
      throw new AppError(409, "Already checked in today");
    }

    const checkInAt = new Date();
    const record = await staffAttendanceRepository.createCheckIn(staffId, date, checkInAt);
    const settings = await staffAttendanceService.getSettings(organizationId);

    return {
      staffId: record.staffId,
      date: isoDate,
      checkInAt: record.checkInAt.toISOString(),
      status: computeStatus(record.checkInAt, settings),
    };
  },

  async getTodayCheckIn(staffId: string, organizationId: string): Promise<StaffCheckInResponse | null> {
    const isoDate = todayIsoDate();
    const record = await staffAttendanceRepository.findRecordForDate(staffId, toDateOnly(isoDate));
    if (!record) return null;

    const settings = await staffAttendanceService.getSettings(organizationId);
    return {
      staffId: record.staffId,
      date: isoDate,
      checkInAt: record.checkInAt.toISOString(),
      status: computeStatus(record.checkInAt, settings),
    };
  },

  /** Every active staff member for the org on a given date — no record for that date means absent. */
  async listForDate(organizationId: string, isoDate: string): Promise<StaffAttendanceEntry[]> {
    const date = toDateOnly(isoDate);
    const [staffList, records, settings] = await Promise.all([
      staffRepository.listActiveByOrganization(organizationId),
      staffAttendanceRepository.listRecordsForDate(organizationId, date),
      staffAttendanceService.getSettings(organizationId),
    ]);

    const recordByStaffId = new Map(records.map((record) => [record.staffId, record]));

    return staffList.map((staff) => {
      const record = recordByStaffId.get(staff.id);
      if (!record) {
        return { staffId: staff.id, fullName: staff.fullName, role: staff.role as StaffRole, checkInAt: null, status: "absent" };
      }
      return {
        staffId: staff.id,
        fullName: staff.fullName,
        role: staff.role as StaffRole,
        checkInAt: record.checkInAt.toISOString(),
        status: computeStatus(record.checkInAt, settings),
      };
    });
  },
};
