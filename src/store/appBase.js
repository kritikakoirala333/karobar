import { create } from "zustand";

export const appBase = create((set) => ({
  user: null,
  theme: "dark",
  isLoading: false,

  setTheme: (theme) => set({ theme: theme }),
  setLoading: () => set((state) => (isLoading = !state.isLoading)),
}));
