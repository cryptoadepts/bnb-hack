import image1 from "~/images/Rectangle_0.jpg";
import image2 from "~/images/Rectangle_1.jpg";
import image3 from "~/images/Rectangle_2.jpg";
import image4 from "~/images/Rectangle_3.jpg";
import image5 from "~/images/Rectangle_4.jpg";
import image6 from "~/images/Rectangle_5.jpg";
import { clsx } from "clsx";

type Props = {
  disabled: boolean;
  selectedPreset: number;
  onSelectPreset: (preset: number) => void;
};

const images = [image1, image2, image3, image4, image5, image6];

export const CollectionPresets = (props: Props) => {
  const { disabled, selectedPreset, onSelectPreset } = props;

  return (
    <div className="mt-[50px] flex gap-5">
      {images.map((image, index) => (
        <button
          className={clsx(
            "overflow-hidden rounded-xl border-2 border-[#575757] transition-all duration-300",
            {
              "hover:border-pink-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#575757]":
                true,
              "!border-pink-600": selectedPreset === index,
            }
          )}
          key={index}
          disabled={disabled}
          onClick={() => onSelectPreset(index)}
        >
          <img
            className="object-none"
            width={105}
            height={105}
            src={image}
            alt={`preset-${index}`}
          />
        </button>
      ))}
    </div>
  );
};
