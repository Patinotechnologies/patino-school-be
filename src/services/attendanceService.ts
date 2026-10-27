import type { AttendanceRecord, AttendanceSession, Class, Pupil, Subject } from "@prisma/client";
import { attendanceRepository } from "../repositories/attendanceRepository";
import { classRepository } from "../repositories/classRepository";
import { subjectRepository } from "../repositories/subjectRepository";
import { pupilRepository } from "../repositories/pupilRepository";
import { schoolRepository } from "../repositories/schoolRepository";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import type {
  AttendanceSessionResponse,
  ListAttendanceLogQuery,
  ListAttendanceSessionsQuery,
  MarkAttendanceRequest,
  PaginatedAttendanceLogResponse,
} from "../interface/attendance";

type SessionWithRecords = AttendanceSession & {
  subject: Subject | null;
  records: (AttendanceRecord & { pupil: Pupil })[];
};

function toSessionResponse(session: SessionWithRecords): AttendanceSessionResponse {
  return {
    id: session.id,
    classId: session.classId,
    subjectId: session.subjectId,
    subjectName: session.subject?.name ?? null,
    activity: session.activity,
    date: session.date.toISOString().slice(0, 10),
    records: session.records.map((record) => ({
      id: record.id,
      pupil: { id: record.pupil.id, fullName: record.pupil.fullName },
      status: record.status,
    })),
  };
}

export const attendanceService = {
  async listForClass(organizationId: string, query: ListAttendanceSessionsQuery): Promise<AttendanceSessionResponse[]> {
    const cls = await classRepository.findById(query.classId, organizationId);
    if (!cls) {
      throw new AppError(404, "Class not found");
    }

    const sessions = await attendanceRepository.listSessionsByClass(query.classId, query.date);
    return sessions.map(toSessionResponse);
  },

  async markAttendance(organizationId: string, data: MarkAttendanceRequest): Promise<AttendanceSessionResponse> {
    const cls = await classRepository.findById(data.classId, organizationId);
    if (!cls) {
      throw new AppError(404, "Class not found");
    }

    if (data.subjectId) {
      const subject = await subjectRepository.findById(data.subjectId, organizationId);
      if (!subject) {
        throw new AppError(404, "Subject not found");
      }
      if (subject.schoolId !== cls.schoolId) {
        throw new AppError(400, "That subject does not belong to this class's school");
      }
    }

    const pupilIds = data.records.map((r) => r.pupilId);
    const pupils = await pupilRepository.findManyByIds(pupilIds, organizationId);
    if (pupils.length !== pupilIds.length) {
      throw new AppError(404, "One or more pupils were not found");
    }
    const mismatched = pupils.some((pupil) => pupil.schoolId !== cls.schoolId);
    if (mismatched) {
      throw new AppError(400, "All pupils must belong to this class's school");
    }

    const date = new Date(data.date);
    const subjectId = data.subjectId ?? null;
    const activity = data.activity ?? null;

    const sessionId = await prisma.$transaction(
      async (tx) => {
        const existing = await attendanceRepository.findSession({ classId: data.classId, date, subjectId, activity }, tx);
        const session = existing ?? (await attendanceRepository.createSession({ classId: data.classId, date, subjectId, activity }, tx));

        // Run the roster's upserts concurrently rather than one round trip at a time — keeps large
        // classes well under the transaction timeout instead of scaling it linearly with roster size.
        await Promise.all(
          data.records.map((record) => attendanceRepository.upsertRecord(session.id, record.pupilId, record.status, tx)),
        );

        return session.id;
      },
      { timeout: 15000 },
    );

    const session = await attendanceRepository.getSession(sessionId);
    return toSessionResponse(session);
  },

  /** Every attendance record for a school, flattened across classes — for the admin "view attendance log" screen. */
  async listLogForSchool(organizationId: string, query: ListAttendanceLogQuery): Promise<PaginatedAttendanceLogResponse> {
    const school = await schoolRepository.findById(query.schoolId, organizationId);
    if (!school) {
      throw new AppError(404, "School not found");
    }

    if (query.classId) {
      const cls = await classRepository.findById(query.classId, organizationId);
      if (!cls) {
        throw new AppError(404, "Class not found");
      }
      if (cls.schoolId !== query.schoolId) {
        throw new AppError(400, "That class does not belong to this school");
      }
    }

    const [records, total] = await attendanceRepository.listLogForSchool(query.schoolId, query);

    type RecordWithRelations = AttendanceRecord & {
      pupil: Pupil;
      session: AttendanceSession & { class: Class; subject: Subject | null };
    };

    return {
      data: (records as RecordWithRelations[]).map((record) => ({
        pupilId: record.pupil.id,
        pupilName: record.pupil.fullName,
        classId: record.session.classId,
        className: record.session.class.name,
        subjectId: record.session.subjectId,
        subjectName: record.session.subject?.name ?? null,
        activity: record.session.activity,
        date: record.session.date.toISOString().slice(0, 10),
        status: record.status,
      })),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
      },
    };
  },
};
