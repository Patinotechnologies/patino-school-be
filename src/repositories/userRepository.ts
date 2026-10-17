import type { Knex } from "knex";
import { db } from "../config/db";
import { USERS_TABLE, type User, type NewUser } from "../models/User";

export const userRepository = {
  async findByEmail(email: string, trx: Knex.Transaction | Knex = db): Promise<User | undefined> {
    return trx<User>(USERS_TABLE).where({ email }).first();
  },

  async findById(id: string, trx: Knex.Transaction | Knex = db): Promise<User | undefined> {
    return trx<User>(USERS_TABLE).where({ id }).first();
  },

  async create(data: NewUser, trx: Knex.Transaction | Knex = db): Promise<User> {
    const [user] = await trx<User>(USERS_TABLE).insert(data).returning("*");
    return user;
  },
};
