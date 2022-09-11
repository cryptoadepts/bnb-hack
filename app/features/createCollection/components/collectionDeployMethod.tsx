import React from "react";
import type { DeployMethod } from "~/features/createCollection/types";
import { clsx } from "clsx";

const deployCollectionMethod: Array<{
  id: DeployMethod;
  title: string;
  disabled: boolean;
}> = [
  { id: "default", title: "default collection", disabled: false },
  { id: "custom", title: "upload your collection", disabled: true },
];

type Props = {
  disabled: boolean;
  deployCollection: DeployMethod;
  onSelectDeployCollection: (deployCollection: DeployMethod) => void;
};

export const CollectionDeployMethod = React.memo((props: Props) => {
  const { deployCollection, onSelectDeployCollection, disabled } = props;

  return (
    <div className="flex gap-[50px] pl-1">
      {deployCollectionMethod.map((deployMethod) => (
        <div
          key={deployMethod.id}
          className={clsx("flex items-center", {
            "opacity-50": deployMethod.disabled,
            "cursor-not-allowed hover:cursor-not-allowed":
              deployMethod.disabled,
          })}
        >
          <input
            id={deployMethod.id}
            name="notification-method"
            type="radio"
            disabled={disabled || deployMethod.disabled}
            checked={deployCollection === deployMethod.id}
            onChange={() => onSelectDeployCollection(deployMethod.id)}
            className={clsx(
              "h-6 w-6 cursor-pointer border-pink-600 text-pink-600 transition-all duration-300 hover:border-pink-800 focus:ring-pink-600",
              { "bg-black": deployMethod.id !== deployCollection },
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-pink-600"
            )}
          />
          <label
            htmlFor={deployMethod.id}
            className={clsx(
              "ml-3 block text-sm text-[16px] font-medium leading-[24px]",
              {
                "text-white": !disabled,
                "text-[#575757]": disabled,
              }
            )}
          >
            {deployMethod.title}
            {deployMethod.disabled && " (coming soon)"}
          </label>
        </div>
      ))}
    </div>
  );
});

CollectionDeployMethod.displayName = "CollectionDeployMethod";
