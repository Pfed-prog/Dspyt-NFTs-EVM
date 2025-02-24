import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import type { NextComponentType } from "next";
import type AppProps from "next/app";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Chain, optimism } from "wagmi/chains";

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

const config = getDefaultConfig({
  appName: "PinSaveOptimism",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
  chains: [optimism],
  ssr: true,
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

  return (
    <MantineProvider
      theme={{
        colorScheme: "light",
        primaryColor: "green",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <NotificationsProvider>
            <RainbowKitProvider>
              <LayoutApp>
                <Component {...pageProps} />
              </LayoutApp>
            </RainbowKitProvider>
          </NotificationsProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default MyApp;
