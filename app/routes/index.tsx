import { useWallet } from "~/context/walletContext";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/collection/new");
  return json({});
}

export default function Index() {
  const { connectWallet, signMessage } = useWallet();

  const handlerConnect = async () => {
    const provider = await connectWallet();
    if (!provider) {
      return;
    }

    await signMessage();
  };

  return (
    <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center">
      <button onClick={handlerConnect}>Try out</button>
    </main>
  );
}
