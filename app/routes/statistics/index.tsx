import { useState } from "react";
import image1 from "~/images/Rectangle_0.png";

// API
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserId } from "~/session.server";

// components
import { AchievementStatisticContainer } from "~/features/achievementStatistic/containers/achievementStatisticContainer";
import { FeedContainer } from "~/features/feed/containers/feedContainer";
import { Button, OutlineButton } from "~/components/buttons";
import { clsx } from "clsx";

type ActiveTab = "feed" | "achievementStatistic";

type LoaderData = {
  achievements: Array<any>;
  feed: Array<any>;
};

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");

  // TODO: change to the graph API:
  const mockAchievements = new Array(4).fill(null).map((_) => ({
    image: image1,
    title: "reward for the article",
    count: 4,
    tallyId: "xDbnaw",
  }));

  return json({ achievements: mockAchievements, feed: [] });
}

const Statistics = () => {
  const { achievements, feed } = useLoaderData<LoaderData>();

  const [activeTab, setActiveTab] = useState<ActiveTab>("achievementStatistic");

  return (
    <main className="mx-auto mt-[50px] flex w-[min(640px,100%)] flex-col items-center gap-[50px] px-5 pb-5">
      <div className="flex gap-5">
        <OutlineButton
          className={clsx({
            "!border-pink-600 hover:!border-pink-800":
              activeTab === "achievementStatistic",
          })}
          onClick={() => setActiveTab("achievementStatistic")}
        >
          achievement
        </OutlineButton>

        <OutlineButton
          className={clsx({
            "!border-pink-600 hover:!border-pink-800": activeTab === "feed",
          })}
          onClick={() => setActiveTab("feed")}
        >
          feed
        </OutlineButton>
      </div>

      {activeTab === "achievementStatistic" ? (
        <AchievementStatisticContainer achievements={achievements} />
      ) : null}

      {activeTab === "feed" ? <FeedContainer feed={feed} /> : null}
    </main>
  );
};

export default Statistics;
