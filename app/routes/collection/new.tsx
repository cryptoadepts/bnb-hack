import { useState } from "react";

// API
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { createCollectionTransaction } from "~/models/transaction.server";

// Wallet:
import { useWallet } from "~/context/walletContext";

// components:
import { CreateCollectionContainer } from "~/features/createCollection/containers/createCollectionContainer";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");

  try {
    const tx = await createCollectionTransaction();
    return json({ tx: { to: tx.to, data: tx.data } });
  } catch (error: unknown) {
    console.log("create collection transaction failed ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}

const Collection = () => {
  const data = useLoaderData();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { sendTransaction } = useWallet();

  const handleCreateCollection = async () => {
    setIsLoading(true);

    const tx = await sendTransaction(data.tx);
    await tx?.wait();

    setIsLoading(false);
    navigate("/achievement/new");
  };

  return (
    <main className="relative mx-auto mt-[50px] flex h-full w-[min(840px,100%)] flex-col justify-start px-5">
      <CreateCollectionContainer
        isLoading={isLoading}
        createCollection={handleCreateCollection}
      />
    </main>
  );
};

export default Collection;
