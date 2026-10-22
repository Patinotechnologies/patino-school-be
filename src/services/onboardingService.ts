import { prisma } from "../config/prisma";
import { organizationRepository } from "../repositories/organizationRepository";
import { schoolRepository } from "../repositories/schoolRepository";
import { staffRepository } from "../repositories/staffRepository";
import { toOrganizationResponse } from "./organizationService";
import { toSchoolResponse } from "./schoolService";
import { toStaffResponse } from "./staffService";
import { AppError } from "../utils/AppError";
import type { AuthTokenPayload } from "../utils/jwt";
import type { CompleteOnboardingRequest, CompleteOnboardingResponse } from "../interface/onboarding";

export const onboardingService = {
  async complete(auth: AuthTokenPayload, data: CompleteOnboardingRequest): Promise<CompleteOnboardingResponse> {
    const organization = await organizationRepository.findById(auth.organizationId);
    if (!organization) {
      throw new AppError(401, "Organization no longer exists");
    }
    if (organization.onboardedAt) {
      throw new AppError(409, "This organization has already completed onboarding");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrganization = await organizationRepository.update(
        auth.organizationId,
        { ...data.organization, onboardedAt: new Date() },
        tx,
      );

      const schools = [];
      for (const school of data.schools) {
        schools.push(await schoolRepository.create({ organizationId: auth.organizationId, ...school }, tx));
      }

      const staff = [];
      for (const member of data.staff) {
        staff.push(await staffRepository.create({ organizationId: auth.organizationId, ...member }, tx));
      }

      return { updatedOrganization, schools, staff };
    });

    return {
      organization: toOrganizationResponse(result.updatedOrganization),
      schools: result.schools.map(toSchoolResponse),
      staff: result.staff.map(toStaffResponse),
    };
  },
};
