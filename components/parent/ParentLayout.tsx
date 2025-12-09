"use client";

import { useState, useCallback } from "react";
import ParentSidebar from "./ParentSidebar";
import ParentDashboardHeader from "./ParentDashboardHeader";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <div className="flex min-h-dvh h-dvh flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
      <ParentSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ParentDashboardHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 pb-20 lg:pb-6 dashboard-scrollbar ios-scroll safe-right safe-bottom">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
