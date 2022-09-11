import type { ContractTransaction, PopulatedTransaction } from "ethers";
import { BigNumber, ethers } from "ethers";
import { Factory__factory, NFT__factory } from "../../typechain-types";
import { create } from "ipfs-http-client";
import type { Web3Provider } from "@ethersproject/providers";

const factoryAddress = "0xA58eDC00b8F6D14c743693bD62aD5E6c085ABc11";

export async function createAchievementTransaction({
  provider,
  IPFS_URL,
  INFURA_IPFS_PROJECT_ID,
  INFURA_IPFS_PROJECT_SECRET,
  collectionId,
  imageHash,
  name,
  points,
  tallyId,
}: {
  provider: Web3Provider | undefined;
  IPFS_URL: string;
  INFURA_IPFS_PROJECT_ID: string;
  INFURA_IPFS_PROJECT_SECRET: string;
  collectionId: string;
  imageHash: string;
  name: string;
  points: number;
  tallyId: string;
}): Promise<PopulatedTransaction | null> {
  if (!provider) return null;

  console.log("IPFS_URL", IPFS_URL);

  const ipfsClient = create({
    url: IPFS_URL!,
    headers: {
      Authorization: `Basic ${btoa(
        INFURA_IPFS_PROJECT_ID + ":" + INFURA_IPFS_PROJECT_SECRET
      )}`,
    },
  });

  const f = Factory__factory.connect(factoryAddress, provider);

  const collection = NFT__factory.connect(collectionId, provider);
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

      console.log("chunks", chunks);

      const textDecoder = new TextDecoder();
      const str = chunks.reduce((a, b) => a + textDecoder.decode(b), "");

      obj.set(id + ".json", str);
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
    ethers.utils.parseEther(points.toString())
  );
}
