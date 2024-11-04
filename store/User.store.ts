// store/UserStore.ts
import { create } from "zustand";

// Define the type for the user state
interface UserState {
  id: string;
  name: string;
  username: string;
  email: string;
  gender: string;
  password: string;
  profile: string;
  bio: string;
  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
}

// Create the Zustand store
const useUser = create<UserState>((set) => ({
  id: "",
  name: "",
  gender: "",
  username: "",
  email: "",
  password: "",
  profile: "",
  bio: "",
  setUser: (user) => set((state) => ({ ...state, ...user })),
  clearUser: () =>
    set({
      id: "",
      name: "",
      username: "",
      gender: "",
      email: "",
      password: "",
      profile: "",
      bio: "",
    }),
}));

export default useUser;
