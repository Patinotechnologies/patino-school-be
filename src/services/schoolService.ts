import type { School } from "@prisma/client";
import { schoolRepository } from "../repositories/schoolRepository";
import type { CreateSchoolRequest, SchoolLevel, SchoolResponse } from "../interface/school";

export function toSchoolResponse(school: School): SchoolResponse {
  return {
    id: school.id,
    name: school.name,
    level: school.level as SchoolLevel,
    address: school.address,
    onboardedAt: school.onboardedAt ? school.onboardedAt.toISOString() : null,
  };
}

export const schoolService = {
  async create(organizationId: string, data: CreateSchoolRequest): Promise<SchoolResponse> {
    const school = await schoolRepository.create({
      organizationId,
      name: data.name,
      level: data.level,
      address: data.address,
    });
    return toSchoolResponse(school);
  },

  async listForOrganization(organizationId: string): Promise<SchoolResponse[]> {
    const schools = await schoolRepository.listByOrganization(organizationId);
    return schools.map(toSchoolResponse);
  },
};
