import { useState } from "react";

// API
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Wallet:
import { useWallet } from "~/context/walletContext";

// components:
import { CreateAchievementContainer } from "~/features/createAchievement/containers/createAchievementContainer";
import { getUserId } from "~/session.server";
import { createAchievementTransaction } from "~/service/blockchain";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");

  return json({
    ENV: {
      IPFS_URL: process.env.IPFS_URL,
      INFURA_IPFS_PROJECT_ID: process.env.INFURA_IPFS_PROJECT_ID,
      INFURA_IPFS_PROJECT_SECRET: process.env.INFURA_IPFS_PROJECT_SECRET,
    },
  });
}

const Achievement = () => {
  const data = useLoaderData();
  const { IPFS_URL, INFURA_IPFS_PROJECT_ID, INFURA_IPFS_PROJECT_SECRET } =
    data?.ENV;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { sendTransaction, provider } = useWallet();

  const handleCreateAchievement = async (
    imageHash: string,
    name: string,
    points: number,
    tallyId: string
  ) => {
    setIsLoading(true);

    const transaction = await createAchievementTransaction({
      provider,
      IPFS_URL,
      INFURA_IPFS_PROJECT_ID,
      INFURA_IPFS_PROJECT_SECRET,
      collectionId: "0x74ad4df7062880570389473b1ee98dcdc8f4e270",
      imageHash,
      name,
      points,
      tallyId,
    });
    if (!transaction) return;

    console.log("transaction", transaction);

    const tx = await sendTransaction(transaction);
    await tx?.wait();

    setIsLoading(false);
  };

  return (
    <main className="relative mx-auto mt-[50px] flex h-full w-[min(840px,100%)] flex-col justify-start px-5">
      <CreateAchievementContainer
        isLoading={isLoading}
        createAchievement={handleCreateAchievement}
      />
    </main>
  );
};

export default Achievement;
