export type SchoolLevel = "nursery" | "primary" | "secondary";

export interface CreateSchoolRequest {
  name: string;
  level: SchoolLevel;
}

export interface SchoolResponse {
  id: string;
  name: string;
  level: SchoolLevel;
  onboardedAt: string | null;
}
