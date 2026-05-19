"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = 
      localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    }
  };

  if (!mounted) {
    return <div className="h-10 w-full bg-muted/20 animate-pulse rounded-xl" />;
  }

  return (
    <div className="w-full bg-muted/40 border border-border rounded-xl p-1 flex items-center relative select-none">
      {/* Background sliding capsule pill */}
      <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-card border border-border rounded-lg shadow-sm transition-transform duration-300 ease-out ${
          darkMode ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
        }`}
      />

      {/* Light Option Button */}
      <button
        onClick={() => setTheme(false)}
        className={`flex-1 z-10 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors duration-200 ${
          !darkMode ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sun size={15} className={!darkMode ? "text-amber-500" : ""} />
        <span>Light</span>
      </button>

      {/* Dark Option Button */}
      <button
        onClick={() => setTheme(true)}
        className={`flex-1 z-10 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors duration-200 ${
          darkMode ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Moon size={15} className={darkMode ? "text-blue-400" : ""} />
        <span>Dark</span>
      </button>
    </div>
  );
}
