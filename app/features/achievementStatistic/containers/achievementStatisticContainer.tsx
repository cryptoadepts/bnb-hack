import { AchievementCard } from "~/features/achievementStatistic/components/achievementCard";
import { Button } from "~/components/buttons";

type Props = {
  achievements: Array<any>;
};

export const AchievementStatisticContainer = (props: Props) => {
  const { achievements } = props;

  return (
    <div className="flex w-[min(600px,100%)] flex-col gap-5">
      {achievements.map((achievement, index) => (
        <AchievementCard key={achievement.tallyId} {...achievement} />
      ))}

      <Button
        className="mt-[50px] self-start"
        onClick={() => console.log("clicked")}
      >
        add
      </Button>
    </div>
  );
};
