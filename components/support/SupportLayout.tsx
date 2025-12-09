"use client";

import { useState, useEffect, useCallback } from "react";
import SupportSidebar from "./SupportSidebar";
import SupportHeader from "./SupportHeader";
import SupportCommandPalette from "./SupportCommandPalette";

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Keyboard shortcut for command palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openCommand = useCallback(() => setIsCommandOpen(true), []);
  const closeCommand = useCallback(() => setIsCommandOpen(false), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <div className="flex min-h-dvh h-dvh flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
      <SupportSidebar onCommandOpen={openCommand} isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <SupportHeader onCommandOpen={openCommand} onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 pb-20 lg:pb-6 dashboard-scrollbar ios-scroll safe-right safe-bottom">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
      <SupportCommandPalette isOpen={isCommandOpen} onClose={closeCommand} />
    </div>
  );
}
