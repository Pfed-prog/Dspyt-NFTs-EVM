export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PINATA_JWT: string;
      NEXT_PUBLIC_GATEWAY_URL: string;
      NEXT_PUBLIC_ALCHEMY_ID: string;
      NEXT_APP_CLIENT_ID: string;
      NEXT_PUBLIC_WALLETCONNECT_ID: string;
      ENV: "test" | "dev" | "prod";
    }
  }
}
