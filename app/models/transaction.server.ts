import { ethers } from "ethers";
import { env } from "process";
import { Factory__factory } from "typechain-types";
import { create } from "ipfs-http-client";

const ipfsClient = create({
  url: env.IPFS_URL!,
  headers: {
    Authorization: `Basic ${btoa(
      env.INFURA_IPFS_PROJECT_ID + ":" + env.INFURA_IPFS_PROJECT_SECRET
    )}`,
  },
});

export const ethersBackendProvider = ethers.getDefaultProvider(
  env.BLOCKCHAIN_URL!
);
export const defaultWallet = ethers.Wallet.createRandom();
export const minterWallet = new ethers.Wallet(
  env.MINTER_PRIV_KEY!,
  ethersBackendProvider
);
const factoryAddress = "0xA58eDC00b8F6D14c743693bD62aD5E6c085ABc11";

export async function createCollectionTransaction(): Promise<ethers.PopulatedTransaction> {
  const f = Factory__factory.connect(factoryAddress, defaultWallet);
  return await f.populateTransaction.createCollection();
}

export async function createAchievementTransaction({
  collectionId,
  imageHash,
  name,
  points,
  tallyId,
}: {
  collectionId: string;
  imageHash: string;
  name: string;
  points: number;
  tallyId: string;
}): Promise<ethers.PopulatedTransaction> {
  const f = Factory__factory.connect(factoryAddress, defaultWallet);

  const uri = await ipfsClient.add(
    JSON.stringify({
      name: name,
      image: `ipfs://${imageHash}`,
      tallyId: tallyId,
    })
  );

  return await f.populateTransaction.creatAchievement(
    collectionId,
    "ipfs://" + uri.cid.toString(),
    ethers.utils.formatEther(points)
  );
}

export async function mint({
  collectionId,
  receiver,
  achievementId,
}: {
  collectionId: string;
  receiver: string;
  achievementId: ethers.BigNumberish;
}): Promise<ethers.ContractTransaction> {
  const f = Factory__factory.connect(factoryAddress, minterWallet);

  return await f.mint(collectionId, receiver, achievementId);
}
