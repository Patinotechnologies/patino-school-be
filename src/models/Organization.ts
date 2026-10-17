export const ORGANIZATIONS_TABLE = "organizations";

export interface Organization {
  id: string;
  name: string;
  /** FK → users.id, ON DELETE RESTRICT (see 20261016000003_add_owner_to_organizations). Not unique — a user could theoretically own more than one org at the DB level, though nothing in the app creates that today. */
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

/** Shape required to insert a row — id/timestamps are DB-generated, not caller-supplied. */
export type NewOrganization = Omit<Organization, "id" | "created_at" | "updated_at">;
