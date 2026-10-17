import knex, { type Knex } from "knex";
import knexConfig from "./knex-config";
import { env } from "./env";

const config = knexConfig[env.nodeEnv] ?? knexConfig.development;

export const db: Knex = knex(config);
