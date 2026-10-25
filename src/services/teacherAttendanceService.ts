import type { Class, Staff } from "@prisma/client";
import { classRepository } from "../repositories/classRepository";
import { classSubjectRepository } from "../repositories/classSubjectRepository";
import { pupilService } from "./pupilService";
import { attendanceService } from "./attendanceService";
import { AppError } from "../utils/AppError";
import type { AttendanceSessionResponse, MarkAttendanceRequest } from "../interface/attendance";
import type { PupilResponse } from "../interface/pupil";

/** Throws unless this staff member teaches the class at all — as its class teacher, or as a subject teacher within it. */
async function assertAssignedToClass(
  staffId: string,
  organizationId: string,
  classId: string,
): Promise<Class & { classTeacher: Staff | null }> {
  const cls = await classRepository.findById(classId, organizationId);
  if (!cls) {
    throw new AppError(404, "Class not found");
  }
  if (cls.classTeacher?.id === staffId) {
    return cls;
  }

  const classSubjects = await classSubjectRepository.listByClass(classId);
  const teachesHere = classSubjects.some((cs) => cs.subjectTeacher?.id === staffId);
  if (!teachesHere) {
    throw new AppError(403, "You are not assigned to this class");
  }
  return cls;
}

export const teacherAttendanceService = {
  async listPupils(staffId: string, organizationId: string, classId: string): Promise<PupilResponse[]> {
    const cls = await assertAssignedToClass(staffId, organizationId, classId);
    const result = await pupilService.listForSchool(organizationId, {
      schoolId: cls.schoolId,
      classId,
      page: 1,
      pageSize: 200,
    });
    return result.data;
  },

  async listSessions(
    staffId: string,
    organizationId: string,
    classId: string,
    date?: string,
  ): Promise<AttendanceSessionResponse[]> {
    await assertAssignedToClass(staffId, organizationId, classId);
    return attendanceService.listForClass(organizationId, { classId, date });
  },

  async markAttendance(staffId: string, organizationId: string, data: MarkAttendanceRequest): Promise<AttendanceSessionResponse> {
    if (data.activity) {
      throw new AppError(400, "Activity-based attendance isn't supported from this app yet");
    }

    const cls = await assertAssignedToClass(staffId, organizationId, data.classId);

    if (data.subjectId) {
      const classSubjects = await classSubjectRepository.listByClass(data.classId);
      const teachesSubject = classSubjects.some(
        (cs) => cs.subject.id === data.subjectId && cs.subjectTeacher?.id === staffId,
      );
      if (!teachesSubject) {
        throw new AppError(403, "You do not teach this subject for this class");
      }
    } else if (cls.classTeacher?.id !== staffId) {
      throw new AppError(403, "Only this class's class teacher can take whole-class attendance");
    }

    return attendanceService.markAttendance(organizationId, data);
  },
};
