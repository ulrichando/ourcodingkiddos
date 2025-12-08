"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ChevronRight,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  HelpCircle,
  ChevronDown,
  Home,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/lib/logout";
import NotificationBell from "../notifications/NotificationBell";

type InstructorDashboardHeaderProps = {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
};

// Breadcrumb path mappings
const pathLabels: Record<string, string> = {
  instructor: "Dashboard",
  students: "My Students",
  availability: "Availability",
  content: "Course Content",
  "create-class": "Create Class",
  messages: "Messages",
  settings: "Settings",
};

export default function InstructorDashboardHeader({ onMenuToggle, isSidebarOpen }: InstructorDashboardHeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("ok-theme", newIsDark ? "dark" : "light");
  };

  // Generate breadcrumbs from pathname
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .slice(1) // Remove 'dashboard'
    .map((segment, index, arr) => {
      const href = "/dashboard/" + arr.slice(0, index + 1).join("/");
      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const isLast = index === arr.length - 1;
      return { segment, href, label, isLast };
    });

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "IN";

  return (
    <header
      className="flex-shrink-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Left: Menu Button + Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
            {breadcrumbs.map((crumb) => (
            <div key={crumb.href} className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              {crumb.isLast ? (
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {/* Help */}
          <Link
            href="/faq"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Help & FAQ"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>

          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          <div className="relative ml-2">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 pr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                {userInitials}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">
                      {session?.user?.name || "Instructor"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {session?.user?.email || "instructor@example.com"}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      href="/dashboard/instructor/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      Back to Home
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
