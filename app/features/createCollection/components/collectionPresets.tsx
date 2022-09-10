import { clsx } from "clsx";
import { images } from "~/features/createCollection/namespace";

type Props = {
  disabled: boolean;
  selectedPreset: string;
  onSelectPreset: (preset: string) => void;
};

export const CollectionPresets = (props: Props) => {
  const { disabled, selectedPreset, onSelectPreset } = props;

  return (
    <div className="flex gap-5">
      {images.map((image) => (
        <button
          className={clsx(
            "overflow-hidden rounded-xl border-2 border-[#575757] transition-all duration-300",
            {
              "hover:border-pink-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#575757]":
                true,
              "!border-pink-600": selectedPreset === image.id,
            }
          )}
          key={image.id}
          disabled={disabled}
          onClick={() => onSelectPreset(image.id)}
        >
          <img
            className="object-none"
            width={105}
            height={105}
            src={image.src}
            alt={`preset-${image.id}`}
          />
        </button>
      ))}
    </div>
  );
};
