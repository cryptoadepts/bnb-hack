import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useNavigate } from "@remix-run/react";
import * as React from "react";

import { createUserSession } from "~/session.server";
import { useWallet } from "~/context/walletContext";
import { Button } from "~/components/buttons/button";
import { verifyLogin } from "~/models/user.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const walletAddress = formData.get("walletAddress") as string;
  console.log("walletAddress", walletAddress);

  if (!walletAddress) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const user = await verifyLogin(walletAddress);

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
  const navigate = useNavigate();

  const { account, connectWallet, signMessage } = useWallet();

  const handleConnect = async () => {
    const provider = await connectWallet();
    if (!provider) {
      return;
    }

    await signMessage();

    setTimeout(() => {
      const formData = new FormData();
      formData.append("walletAddress", account);

      fetcher.submit(formData, { method: "post" });

      navigate("/collection/new");
    }, 1000);
  };

  return (
    <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center">
      <Button type="submit" onClick={handleConnect}>
        Connect
      </Button>
    </main>
  );
}
