import { ethers, getNamedAccounts } from "hardhat";
import { expect } from "chai";
import {
  Factory,
  Factory__factory,
  NFT,
  NFT__factory,
} from "../typechain-types";
import { create } from "ipfs-http-client";

const ipfsClient = create({
  url: "https://ipfs.infura.io:5001",
  headers: {
    Authorization: `Basic ${btoa(
      ""
    )}`,
  },
});

describe("Deploy script", () => {
  let minter: any;
  let owner: any;
  let user: any;

  let factory: Factory;
  let collection: NFT;

  before(async () => {
    const accounts = await getNamedAccounts();

    minter = accounts.minter;
    owner = accounts.minter;
    user = accounts.minter;

    /*
    const factoryFactory = (await ethers.getContractFactory(
      "Factory"
    )) as Factory__factory;
    const f = await factoryFactory.deploy();
    await f.deployed();
    */

    const f = Factory__factory.connect(
      "0xA58eDC00b8F6D14c743693bD62aD5E6c085ABc11",
      ethers.provider
    );
    console.log(f.address);
    console.log(accounts);
    factory = f.connect(await ethers.getSigner(owner));
  });

  it("create collection", async () => {
    const id = Math.floor(Math.random() * 100000000);
    const tx = await factory.createCollection();
    const res = await tx.wait();

    const createCollectionLog = res.logs
      .filter((x) => x.address === factory.address)
      .map((log) => {
        return factory.interface.parseLog(log);
      })
      .find(
        (log) => log.signature == "CreateCollection(address,address,address)"
      );
    collection = NFT__factory.connect(
      createCollectionLog?.args.collection!,
      await ethers.getSigner(owner)
    );
  });

  it("create poap", async () => {
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
        name: "Definition Heroes",
        image: "ipfs://test.com",
        tallyId: "3Eke2N",
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

    const tx = await factory.creatAchievement(
      collection.address,
      "ipfs://" + newCid + "/{id}.json",
      ethers.utils.parseEther("2")
    );

    expect((await tx.wait()).status == 1);
  });

  it("mint nft", async () => {
    const tx = await factory
      .connect(await ethers.getSigner(minter))
      .mint(collection.address, user, 0);

    expect((await tx.wait()).status == 1);
  });

  /*

  it("create item", async () => {
    const tx = await factory.creatItem(
      collection.address,
      "ipfs://test",
      ethers.utils.parseEther("2"),
      10
    );

    expect((await tx.wait()).status == 1);
  });
  it("buy item", async () => {
    const tx = await factory
      .connect(await ethers.getSigner(user))
      .buy(collection.address, 0);

    expect((await tx.wait()).status == 1);
  });*/
});
