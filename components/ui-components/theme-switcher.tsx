"use client";

import React, { useState } from "react";
import { useTheme, THEME_COLORS, ThemeColor } from "../../context/ThemeContext";

const COLOR_KEYS = Object.keys(THEME_COLORS) as ThemeColor[];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
      {/* Expanded palette */}
      {open && (
        <div className="flex flex-col items-center gap-2 bg-white/90 backdrop-blur-md border border-neutral-200 rounded-2xl p-3 shadow-xl mb-1">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1">
            Theme
          </p>
          {COLOR_KEYS.map((key) => {
            const { hex, label } = THEME_COLORS[key];
            const isActive = theme === key;
            return (
              <button
                key={key}
                onClick={() => { setTheme(key); setOpen(false); }}
                title={label}
                aria-label={`Switch to ${label} theme`}
                className="group flex items-center gap-2 w-full rounded-xl px-2 py-1.5 transition-all hover:bg-neutral-100"
              >
                {/* Colour swatch circle */}
                <span
                  className="w-6 h-6 rounded-full flex-shrink-0 border-2 transition-all"
                  style={{
                    backgroundColor: hex,
                    borderColor: isActive ? hex : "transparent",
                    boxShadow: isActive ? `0 0 0 2px white, 0 0 0 4px ${hex}` : "none",
                  }}
                />
                {/* Label */}
                <span
                  className="text-xs font-semibold"
                  style={{ color: isActive ? hex : "#6b7280" }}
                >
                  {label}
                </span>
                {/* Active tick */}
                {isActive && (
                  <svg className="w-3.5 h-3.5 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: hex }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Toggle button — shows current theme colour */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme colour"
        title="Change theme colour"
        className="w-11 h-11 rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-transform active:scale-90"
        style={{ backgroundColor: THEME_COLORS[theme].hex }}
      >
        {/* Palette icon */}
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1 0-.27-.1-.51-.26-.71-.16-.2-.25-.45-.25-.71 0-.55.45-1 1-1h1.18c1.94 0 3.5-1.56 3.5-3.5 0-3.86-3.58-7.08-8.17-7.08zM6.5 11c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5S18.33 11 17.5 11z"/>
        </svg>
      </button>
    </div>
  );
}
