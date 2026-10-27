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

/** Org-wide counts across every school — for the sidebar summary card. */
export interface OrganizationStatsResponse {
  totalStaff: number;
  totalPupils: number;
  totalClasses: number;
}
