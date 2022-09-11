import { clsx } from "clsx";
import { images } from "~/features/createAchievement/namespace";

export const CollectionPreview = () => {
  return (
    <div className="flex gap-5">
      {images.map((image) => (
        <div
          className={clsx(
            "flex items-center justify-center overflow-hidden rounded-xl border-2 border-[#575757] transition-all duration-300"
          )}
          key={image.id}
        >
          <img
            className="bg-black"
            width={80}
            height={80}
            src={image.src}
            alt={`preset-${image.id}`}
          />
        </div>
      ))}
    </div>
  );
};
