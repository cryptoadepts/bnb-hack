import tallySvg from "~/images/tally.svg";
import { clsx } from "clsx";

type Props = {
  image: string;
  title: string;
  count: number;
  tallyId: string;
};

export const AchievementCard = (props: Props) => {
  const { image, title, count, tallyId } = props;

  return (
    <div
      className={clsx(
        "flex h-[130px] w-full cursor-pointer items-center gap-[25px] overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.08)]",
        "transition duration-200 ease-in-out hover:-translate-x-1"
      )}
    >
      <img src={image} alt={title} width={130} height={130} />

      <div className="flex flex-col justify-center gap-5">
        <h3 className="text-[32px] font-medium leading-[40px]">{title}</h3>

        <div className="flex items-center gap-[33px] text-gray-500">
          <div className="flex gap-2 text-[20px]">
            <span className="text-white">{count}</span>
            <span>achievers</span>
          </div>

          <div className="flex gap-2 text-[16px] font-medium">
            <img src={tallySvg} alt={"Tally image"} />

            <span>Tally {tallyId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
