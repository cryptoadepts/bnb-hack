import { ethers } from "ethers";
import { env } from "process";
import { Factory__factory, NFT__factory } from "typechain-types";
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
  const collection = NFT__factory.connect(collectionId, defaultWallet);
  const uri = await collection.uri(0);
  console.log(uri);

  const lastId = await collection.lastItemId();

  let folder: Array<any> = [];
  if (uri !== "") {
    const cid = uri.replace("ipfs://", "").replace("{id}.json", "");
    const obj = new Map<string, String>();
    for (let i = 0; i < lastId.toNumber(); i++) {
      const id = ethers.utils
        .hexZeroPad(ethers.BigNumber.from(i).toHexString(), 32)
        .replace("0x", "");

      const chunks = [];
      for await (const chunk of ipfsClient.cat(cid + "/" + id + ".json")) {
        chunks.push(chunk);
      }

      obj.set(id + ".json", Buffer.concat(chunks).toString());
    }

    folder = Array.from(obj.keys()).map((x: string) => ({
      path: x,
      content: obj.get(x),
    }));
  }

  folder.push({
    path:
      ethers.utils.hexZeroPad(lastId.toHexString(), 32).replace("0x", "") +
      ".json",
    content: JSON.stringify({
      name: name,
      image: "ipfs://" + imageHash,
      tallyId: tallyId,
    }),
  });

  const res = ipfsClient.addAll(folder, {
    pin: true,
    wrapWithDirectory: true,
  });

  let newCid = "";
  for await (const file of res) {
    console.log(file.cid);
    console.log(file.path);
    newCid = file.cid.toString();
  }

  return await f.populateTransaction.creatAchievement(
    collection.address,
    "ipfs://" + newCid + "/{id}.json",
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
