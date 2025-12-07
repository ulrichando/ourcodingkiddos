"use client";

import ParentSidebar from "./ParentSidebar";
import ParentDashboardHeader from "./ParentDashboardHeader";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col lg:flex-row lg:overflow-hidden bg-slate-50 dark:bg-slate-950">
      <ParentSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ParentDashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pt-4 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
