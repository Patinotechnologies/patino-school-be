import path from "node:path";
import type { Knex } from "knex";
import { env } from "./env";

const migrationsDirectory = path.join(__dirname, "..", "db", "migrations");
const seedsDirectory = path.join(__dirname, "..", "db", "seeds");

const config: Record<string, Knex.Config> = {
  development: {
    client: "pg",
    connection: env.databaseUrl,
    migrations: {
      directory: migrationsDirectory,
      extension: "ts",
    },
    seeds: {
      directory: seedsDirectory,
      extension: "ts",
    },
  },

  production: {
    client: "pg",
    connection: env.databaseUrl,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: migrationsDirectory,
      extension: "ts",
    },
  },
};

export default config;
