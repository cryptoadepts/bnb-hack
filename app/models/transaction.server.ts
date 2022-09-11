import { ethers } from "ethers";
import { env } from "process";
import { Factory__factory } from "typechain-types";

async function loadIpfs() {
  const { create } = await import("ipfs-http-client");

  const node = await create({
    url: env.IPFS_URL!,
    headers: {
      Authorization: `Basic ${btoa(
        env.INFURA_IPFS_PROJECT_ID + ":" + env.INFURA_IPFS_PROJECT_SECRET
      )}`,
    },
  });

  return node;
}

loadIpfs();

export const ethersBackendProvider = ethers.getDefaultProvider(
  env.BLOCKCHAIN_URL!
);
export const defaultWallet = ethers.Wallet.createRandom();
export const minterWallet = new ethers.Wallet(
  env.MINTER_PRIV_KEY!,
  ethersBackendProvider
);
const factoryAddress = env.factoryAddress!;

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

  const ipfsClient = await loadIpfs();
  const uri = await ipfsClient.add(
    JSON.stringify({
      name: name,
      image: `ipfs://${imageHash}`,
      tallyId: tallyId,
    })
  );

  return await f.populateTransaction.creatAchievement(
    collectionId,
    "ipfs://" + uri.cid,
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
