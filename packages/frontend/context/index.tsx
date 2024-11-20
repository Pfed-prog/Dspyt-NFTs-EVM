import {
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
  useMemo,
} from "react";
import { Orbis } from "@orbisclub/orbis-sdk";
import { useAccount } from "wagmi";

type OrbisContextType = {
  orbis: IOrbis;
};

export const OrbisContext = createContext<OrbisContextType | undefined>(
  undefined
);

export const OrbisProvider = ({ children }: PropsWithChildren<{}>) => {
  const { address: senderAddress } = useAccount();
  const orbis: IOrbis = new Orbis();

  const orbisProviderValue = useMemo(() => ({ orbis }), [orbis]);

  useEffect(() => {
    async function connectOrbis() {
      await orbis.connect_v2({ chain: "ethereum", lit: false });
    }
    if (senderAddress) {
      connectOrbis();
    }
  }, [senderAddress]);

  return (
    <OrbisContext.Provider value={orbisProviderValue}>
      {children}
    </OrbisContext.Provider>
  );
};

export const useOrbisContext = () => {
  const context = useContext(OrbisContext);
  if (!context) {
    throw new Error("OrbisContext must be used inside the OrbisProvider");
  }
  return context;
};
