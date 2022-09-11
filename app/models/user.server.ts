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

export async function verifyLogin(
  walletAddress: string,
  signature: string,
  nonce: string
): Promise<User | null> {
  const signerAddress = utils.verifyMessage(nonce, signature);

  if (walletAddress.toLowerCase() !== signerAddress.toLowerCase()) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: { address: walletAddress },
  });
  if (!user) {
    user = await createUser(walletAddress);
  }

  return user;
}
