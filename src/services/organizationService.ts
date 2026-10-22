import type { Organization } from "@prisma/client";
import { organizationRepository } from "../repositories/organizationRepository";
import { AppError } from "../utils/AppError";
import type { AuthTokenPayload } from "../utils/jwt";
import type { OrganizationProfileResponse, UpdateOrganizationRequest } from "../interface/organization";

export function toOrganizationResponse(organization: Organization): OrganizationProfileResponse {
  return {
    id: organization.id,
    name: organization.name,
    phone: organization.phone,
    email: organization.email,
    onboardedAt: organization.onboardedAt ? organization.onboardedAt.toISOString() : null,
  };
}

export const organizationService = {
  async getCurrent(auth: AuthTokenPayload): Promise<OrganizationProfileResponse> {
    const organization = await organizationRepository.findById(auth.organizationId);
    if (!organization) {
      throw new AppError(401, "Organization no longer exists");
    }
    return toOrganizationResponse(organization);
  },

  async updateCurrent(auth: AuthTokenPayload, data: UpdateOrganizationRequest): Promise<OrganizationProfileResponse> {
    const organization = await organizationRepository.findById(auth.organizationId);
    if (!organization) {
      throw new AppError(401, "Organization no longer exists");
    }

    const updated = await organizationRepository.update(auth.organizationId, data);
    return toOrganizationResponse(updated);
  },
};
