import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import type { NextComponentType } from "next";
import type AppProps from "next/app";

import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { Chain, optimism, mainnet } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import { OrbisProvider } from "context";
import LayoutApp from "@/components/Layout";

type NextAppProps<P = any> = AppProps & {
  pageProps: P;
  Component: NextComponentType & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
  };
} & Omit<AppProps<P>, "pageProps">;

export interface MyWalletOptions {
  chains: Chain[];
}

const { chains, publicClient } = configureChains(
  [optimism, mainnet],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => {
        return { http: chain.rpcUrls.default.http[0] };
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "PinSave",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
  chains,
});

function MyApp({ Component, pageProps }: NextAppProps) {
  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: 3,
          retryDelay: 10000,
          staleTime: Infinity,
        },
      },
    });
  }, []);

  const livepeerClient = useMemo(() => {
    return createReactClient({
      provider: studioProvider({
        apiKey: process.env.NEXT_PUBLIC_LIVEPEER,
      }),
    });
  }, []);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <MantineProvider
      theme={{
        colorScheme: "light",
        primaryColor: "green",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <NotificationsProvider>
            <RainbowKitProvider chains={chains}>
              <LivepeerConfig client={livepeerClient}>
                <OrbisProvider>
                  <LayoutApp>
                    <Component {...pageProps} />
                  </LayoutApp>
                </OrbisProvider>
              </LivepeerConfig>
            </RainbowKitProvider>
          </NotificationsProvider>
        </WagmiConfig>
      </QueryClientProvider>
      <Analytics />
    </MantineProvider>
  );
}

export default MyApp;
