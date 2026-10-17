import type { Knex } from "knex";
import { db } from "../config/db";
import { SCHOOLS_TABLE, type School, type NewSchool } from "../models/School";

export const schoolRepository = {
  /** Scoped by organization_id so a school can never be read across tenants. */
  async findById(
    id: string,
    organizationId: string,
    trx: Knex.Transaction | Knex = db,
  ): Promise<School | undefined> {
    return trx<School>(SCHOOLS_TABLE).where({ id, organization_id: organizationId }).first();
  },

  async listByOrganization(organizationId: string, trx: Knex.Transaction | Knex = db): Promise<School[]> {
    return trx<School>(SCHOOLS_TABLE).where({ organization_id: organizationId }).orderBy("created_at", "asc");
  },

  async create(data: NewSchool, trx: Knex.Transaction | Knex = db): Promise<School> {
    const [school] = await trx<School>(SCHOOLS_TABLE).insert(data).returning("*");
    return school;
  },
};
