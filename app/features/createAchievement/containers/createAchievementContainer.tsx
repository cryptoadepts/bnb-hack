import { images } from "~/features/createAchievement/namespace";
import { useState } from "react";
import { CollectionPresets } from "~/features/createAchievement/components/collectionPresets";
import { Input } from "~/components/input";
import { Button } from "~/components/button";

type Props = {
  isLoading: boolean;
  createAchievement: (
    imageHash: string,
    name: string,
    points: number,
    tallyId: string
  ) => void;
};

export const CreateAchievementContainer = (props: Props) => {
  const { isLoading, createAchievement } = props;

  const [selectedPreset, setSelectedPreset] = useState<string>("1");

  const [name, setName] = useState<string>("");
  const [points, setPoints] = useState<string>("");
  const [tallyId, setTallyId] = useState<string>("");

  const handleCreateAchievement = async () => {
    const image = images.find((image) => image.id === selectedPreset);
    const maybeImg = await fetch(image?.src || "");
    // TODO: add hash for each image to pass it to contract;
    const hash = await maybeImg.blob();

    createAchievement("hash", name, Number(points), tallyId);
  };

  const inputClassName = "w-[min(550px,100%)]";

  return (
    <div className="flex h-full flex-col gap-[50px]">
      <h1 className="text-[40px] leading-[48px]">create achievement</h1>

      <div>
        <p className="mb-2.5">choose art work</p>

        <CollectionPresets
          disabled={isLoading}
          selectedPreset={selectedPreset}
          onSelectPreset={setSelectedPreset}
        />
      </div>

      <div>
        <p className="mb-2.5">write name of NFT achievement</p>

        <Input
          className={inputClassName}
          placeholder="name"
          disabled={isLoading}
          value={name}
          onChange={setName}
        />
      </div>

      <div>
        <p className="mb-2.5">write the points of achievement</p>

        <Input
          className={inputClassName}
          type="number"
          placeholder="points"
          disabled={isLoading}
          value={points}
          onChange={setPoints}
        />
      </div>

      <div>
        <p className="mb-2.5">enter the link to Tally (logo) form</p>

        <Input
          className={inputClassName}
          placeholder="tally id"
          disabled={isLoading}
          value={tallyId}
          onChange={setTallyId}
        />
      </div>

      <Button type="submit" onClick={handleCreateAchievement}>
        create
      </Button>
    </div>
  );
};
