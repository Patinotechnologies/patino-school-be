import type { Knex } from "knex";
import { db } from "../config/db";
import { ORGANIZATIONS_TABLE, type Organization, type NewOrganization } from "../models/Organization";

export const organizationRepository = {
  async findById(id: string, trx: Knex.Transaction | Knex = db): Promise<Organization | undefined> {
    return trx<Organization>(ORGANIZATIONS_TABLE).where({ id }).first();
  },

  async create(data: NewOrganization, trx: Knex.Transaction | Knex = db): Promise<Organization> {
    const [organization] = await trx<Organization>(ORGANIZATIONS_TABLE).insert(data).returning("*");
    return organization;
  },
};
