import type { ethers } from "ethers";

export function createCollectionTransaction({
  collectionId,
  userId,
}: {
  collectionId: string; // TODO: changes parameters
  userId: string;
}): ethers.Transaction {
  return {} as any;
}

export function createAchievementTransaction({
  imageHash,
  name,
  points,
  tallyId,
}: {
  imageHash: string; // TODO: changes parameters, collectionAddress?
  name: string;
  points: number;
  tallyId: string;
}): ethers.Transaction {
  return {} as any;
}
