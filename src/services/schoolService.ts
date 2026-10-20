import type { School } from "@prisma/client";
import { schoolRepository } from "../repositories/schoolRepository";
import type { CreateSchoolRequest, SchoolLevel, SchoolResponse } from "../interface/school";

function toResponse(school: School): SchoolResponse {
  return {
    id: school.id,
    name: school.name,
    level: school.level as SchoolLevel,
    onboardedAt: school.onboardedAt ? school.onboardedAt.toISOString() : null,
  };
}

export const schoolService = {
  async create(organizationId: string, data: CreateSchoolRequest): Promise<SchoolResponse> {
    const school = await schoolRepository.create({
      organizationId,
      name: data.name,
      level: data.level,
    });
    return toResponse(school);
  },

  async listForOrganization(organizationId: string): Promise<SchoolResponse[]> {
    const schools = await schoolRepository.listByOrganization(organizationId);
    return schools.map(toResponse);
  },
};
