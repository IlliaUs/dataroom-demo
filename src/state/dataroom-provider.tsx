import { useEffect, useReducer, type ReactNode } from "react";

import { dataroomReducer, initialState } from "./dataroom-reducer";
import { DataroomContext } from "./dataroom-context";
import type { AppState } from "./dataroom-types";
import { loadAppState, saveAppState } from "@/lib/stateStorage";

interface DataroomProviderProps {
  children: ReactNode;
}

function initAppState(baseState: AppState): AppState {
  const fromStorage = loadAppState();
  if (fromStorage) {
    return fromStorage;
  }
  return baseState;
}

export function DataroomProvider({ children }: DataroomProviderProps) {
  const [state, dispatch] = useReducer(
    dataroomReducer,
    initialState,
    initAppState
  );

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  return (
    <DataroomContext.Provider value={{ state, dispatch }}>
      {children}
    </DataroomContext.Provider>
  );
}
