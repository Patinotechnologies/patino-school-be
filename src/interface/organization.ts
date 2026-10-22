export interface OrganizationProfileResponse {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  onboardedAt: string | null;
}

export interface UpdateOrganizationRequest {
  name?: string;
  phone?: string | null;
  email?: string | null;
}
