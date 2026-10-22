import type { SchoolLevel, SchoolResponse } from "./school";
import type { StaffRole, StaffResponse } from "./staff";
import type { OrganizationProfileResponse } from "./organization";

export interface CompleteOnboardingRequest {
  organization: {
    phone?: string | null;
    email?: string | null;
  };
  schools: Array<{
    name: string;
    level: SchoolLevel;
    address?: string | null;
  }>;
  staff: Array<{
    fullName: string;
    email: string;
    phone?: string | null;
    role: StaffRole;
  }>;
}

export interface CompleteOnboardingResponse {
  organization: OrganizationProfileResponse;
  schools: SchoolResponse[];
  staff: StaffResponse[];
}
