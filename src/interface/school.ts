export type SchoolLevel = "nursery" | "primary" | "secondary";

export interface CreateSchoolRequest {
  name: string;
  level: SchoolLevel;
  address?: string | null;
}

export interface SchoolResponse {
  id: string;
  name: string;
  level: SchoolLevel;
  address: string | null;
  onboardedAt: string | null;
}
