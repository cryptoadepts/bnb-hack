import { useState } from "react";
import { cn } from "~/utils/classnames";

type Props = {
  onNext: () => void;
};

const deployCollectionMethod = [
  { id: "default", title: "default collection" },
  { id: "custom", title: "upload your collection" },
];

export const CreateCollectionStep = (props: Props) => {
  const { onNext } = props;

  const [deployCollection, setDeployCollection] = useState("default");

  return (
    <>
      <h1 className="text-[40px] leading-[48px]">create collection</h1>

      <div className="mt-[50px] space-y-4 py-1 pl-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
        {deployCollectionMethod.map((deployMethod) => (
          <div key={deployMethod.id} className="flex items-center">
            <input
              id={deployMethod.id}
              name="notification-method"
              type="radio"
              defaultChecked={deployMethod.id === "email"}
              checked={deployCollection === deployMethod.id}
              onChange={() => setDeployCollection(deployMethod.id)}
              className={cn(
                "h-6 w-6 border-pink-600 text-pink-600 focus:ring-pink-600",
                deployMethod.id !== deployCollection ? "bg-black" : ""
              )}
            />
            <label
              htmlFor={deployMethod.id}
              className="ml-3 block text-sm text-[16px] font-medium leading-[24px]"
            >
              {deployMethod.title}
            </label>
          </div>
        ))}
      </div>
    </>
  );
};
