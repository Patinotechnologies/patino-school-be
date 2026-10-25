import type { Class, ClassSubject, Staff, Subject } from "@prisma/client";
import { classSubjectRepository } from "../repositories/classSubjectRepository";
import { classRepository } from "../repositories/classRepository";
import { subjectRepository } from "../repositories/subjectRepository";
import { staffRepository } from "../repositories/staffRepository";
import { toSubjectResponse } from "./subjectService";
import { AppError } from "../utils/AppError";
import type { AssignClassSubjectRequest, ClassSubjectResponse } from "../interface/subject";

function toClassSubjectResponse(
  cs: ClassSubject & { subject: Subject; subjectTeacher: Staff | null; class: Class },
): ClassSubjectResponse {
  return {
    id: cs.id,
    classId: cs.classId,
    class: { id: cs.class.id, name: cs.class.name },
    subject: toSubjectResponse(cs.subject),
    subjectTeacher: cs.subjectTeacher ? { id: cs.subjectTeacher.id, fullName: cs.subjectTeacher.fullName } : null,
  };
}

export const classSubjectService = {
  async listForClass(organizationId: string, classId: string): Promise<ClassSubjectResponse[]> {
    const cls = await classRepository.findById(classId, organizationId);
    if (!cls) {
      throw new AppError(404, "Class not found");
    }

    const rows = await classSubjectRepository.listByClass(classId);
    return rows.map(toClassSubjectResponse);
  },

  /** Every subject a given staff member teaches, across all classes in this org. */
  async listForTeacher(organizationId: string, subjectTeacherId: string): Promise<ClassSubjectResponse[]> {
    const teacher = await staffRepository.findById(subjectTeacherId, organizationId);
    if (!teacher) {
      throw new AppError(404, "Staff member not found");
    }

    const rows = await classSubjectRepository.listBySubjectTeacher(subjectTeacherId, organizationId);
    return rows.map(toClassSubjectResponse);
  },

  /** Assigns a subject (and optionally a subject teacher) to a class — re-assigns the teacher if the pairing already exists. */
  async assign(organizationId: string, data: AssignClassSubjectRequest): Promise<ClassSubjectResponse> {
    const cls = await classRepository.findById(data.classId, organizationId);
    if (!cls) {
      throw new AppError(404, "Class not found");
    }

    const subject = await subjectRepository.findById(data.subjectId, organizationId);
    if (!subject) {
      throw new AppError(404, "Subject not found");
    }
    if (subject.schoolId !== cls.schoolId) {
      throw new AppError(400, "That subject does not belong to this class's school");
    }

    if (data.subjectTeacherId) {
      const teacher = await staffRepository.findById(data.subjectTeacherId, organizationId);
      if (!teacher) {
        throw new AppError(404, "Staff member not found");
      }
    }

    const existing = await classSubjectRepository.findByClassAndSubject(data.classId, data.subjectId);
    const result = existing
      ? await classSubjectRepository.update(existing.id, { subjectTeacherId: data.subjectTeacherId })
      : await classSubjectRepository.create({
          classId: data.classId,
          subjectId: data.subjectId,
          subjectTeacherId: data.subjectTeacherId,
        });

    return toClassSubjectResponse(result);
  },
};
