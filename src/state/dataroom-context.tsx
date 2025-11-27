import { createContext } from "react";
import type { AppState, Action } from "./dataroom-types";
import type { Dispatch } from "react";

export interface DataroomContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
}

export const DataroomContext = createContext<DataroomContextValue | undefined>(
  undefined
);