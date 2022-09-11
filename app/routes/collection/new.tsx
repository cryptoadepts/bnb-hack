import { useState } from "react";

// API
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { createCollectionTransaction } from "~/models/transaction.server";

// Wallet:
import { useWallet } from "~/context/walletContext";

// components:
import { CreateCollectionContainer } from "~/features/createCollection/containers/createCollectionContainer";

export const action: ActionFunction = async ({ request }) => {
  const tx = await createCollectionTransaction();

  try {
    return json({ tx: { to: tx.to, data: tx.data } });
  } catch (error: unknown) {
    console.log("create collection transaction failed ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};

const Collection = () => {
  const data = useActionData<typeof action>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { sendTransaction } = useWallet();

  const handleCreateCollection = async () => {
    setIsLoading(true);

    const tx = await sendTransaction(data.tx);
    console.log(tx);

    setIsLoading(false);
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
