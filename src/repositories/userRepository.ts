import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type Client = typeof prisma | Prisma.TransactionClient;

export const userRepository = {
  findByEmail(email: string, client: Client = prisma) {
    return client.user.findUnique({ where: { email } });
  },

  findById(id: string, client: Client = prisma) {
    return client.user.findUnique({ where: { id } });
  },

  create(data: { email: string; fullName: string; passwordHash: string }, client: Client = prisma) {
    return client.user.create({ data });
  },
};
