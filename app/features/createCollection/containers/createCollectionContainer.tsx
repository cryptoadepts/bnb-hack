import { useState } from "react";

import type { DeployMethod } from "~/features/createCollection/types";

// components
import { CollectionDeployMethod } from "~/features/createCollection/components/collectionDeployMethod";
import { CollectionPresets } from "~/features/createCollection/components/collectionPresets";

type Props = {
  onNext: () => void;
};

export const CreateCollectionContainer = (props: Props) => {
  const { onNext } = props;

  const [deployCollection, setDeployCollection] =
    useState<DeployMethod>("default");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<number>(0);

  return (
    <>
      <h1 className="text-[40px] leading-[48px]">create collection</h1>

      <CollectionDeployMethod
        disabled={isLoading}
        deployCollection={deployCollection}
        onSelectDeployCollection={setDeployCollection}
      />

      <CollectionPresets
        disabled={isLoading}
        selectedPreset={selectedPreset}
        onSelectPreset={setSelectedPreset}
      />

      <button className="mt-[50px] rounded-full bg-[#FF0099] px-[96px] py-[22px]">
        create
      </button>
    </>
  );
};
