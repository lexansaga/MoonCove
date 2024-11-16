// Settings.store.ts
import { create } from "zustand";

// Define the state type for TypeScript
interface SettingsState {
  timer: string;
  volume: boolean;
  timeUnix: number;
  setProductivityTimer: (newTimer: string) => void;
  toggleVolume: () => void;
  setTimeUnix: (newTimeUnix: number) => void;
}

// Create the store with type safety
const useSettings = create<SettingsState>((set) => ({
  timer: "-- : -- : --", // Initial timer value
  volume: true, // Initial volume state (true for 'on', false for 'off')
  timeUnix: 0,
  setProductivityTimer: (newTimer: string) => set({ timer: newTimer }),
  toggleVolume: () => set((state) => ({ volume: !state.volume })),
  setTimeUnix: (newTimeUnix: number) => set({ timeUnix: newTimeUnix }),
}));

export default useSettings;
