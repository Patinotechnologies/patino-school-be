export interface UserProfileResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string | null;
}
