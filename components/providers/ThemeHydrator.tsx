"use client";

import { useEffect } from "react";

export default function ThemeHydrator() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ok-theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = stored || (prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.setAttribute("data-theme", theme);
      if (!stored) localStorage.setItem("ok-theme", theme);
    } catch {
      // ignore
    }
  }, []);

  return null;
}
