import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ethers } from "ethers";
import type {
  TransactionResponse,
  Web3Provider,
} from "@ethersproject/providers";
import { toHex } from "~/utils/str_num";
import { nanoid } from "nanoid";
import type { Deferrable } from "@ethersproject/properties";
import type { TransactionRequest } from "@ethersproject/abstract-provider";

const getReadableNonce = () => `Log in to bnb-hack. Nonce ${nanoid()}`;

type WalletEventsSubscriber = (
  eventName: string,
  cb: (arg: any) => void
) => void;
type WalletContextType = {
  account: string;
  message: string;
  signature: string;
  connectWallet: () => Promise<Web3Provider | undefined>;
  signMessage: () => Promise<void>;
  sendTransaction: (
    tx: Deferrable<TransactionRequest>
  ) => Promise<TransactionResponse | undefined>;
  refreshState: () => void;
};

const WalletContext = createContext<WalletContextType>({
  account: "",
  message: "",
  signature: "",
  connectWallet: async () => undefined,
  signMessage: async () => undefined,
  sendTransaction: async () => undefined,
  refreshState: () => undefined,
});

export const useWallet = () => {
  const walletContext = useContext(WalletContext);

  if (!walletContext)
    throw new Error("`useWallet` can not be used outside `WalletContext`");

  return walletContext;
};

type Props = {
  children?: React.ReactNode;
};

export const WalletProvider: React.FC<Props> = ({ children }) => {
  const [web3Provider, setWeb3Provider] = useState<Web3Provider>();
  const [account, setAccount] = useState<string>();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<Error | string>("");
  const [chainId, setChainId] = useState<number>();
  const [network, setNetwork] = useState<number | string>();
  const [message, setMessage] = useState<string>(getReadableNonce());
  const [signedMessage, setSignedMessage] = useState<string>("");
  const [verified, setVerified] = useState<boolean>();

  const signMessage = useCallback(async () => {
    if (!web3Provider) return;
    try {
      const signature = await web3Provider?.provider.request?.({
        method: "personal_sign",
        params: [message, account],
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error: any) {
      setError(error);
    }
  }, [web3Provider, message, account]);

  const sendTransaction = useCallback(
    async (tx: Deferrable<TransactionRequest>) => {
      if (!web3Provider) return;
      try {
        const signer = web3Provider.getSigner();
        return await signer.sendTransaction({});
      } catch (error: any) {
        setError(error);
      }
    },
    [web3Provider]
  );

  const handleNetwork = (e: any) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e: any) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    try {
      await web3Provider?.provider.request?.({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await web3Provider?.provider.request?.({
            method: "wallet_addEthereumChain",
            // @ts-ignore
            params: [networkParams[toHex(network)]],
          });
        } catch (error: any) {
          setError(error);
        }
      }
    }
  };

  const refreshState = () => {
    setAccount("");
    setChainId(-1);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = async () => {
    refreshState();
  };

  const connectWallet = async () => {
    localStorage.setItem("walletType", "metamask");

    const web3Provider = new ethers.providers.Web3Provider(
      window.ethereum as any,
      { chainId: 97, name: "bsc-testnet" }
    );
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const chainId = Number(Number(window?.ethereum?.chainId));

    setWeb3Provider(web3Provider);
    setChainId(chainId);
    setAccount(accounts[0]);

    return web3Provider;
  };

  useEffect(() => {
    const item = localStorage.getItem("walletType");

    if (item === "metamask") {
      connectWallet();
    }
  }, []);

  // Wallet events
  useEffect(() => {
    if (
      web3Provider?.provider &&
      "on" in web3Provider.provider &&
      "removeListener" in web3Provider.provider
    ) {
      // @ts-expect-error
      const subscribe = web3Provider.provider.on.bind(
        web3Provider.provider
      ) as WalletEventsSubscriber;

      // https://eips.ethereum.org/EIPS/eip-1193#events
      const subscribersByEvent = {
        // Subscribe to connecting, disconnecting and changing accounts
        accountsChanged: (accounts: string[]) => {
          setAccount(accounts[0]?.toLowerCase());
        },
        // Subscribe to chainId change
        chainChanged: (chainId: number | string) => {
          setChainId(Number(chainId));
        },
        // Subscribe to provider connection (this in NOT account connection)
        connect: (info?: { chainId: number | string }) => {
          if (!info) return;

          setChainId(Number(info.chainId));
        },
        // Subscribe to provider disconnection (this in NOT account disconnection)
        disconnect: (error: { code: number; message: string }) => {
          console.log("disconnect", error);
        },
      };

      Object.entries(subscribersByEvent).forEach(([eventName, subscriber]) => {
        subscribe(eventName, subscriber);
      });

      return () => {
        // @ts-ignore
        const unsubscribe = web3Provider.provider.removeListener.bind(
          web3Provider.provider
        ) as WalletEventsSubscriber;

        Object.entries(subscribersByEvent).forEach(
          ([eventName, subscriber]) => {
            unsubscribe(eventName, subscriber);
          }
        );
      };
    }

    return () => {};
  }, [web3Provider?.provider]);

  const contextValue = useMemo(
    () => ({
      signature,
      message,
      account,
      connectWallet,
      signMessage,
      refreshState,
      sendTransaction,
    }),
    [sendTransaction, signMessage, signature, message, account]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
