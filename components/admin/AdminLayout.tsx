"use client";

import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "./AdminSidebar";
import DashboardHeader from "./DashboardHeader";
import CommandPalette from "./CommandPalette";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    <div className="flex h-dvh flex-col lg:flex-row lg:overflow-hidden bg-slate-50 dark:bg-slate-950">
      <AdminSidebar onCommandOpen={openCommand} isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader onCommandOpen={openCommand} onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pt-4 lg:pt-6 admin-scrollbar ios-scroll safe-right">
          {children}
        </main>
      </div>
      <CommandPalette isOpen={isCommandOpen} onClose={closeCommand} />
    </div>
  );
}
