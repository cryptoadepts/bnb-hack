import { useState } from "react";

// API
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

// Wallet:
import { useWallet } from "~/context/walletContext";

// components:
import { CreateAchievementContainer } from "~/features/createAchievement/containers/createAchievementContainer";
import { getUser, getUserId } from "~/session.server";
import { createAchievementTransaction } from "~/service/blockchain";
import graphqlClient from "~/graphql/client";
import gql from "graphql-tag";
import { getUserById } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");

  const user = await getUserById(userId);

  const res = await graphqlClient.query({
    query: gql`
      query {
          collections(first: 1, where: {owner: "${user!.address}"}) {
              id
          }
      }
    `,
    variables: {
      owner: user!.address,
    },
  });

  if (!res.data.collections.length) return redirect("/collection/new");

  return json({
    collection: res.data.collections[0],
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
  const { collection } = data;

  const navigate = useNavigate();

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
      collectionId: collection.id,
      imageHash,
      name,
      points,
      tallyId,
    });
    if (!transaction) return;

    const tx = await sendTransaction(transaction);
    await tx?.wait();

    setIsLoading(false);

    navigate("/statistics");
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
