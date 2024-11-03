// store.ts
import { create } from "zustand";

// Define the state type for TypeScript
interface TimerState {
  timer: string;
  setTimer: (newTimer: string) => void;
}

// Create the store with type safety
const useTimer = create<TimerState>((set: any) => ({
  timer: "-- : -- : --", // Initial timer value
  setTimer: (newTimer: string) => set({ timer: newTimer }),
}));

export default useTimer;
