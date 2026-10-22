export interface RegisterRequest {
  fullName: string;
  organizationName: string;
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthenticatedOrganization {
  id: string;
  name: string;
  onboardedAt: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthenticatedUser;
  organization: AuthenticatedOrganization;
}

export interface MeResponse {
  user: AuthenticatedUser;
  organization: AuthenticatedOrganization;
}
