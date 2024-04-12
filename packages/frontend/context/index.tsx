import { useEffect, createContext, useContext, PropsWithChildren } from "react";
import { Orbis } from "@orbisclub/orbis-sdk";

type OrbisContextType = {
  orbis: IOrbis;
};

export const OrbisContext = createContext<OrbisContextType | undefined>(
  undefined
);

export const OrbisProvider = ({ children }: PropsWithChildren<{}>) => {
  const orbis: IOrbis = new Orbis();
  useEffect(() => {
    async function connectOrbis() {
      await orbis.connect_v2({ chain: "ethereum" });
    }
    connectOrbis();
  }, []);
  return (
    <OrbisContext.Provider value={{ orbis }}>{children}</OrbisContext.Provider>
  );
};

export const useOrbisContext = () => {
  const context = useContext(OrbisContext);
  if (!context) {
    throw new Error("OrbisContext must be used inside the OrbisProvider");
  }
  return context;
};
