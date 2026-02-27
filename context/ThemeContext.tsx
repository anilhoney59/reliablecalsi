"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeColor = "orange" | "blue" | "red" | "green" | "purple" | "black";

export const THEME_COLORS: Record<ThemeColor, { label: string; hex: string; hover: string; ring: string; swatch: string }> = {
  orange: { label: "Orange",  hex: "#FF5722", hover: "#e64a19", ring: "rgba(255,87,34,0.3)",  swatch: "bg-[#FF5722]" },
  blue:   { label: "Blue",    hex: "#1877F2", hover: "#1565c0", ring: "rgba(24,119,242,0.3)", swatch: "bg-[#1877F2]" },
  red:    { label: "Red",     hex: "#E53935", hover: "#c62828", ring: "rgba(229,57,53,0.3)",  swatch: "bg-[#E53935]" },
  green:  { label: "Green",   hex: "#2E7D32", hover: "#1b5e20", ring: "rgba(46,125,50,0.3)",  swatch: "bg-[#2E7D32]" },
  purple: { label: "Purple",  hex: "#7B1FA2", hover: "#6a1b9a", ring: "rgba(123,31,162,0.3)", swatch: "bg-[#7B1FA2]" },
  black:  { label: "Black",   hex: "#212121", hover: "#000000", ring: "rgba(33,33,33,0.3)",   swatch: "bg-[#212121]" },
};

const STORAGE_KEY = "rd-theme-color";

interface ThemeContextValue {
  theme: ThemeColor;
  setTheme: (t: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "orange",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeColor>("orange");

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeColor | null;
    if (saved && THEME_COLORS[saved]) {
      setThemeState(saved);
      applyTheme(saved);
    } else {
      applyTheme("orange");
    }
  }, []);

  const setTheme = (t: ThemeColor) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    applyTheme(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function applyTheme(t: ThemeColor) {
  const { hex, hover, ring } = THEME_COLORS[t];
  const root = document.documentElement;
  root.style.setProperty("--color-primary", hex);
  root.style.setProperty("--color-primary-hover", hover);
  root.style.setProperty("--color-primary-ring", ring);
}

export function useTheme() {
  return useContext(ThemeContext);
}
