import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

export const organizationRepository = {
  findById(id: string, client: Client = prisma) {
    return client.organization.findUnique({ where: { id } });
  },

  findByOwnerId(ownerId: string, client: Client = prisma) {
    return client.organization.findFirst({ where: { ownerId } });
  },

  create(data: { name: string; ownerId: string }, client: Client = prisma) {
    return client.organization.create({ data });
  },
};
