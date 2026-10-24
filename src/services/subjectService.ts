import type { Subject } from "@prisma/client";
import { subjectRepository } from "../repositories/subjectRepository";
import { schoolRepository } from "../repositories/schoolRepository";
import { AppError } from "../utils/AppError";
import type { CreateSubjectRequest, SubjectResponse, UpdateSubjectRequest } from "../interface/subject";

export function toSubjectResponse(subject: Subject): SubjectResponse {
  return {
    id: subject.id,
    schoolId: subject.schoolId,
    name: subject.name,
    testMaxScore: subject.testMaxScore,
    assignmentMaxScore: subject.assignmentMaxScore,
    examMaxScore: subject.examMaxScore,
  };
}

export const subjectService = {
  async listForSchool(organizationId: string, schoolId: string): Promise<SubjectResponse[]> {
    const school = await schoolRepository.findById(schoolId, organizationId);
    if (!school) {
      throw new AppError(404, "School not found");
    }

    const subjects = await subjectRepository.listBySchool(schoolId);
    return subjects.map(toSubjectResponse);
  },

  async create(organizationId: string, data: CreateSubjectRequest): Promise<SubjectResponse> {
    const school = await schoolRepository.findById(data.schoolId, organizationId);
    if (!school) {
      throw new AppError(404, "School not found");
    }

    const existing = await subjectRepository.findByName(data.schoolId, data.name);
    if (existing) {
      throw new AppError(409, "A subject with this name already exists");
    }

    const created = await subjectRepository.create(data);
    return toSubjectResponse(created);
  },

  async update(organizationId: string, subjectId: string, data: UpdateSubjectRequest): Promise<SubjectResponse> {
    const existing = await subjectRepository.findById(subjectId, organizationId);
    if (!existing) {
      throw new AppError(404, "Subject not found");
    }

    if (data.name && data.name !== existing.name) {
      const duplicate = await subjectRepository.findByName(existing.schoolId, data.name);
      if (duplicate) {
        throw new AppError(409, "A subject with this name already exists");
      }
    }

    const updated = await subjectRepository.update(subjectId, data);
    return toSubjectResponse(updated);
  },
};
