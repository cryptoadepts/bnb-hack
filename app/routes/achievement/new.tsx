import { useState } from "react";

// API
import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { createAchievementTransaction } from "~/models/transaction.server";

// Wallet:
import { useWallet } from "~/context/walletContext";

// components:
import { CreateAchievementContainer } from "~/features/createAchievement/containers/createAchievementContainer";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");

  return json({});
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const collectionId = formData.get("collectionId") as string;
  const imageHash = formData.get("imageHash") as string;
  const name = formData.get("name") as string;
  const points = formData.get("points") as string;
  const tallyId = formData.get("tallyId") as string;

  const tx = await createAchievementTransaction({
    collectionId,
    imageHash,
    name,
    points: Number(points),
    tallyId,
  });

  try {
    return json({ tx: { to: tx.to, data: tx.data } });
  } catch (error: unknown) {
    console.log("create achievement transaction failed ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};

const Achievement = () => {
  const data = useActionData<typeof action>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { sendTransaction } = useWallet();

  const handleCreateAchievement = async () => {
    setIsLoading(true);

    
    const tx = await sendTransaction(data.tx);
    console.log(tx);

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
