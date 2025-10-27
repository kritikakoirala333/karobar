import { create } from "zustand";

export const themeBase = create((set) => ({
  theme: "dark",

  setTheme: (theme) => set({ theme: theme }),
  
}));
