import type { Class, Pupil } from "@prisma/client";
import { pupilRepository } from "../repositories/pupilRepository";
import { schoolRepository } from "../repositories/schoolRepository";
import { classRepository } from "../repositories/classRepository";
import { AppError } from "../utils/AppError";
import type {
  CreatePupilRequest,
  GuardianRelationship,
  ListPupilsQuery,
  MovePupilsRequest,
  PaginatedPupilResponse,
  PupilResponse,
  PupilStatus,
  SuspendPupilRequest,
  UpdatePupilRequest,
} from "../interface/pupil";

function toPupilResponse(pupil: Pupil & { class: Class | null }): PupilResponse {
  return {
    id: pupil.id,
    schoolId: pupil.schoolId,
    class: pupil.class ? { id: pupil.class.id, name: pupil.class.name } : null,
    fullName: pupil.fullName,
    dateOfBirth: pupil.dateOfBirth.toISOString().slice(0, 10),
    guardianName: pupil.guardianName,
    guardianPhone: pupil.guardianPhone,
    guardianRelationship: pupil.guardianRelationship as GuardianRelationship,
    address: pupil.address,
    status: pupil.status as PupilStatus,
    suspensionReason: pupil.suspensionReason,
  };
}

/** Throws if classId is set but doesn't belong to this org, or belongs to a different school than expected. */
async function assertClassBelongsToSchool(organizationId: string, classId: string, schoolId: string) {
  const cls = await classRepository.findById(classId, organizationId);
  if (!cls) {
    throw new AppError(404, "Class not found");
  }
  if (cls.schoolId !== schoolId) {
    throw new AppError(400, "That class does not belong to this pupil's school");
  }
}

export const pupilService = {
  async listForSchool(organizationId: string, query: ListPupilsQuery): Promise<PaginatedPupilResponse> {
    const school = await schoolRepository.findById(query.schoolId, organizationId);
    if (!school) {
      throw new AppError(404, "School not found");
    }

    const [pupils, total] = await pupilRepository.listBySchool(query.schoolId, query);
    return {
      data: pupils.map(toPupilResponse),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
      },
    };
  },

  async getById(organizationId: string, pupilId: string): Promise<PupilResponse> {
    const pupil = await pupilRepository.findById(pupilId, organizationId);
    if (!pupil) {
      throw new AppError(404, "Pupil not found");
    }
    return toPupilResponse(pupil);
  },

  async create(organizationId: string, data: CreatePupilRequest): Promise<PupilResponse> {
    const school = await schoolRepository.findById(data.schoolId, organizationId);
    if (!school) {
      throw new AppError(404, "School not found");
    }
    if (data.classId) {
      await assertClassBelongsToSchool(organizationId, data.classId, data.schoolId);
    }

    const created = await pupilRepository.create({
      schoolId: data.schoolId,
      classId: data.classId,
      fullName: data.fullName,
      dateOfBirth: new Date(data.dateOfBirth),
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      guardianRelationship: data.guardianRelationship,
      address: data.address,
    });
    return toPupilResponse(created);
  },

  async update(organizationId: string, pupilId: string, data: UpdatePupilRequest): Promise<PupilResponse> {
    const existing = await pupilRepository.findById(pupilId, organizationId);
    if (!existing) {
      throw new AppError(404, "Pupil not found");
    }
    if (data.classId) {
      await assertClassBelongsToSchool(organizationId, data.classId, existing.schoolId);
    }

    const updated = await pupilRepository.update(pupilId, {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    });
    return toPupilResponse(updated);
  },

  async delete(organizationId: string, pupilId: string): Promise<void> {
    const existing = await pupilRepository.findById(pupilId, organizationId);
    if (!existing) {
      throw new AppError(404, "Pupil not found");
    }
    await pupilRepository.softDelete(pupilId);
  },

  async suspend(organizationId: string, pupilId: string, data: SuspendPupilRequest): Promise<PupilResponse> {
    const existing = await pupilRepository.findById(pupilId, organizationId);
    if (!existing) {
      throw new AppError(404, "Pupil not found");
    }
    const suspended = await pupilRepository.suspend(pupilId, data.reason);
    return toPupilResponse(suspended);
  },

  async reactivate(organizationId: string, pupilId: string): Promise<PupilResponse> {
    const existing = await pupilRepository.findById(pupilId, organizationId);
    if (!existing) {
      throw new AppError(404, "Pupil not found");
    }
    const reactivated = await pupilRepository.reactivate(pupilId);
    return toPupilResponse(reactivated);
  },

  async moveMany(organizationId: string, data: MovePupilsRequest): Promise<PupilResponse[]> {
    const pupils = await pupilRepository.findManyByIds(data.pupilIds, organizationId);
    if (pupils.length !== data.pupilIds.length) {
      throw new AppError(404, "One or more pupils were not found");
    }

    if (data.classId) {
      const cls = await classRepository.findById(data.classId, organizationId);
      if (!cls) {
        throw new AppError(404, "Class not found");
      }
      const mismatched = pupils.some((pupil) => pupil.schoolId !== cls.schoolId);
      if (mismatched) {
        throw new AppError(400, "All selected pupils must belong to the target class's school");
      }
    }

    await pupilRepository.moveMany(data.pupilIds, data.classId);
    const moved = await pupilRepository.findManyByIds(data.pupilIds, organizationId);
    return moved.map(toPupilResponse);
  },
};
