import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// Avoids spawning a new PrismaClient (and a new connection pool) on every
// nodemon restart in dev — cache the instance on the Node global object,
// which survives module re-evaluation within the same process.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg(env.databaseUrl);

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (env.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}
