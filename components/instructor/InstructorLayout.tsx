"use client";

import { useState, useCallback, useEffect } from "react";
import InstructorSidebar from "./InstructorSidebar";
import InstructorDashboardHeader from "./InstructorDashboardHeader";
import InstructorCommandPalette from "./InstructorCommandPalette";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const openCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);

  // Global Cmd+K handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-dvh h-dvh flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
      <InstructorSidebar isOpen={isSidebarOpen} onClose={closeSidebar} onCommandOpen={openCommandPalette} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InstructorDashboardHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 pb-20 lg:pb-6 dashboard-scrollbar ios-scroll safe-right safe-bottom">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
      <InstructorCommandPalette isOpen={isCommandPaletteOpen} onClose={closeCommandPalette} />
    </div>
  );
}
