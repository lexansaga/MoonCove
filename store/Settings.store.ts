// Settings.store.ts
import { create } from "zustand";

// Define the state type for TypeScript
interface SettingsState {
  timer: string;
  volume: boolean;
  setProductivityTimer: (newTimer: string) => void;
  toggleVolume: () => void;
}

// Create the store with type safety
const useSettings = create<SettingsState>((set) => ({
  timer: "-- : -- : --", // Initial timer value
  volume: true, // Initial volume state (true for 'on', false for 'off')
  setProductivityTimer: (newTimer: string) => set({ timer: newTimer }),
  toggleVolume: () =>
    set((state: SettingsState) => ({ volume: !state.volume })),
}));

export default useSettings;
