import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

export const tokenBlocklistRepository = {
  /** Marks one token (by its jti) as unusable — expiresAt lets it be purged once the token would have expired anyway. */
  revoke(jti: string, expiresAt: Date, client: Client = prisma) {
    return client.revokedToken.create({ data: { jti, expiresAt } });
  },

  async isRevoked(jti: string, client: Client = prisma): Promise<boolean> {
    const row = await client.revokedToken.findUnique({ where: { jti } });
    return row !== null;
  },
};
