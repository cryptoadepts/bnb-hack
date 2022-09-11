import type { User } from "@prisma/client";

import { prisma } from "~/db.server";
import { utils } from "ethers";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(address: User["address"]) {
  return prisma.user.create({
    data: {
      address,
    },
  });
}

export async function verifyLogin(walletAddress: string): Promise<User | null> {
  let user = await prisma.user.findUnique({
    where: { address: walletAddress },
  });
  if (!user) {
    user = await createUser(walletAddress);
  }

  return user;
}
