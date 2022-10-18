import { ethers } from "hardhat";
import { Factory__factory } from "../typechain-types";

const factory = "0x4cFcE4f64071adC0Baa3275dD9C1Da96e2D3aCe4";
const signer = ethers.Wallet.createRandom();

async function createCollection() {
  Factory__factory.connect(
    factory,
    signer
  ).populateTransaction.createCollection("", "");
}

async function creatAchievement() {
  Factory__factory.connect(
    factory,
    signer
  ).populateTransaction.createCollection("", "");
}


async function mint() {
  Factory__factory.connect(
    factory,
    signer
  ).populateTransaction.createCollection("", "");
}
