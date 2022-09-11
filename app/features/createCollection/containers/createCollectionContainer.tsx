import { useState } from "react";

import type { DeployMethod } from "~/features/createCollection/types";

// components
import { CollectionDeployMethod } from "~/features/createCollection/components/collectionDeployMethod";
import { Button } from "~/components/buttons/button";
import { CollectionPreview } from "~/features/createCollection/components/collectionPreview";

type Props = {
  isLoading: boolean;
  createCollection: () => void;
};

export const CreateCollectionContainer = (props: Props) => {
  const { createCollection, isLoading } = props;

  const [deployCollection, setDeployCollection] =
    useState<DeployMethod>("default");

  const handleCreateCollection = async () => {
    createCollection();
  };

  return (
    <div className="flex h-full flex-col gap-[50px]">
      <h1 className="text-[40px] leading-[48px]">create collection</h1>

      <CollectionDeployMethod
        disabled={isLoading}
        deployCollection={deployCollection}
        onSelectDeployCollection={setDeployCollection}
      />

      <CollectionPreview />

      <Button
        type="submit"
        disabled={isLoading}
        onClick={handleCreateCollection}
      >
        create
      </Button>
    </div>
  );
};
