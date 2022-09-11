import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { useWallet } from "~/context/walletContext";
import { Button } from "~/components/buttons/button";
import { verifyLogin } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const signature = formData.get("signature") as string;
  const nonce = formData.get("nonce") as string;
  const walletAddress = formData.get("walletAddress") as string;

  if (!signature || !nonce || !walletAddress) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const user = await verifyLogin(walletAddress, signature, nonce);

  if (!user) {
    return json(
      {
        errors: { walletAddress: "Invalid walletAddress or signature" },
      },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: true,
    redirectTo: "/collection/new",
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const fetcher = useFetcher();

  const { account, signature, message, connectWallet, signMessage } =
    useWallet();

  const handleConnect = async () => {
    const provider = await connectWallet();
    if (!provider) {
      return;
    }

    await signMessage();

    setTimeout(() => {
      const formData = new FormData();
      formData.append("walletAddress", account);
      formData.append("signature", signature);
      formData.append("nonce", message);

      fetcher.submit(formData);
    }, 100);
  };

  return (
    <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center">
      <fetcher.Form method="post" className="space-y-6">
        <Button type="submit" onClick={handleConnect}>
          Connect
        </Button>
      </fetcher.Form>
    </main>
  );
}
