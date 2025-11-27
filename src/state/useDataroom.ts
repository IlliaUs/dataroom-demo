import { useContext } from "react";
import { DataroomContext } from "./dataroom-context";

export function useDataroom() {
  const ctx = useContext(DataroomContext);
  if (!ctx) {
    throw new Error("useDataroom must be used within a DataroomProvider");
  }
  return ctx;
}