/* This example requires Tailwind CSS v2.0+ */
import { useState } from "react";
import { CreateCollectionStep } from "~/components/steps/createCollectionStep";
import { CreateAchievementStep } from "~/components/steps/createAchievementStep";

type Step = "createCollection" | "createAchievement";

const Collection = () => {
  const [currentStep, setCurrentStep] = useState<Step>("createCollection");

  return (
    <main className="relative mx-auto mt-[50px] flex min-h-screen w-[min(840px,100%)] flex-col justify-start">
      <nav aria-label="Progress">
        <ol role="list" className="overflow-hidden">
          {currentStep === "createCollection" ? (
            <CreateCollectionStep
              onNext={() => setCurrentStep("createAchievement")}
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
