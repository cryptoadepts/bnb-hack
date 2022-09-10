import { useWallet } from "~/context/walletContext";

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
