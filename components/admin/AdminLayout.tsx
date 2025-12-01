"use client";

import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <AdminSidebar />
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-16 lg:pt-8 lg:p-8"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          willChange: "scroll-position",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }}
      >
        {children}
      </main>
    </div>
  );
}
