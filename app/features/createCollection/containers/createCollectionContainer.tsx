import { useState } from "react";

import type { DeployMethod } from "~/features/createCollection/types";

// components
import { CollectionDeployMethod } from "~/features/createCollection/components/collectionDeployMethod";
import { Button } from "~/components/button";

type Props = {
  isLoading: boolean;
  createCollection: () => void;
};

export const CreateCollectionContainer = (props: Props) => {
  const { createCollection } = props;

  const [deployCollection, setDeployCollection] =
    useState<DeployMethod>("default");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreateCollection = async () => {
    setIsLoading(true);

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

      <Button type="submit" onClick={handleCreateCollection}>
        create
      </Button>
    </div>
  );
};
