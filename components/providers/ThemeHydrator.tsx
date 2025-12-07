"use client";

import { useEffect } from "react";

export default function ThemeHydrator() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ok-theme");
      // Default to dark theme
      const theme = stored || "dark";

      // Apply theme without transition on initial load
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.setAttribute("data-theme", theme);
      if (!stored) localStorage.setItem("ok-theme", theme);
    } catch {
      // ignore - SSR or localStorage unavailable
    }
  }, []);

  return null;
}
