// store/ProductivityStore.ts
import { create } from "zustand";

// Define the type for a task within a session
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

// Define the type for a productivity session
interface ProductivitySession {
  id: string;
  title: string;
  tasks: Task[];
}

// Define the type for the productivity state
interface ProductivityDateSessions {
  [date: string]: ProductivitySession[];
}

interface ProductivityState {
  userId: string;
  selectedDate: string;
  sessions: ProductivityDateSessions;
  setSelectedDate: (date: string) => void;
  setProductivity: (
    userId: string,
    date: string,
    sessions: ProductivitySession[]
  ) => void;
  addSession: (
    userId: string,
    date: string,
    session: ProductivitySession
  ) => void;
  clearProductivity: () => void;
}

// Create the Zustand store
const useProductivity = create<ProductivityState>((set) => ({
  userId: "",
  selectedDate: "",
  sessions: {},
  setSelectedDate: (date) =>
    set((state) => ({
      ...state,
      selectedDate: date,
    })),
  setProductivity: (userId, date, sessions) =>
    set((state) => ({
      userId,
      sessions: {
        ...state.sessions,
        [date]: sessions,
      },
    })),
  addSession: (userId, date, session) =>
    set((state) => ({
      userId,
      sessions: {
        ...state.sessions,
        [date]: state.sessions[date]
          ? [...state.sessions[date], session]
          : [session],
      },
    })),
  clearProductivity: () => ({
    userId: "",
    selectedDate: "",
    sessions: {},
  }),
}));

export default useProductivity;
