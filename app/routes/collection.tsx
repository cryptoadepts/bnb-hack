/* This example requires Tailwind CSS v2.0+ */
import { useState } from "react";
import { CreateCollectionContainer } from "~/features/createCollection/containers/createCollectionContainer";
import { CreateAchievementStep } from "~/components/steps/createAchievementStep";
import type { LoaderArgs } from "@remix-run/node";
import { createCollectionTransaction } from "~/models/transaction.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useWallet } from "~/context/walletContext";

type Step = "createCollection" | "createAchievement";

export async function loader({ request }: LoaderArgs) {
  const tx = createCollectionTransaction({ collectionId: "", userId: "" });

  try {
    return json({ tx });
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}

const Collection = () => {
  const data = useLoaderData<typeof loader>();
  const { sendTransaction } = useWallet();

  const [currentStep, setCurrentStep] = useState<Step>("createCollection");

  const handleCreateCollection = async () => {
    const tx = await sendTransaction(data.tx);
    console.log(tx);
  };

  return (
    <main className="relative mx-auto mt-[50px] flex min-h-screen w-[min(840px,100%)] flex-col justify-start">
      <nav aria-label="Progress">
        <ol role="list" className="overflow-hidden">
          {currentStep === "createCollection" ? (
            <CreateCollectionContainer
              isLoading={false}
              createCollection={handleCreateCollection}
            />
          ) : null}

          {currentStep === "createAchievement" ? (
            <CreateAchievementStep />
          ) : null}
        </ol>
      </nav>
    </main>
  );
};

export default Collection;
