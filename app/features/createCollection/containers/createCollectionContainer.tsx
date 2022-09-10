import { useState } from "react";

import type { DeployMethod } from "~/features/createCollection/types";

// components
import { CollectionDeployMethod } from "~/features/createCollection/components/collectionDeployMethod";
import { CollectionPresets } from "~/features/createCollection/components/collectionPresets";
import { images } from "~/features/createCollection/namespace";

type Props = {
  isLoading: boolean;
  createCollection: (deployMethod: DeployMethod, image: any) => void;
};

export const CreateCollectionContainer = (props: Props) => {
  const { createCollection } = props;

  const [deployCollection, setDeployCollection] =
    useState<DeployMethod>("default");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("1");

  const image = images.find((image) => image.id === selectedPreset);
  console.log(image?.src);

  const handleCreateCollection = async () => {
    setIsLoading(true);

    const image = images.find((image) => image.id === selectedPreset);
    const maybeImg = await fetch(image?.src || "");
    const asd = await maybeImg.blob();

    createCollection(deployCollection, image?.src);
  };

  return (
    <div className="flex h-full flex-col gap-[50px]">
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

      <button
        onClick={handleCreateCollection}
        className="w-[min(240px,100%)] rounded-full bg-[#FF0099] px-[96px] py-[22px]"
      >
        create
      </button>
    </div>
  );
};
