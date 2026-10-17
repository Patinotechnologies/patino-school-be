import { schoolRepository } from "../repositories/schoolRepository";
import type { CreateSchoolRequest, SchoolResponse } from "../interface/school";
import type { School } from "../models/School";

function toResponse(school: School): SchoolResponse {
  return {
    id: school.id,
    name: school.name,
    level: school.level,
    onboardedAt: school.onboarded_at ? school.onboarded_at.toISOString() : null,
  };
}

export const schoolService = {
  async create(organizationId: string, data: CreateSchoolRequest): Promise<SchoolResponse> {
    const school = await schoolRepository.create({
      organization_id: organizationId,
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
