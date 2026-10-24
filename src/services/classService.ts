import type { Class, Staff } from "@prisma/client";
import { classRepository } from "../repositories/classRepository";
import { schoolRepository } from "../repositories/schoolRepository";
import { staffRepository } from "../repositories/staffRepository";
import { AppError } from "../utils/AppError";
import type { ClassResponse, CreateClassRequest, UpdateClassRequest } from "../interface/class";

function toClassResponse(cls: Class & { classTeacher: Staff | null }): ClassResponse {
  return {
    id: cls.id,
    schoolId: cls.schoolId,
    name: cls.name,
    classTeacher: cls.classTeacher
      ? { id: cls.classTeacher.id, fullName: cls.classTeacher.fullName, email: cls.classTeacher.email }
      : null,
  };
}

export const classService = {
  async listForSchool(organizationId: string, schoolId: string): Promise<ClassResponse[]> {
    const school = await schoolRepository.findById(schoolId, organizationId);
    if (!school) {
      throw new AppError(404, "School not found");
    }

    const classes = await classRepository.listBySchool(schoolId);
    return classes.map(toClassResponse);
  },

  async create(organizationId: string, data: CreateClassRequest): Promise<ClassResponse> {
    const school = await schoolRepository.findById(data.schoolId, organizationId);
    if (!school) {
      throw new AppError(404, "School not found");
    }

    if (data.classTeacherId) {
      const teacher = await staffRepository.findById(data.classTeacherId, organizationId);
      if (!teacher) {
        throw new AppError(404, "Staff member not found");
      }
    }

    const created = await classRepository.create({
      schoolId: data.schoolId,
      name: data.name,
      classTeacherId: data.classTeacherId,
    });
    return toClassResponse(created);
  },

  async getById(organizationId: string, classId: string): Promise<ClassResponse> {
    const cls = await classRepository.findById(classId, organizationId);
    if (!cls) {
      throw new AppError(404, "Class not found");
    }
    return toClassResponse(cls);
  },

  async update(organizationId: string, classId: string, data: UpdateClassRequest): Promise<ClassResponse> {
    const existing = await classRepository.findById(classId, organizationId);
    if (!existing) {
      throw new AppError(404, "Class not found");
    }

    if (data.classTeacherId) {
      const teacher = await staffRepository.findById(data.classTeacherId, organizationId);
      if (!teacher) {
        throw new AppError(404, "Staff member not found");
      }
    }

    const updated = await classRepository.update(classId, data);
    return toClassResponse(updated);
  },
};
