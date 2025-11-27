import type { AppState } from "@/state/dataroom-types";

const STORAGE_KEY = "dataroom-state-v1";

export function loadAppState(): AppState | null {
  if (typeof window === "undefined") return null; 

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AppState;

    if (!parsed.data || !parsed.ui) return null;

    return parsed;
  } catch (e) {
    console.error("Failed to load app state from localStorage", e);
    return null;
  }
}

export function saveAppState(state: AppState) {
  if (typeof window === "undefined") return;

  try {
    const stateToPersist: AppState = {
      ...state,
      data: {
        ...state.data,
        files: {},
      },
    };

    const raw = JSON.stringify(stateToPersist);
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch (e) {
    console.error("Failed to save app state to localStorage", e);
  }
}
