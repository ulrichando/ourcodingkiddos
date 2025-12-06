"use client";

import { useEffect } from "react";

export default function ThemeHydrator() {
  useEffect(() => {
    const applyTheme = (theme: string) => {
      // Add transition class for smooth theme switching
      document.documentElement.classList.add("theme-transition");
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.setAttribute("data-theme", theme);

      // Remove transition class after animation completes
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 300);
    };

    try {
      const stored = localStorage.getItem("ok-theme");
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      const theme = stored || (prefersDark ? "dark" : "light");

      // Apply theme without transition on initial load
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.setAttribute("data-theme", theme);
      if (!stored) localStorage.setItem("ok-theme", theme);

      // Listen for system preference changes (when no stored preference)
      const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
      const handleSystemChange = (e: MediaQueryListEvent) => {
        const storedTheme = localStorage.getItem("ok-theme");
        // Only follow system if user hasn't explicitly chosen a theme
        if (!storedTheme) {
          const newTheme = e.matches ? "dark" : "light";
          applyTheme(newTheme);
        }
      };

      mediaQuery?.addEventListener("change", handleSystemChange);
      return () => mediaQuery?.removeEventListener("change", handleSystemChange);
    } catch {
      // ignore - SSR or localStorage unavailable
    }
  }, []);

  return null;
}
