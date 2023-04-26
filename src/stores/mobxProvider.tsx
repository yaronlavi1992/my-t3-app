import { Provider } from "mobx-react";
import { createContext, ReactNode } from "react";
import { BuildingStore } from "./stores";

interface Stores {
  buildingStore: BuildingStore;
}

interface MobXProviderProps {
  children: ReactNode;
}

const stores: Stores = {
  buildingStore: new BuildingStore(),
}

export const MobXContext = createContext(stores);

export default function MobXProvider({ children }: MobXProviderProps) {

  return (
    <MobXContext.Provider value={stores}>
      <Provider {...stores}>{children}</Provider>
    </MobXContext.Provider>
  );
}