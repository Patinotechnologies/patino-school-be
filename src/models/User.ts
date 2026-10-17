export const USERS_TABLE = "users";

export interface User {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

/** Shape required to insert a row — id/timestamps are DB-generated, not caller-supplied. */
export type NewUser = Omit<User, "id" | "created_at" | "updated_at">;
