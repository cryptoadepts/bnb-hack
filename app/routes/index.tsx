import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserId } from "~/session.server";
import { clsx } from "clsx";
import background from "~/images/background.png";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);

  return json({ userId });
}

export default function Index() {
  const data = useLoaderData<{ userId: string }>();

  const to = data.userId ? "/collection/new" : "/login";

  return (
    <main
      className={clsx(
        "relative flex min-h-screen min-w-[1000px] flex-col items-center justify-start overflow-hidden px-7"
      )}
    >
      <img
        src={background}
        style={{ animationDuration: "60s" }}
        width={2400}
        height={2400}
        className="absolute -bottom-[-50%] z-10 animate-spin"
        alt="background"
      />
      <h1 className="z-10 text-center text-[130px] font-bold leading-[110%]">
        create your own collection of nfts for users
      </h1>
      <Link
        to={to}
        className="z-10 mt-[100px] rounded-full bg-[#FF0099] py-5 px-12 text-[100px] font-bold leading-[110%]"
      >
        try now →
      </Link>{" "}
    </main>
  );
}
