"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Home, BookOpen, Calendar, MessageSquare, ChevronDown, Settings, Award, LogOut, Moon, Sun, Code2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import NotificationBell from "../notifications/NotificationBell";

export default function AppHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userName = session?.user?.name || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole =
    typeof (session?.user as any)?.role === "string" ? ((session?.user as any)?.role as string).toUpperCase() : "PARENT";
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAnimating, setMobileAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const showBell = userRole === "PARENT" || userRole === "STUDENT";
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Trigger animation when mobile menu opens
  useEffect(() => {
    if (mobileOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
      // Trigger animation after a brief delay
      requestAnimationFrame(() => {
        setMobileAnimating(true);
      });
    } else {
      document.body.style.overflow = "";
      setMobileAnimating(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ok-theme");
      const initial = stored === "dark" ? "dark" : "light";
      setTheme(initial as "light" | "dark");
      if (initial === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("ok-theme", next);
    } catch {
      // ignore
    }
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.setAttribute("data-theme", next);
  };

  const isLoggedIn = Boolean(session);

  const linkClass = (href: string) =>
    `inline-flex items-center gap-2 text-sm font-semibold ${
      pathname?.startsWith(href) ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
    } hover:text-slate-900 dark:hover:text-slate-100`;

  const dashboardHref =
    userRole === "STUDENT"
      ? "/dashboard/student"
      : userRole === "INSTRUCTOR"
        ? "/dashboard/instructor"
        : userRole === "ADMIN"
          ? "/dashboard/admin"
          : "/dashboard/parent";

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4 sm:gap-6 w-full">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
              CK
            </span>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Coding Kiddos</span>
          </Link>
        </div>

        {isLoggedIn ? (
          <>
            <nav className="header-nav hidden sm:flex flex-1 items-center justify-center gap-7">
                <Link href={dashboardHref} className={linkClass(dashboardHref)}>
                  <Home className="h-4 w-4 text-slate-500" />
                  Dashboard
                </Link>
                <Link href="/courses" className={linkClass("/courses")}>
                  <BookOpen className="h-4 w-4 text-slate-500" />
                  Courses
                </Link>
                <Link href="/schedule" className={linkClass("/schedule")}>
                  <Calendar className="h-4 w-4 text-slate-500" />
                  Schedule
                </Link>
                <Link href="/messages" className={linkClass("/messages")}>
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  Messages
                </Link>
            </nav>
            <div className="flex items-center ml-auto gap-2 relative" ref={menuRef}>
              <button
                className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle navigation"
              >
                {mobileOpen ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              {showBell && <NotificationBell userEmail={session?.user?.email || ""} />}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <span className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center shadow">
                  {userInitial}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  {userName}
                  <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-60 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{userName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{session?.user?.email}</p>
                  </div>
                <div className="border-t border-slate-100 dark:border-slate-700" />
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link href="/subscription" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <Award className="w-4 h-4" />
                  Subscription
                </Link>
                <div className="border-t border-slate-100 dark:border-slate-700" />
                <button
                  onClick={async () => {
                    setMenuOpen(false);
                    await signOut({ callbackUrl: "/auth/login" });
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <nav className="header-nav hidden sm:flex flex-1 items-center justify-center gap-7 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Link href="/courses" className="hover:text-slate-900 dark:hover:text-slate-100">
                Courses
              </Link>
              <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-slate-100">
                Pricing
              </Link>
              <Link href="/playground" className="hover:text-slate-900 dark:hover:text-slate-100">
                Playground
              </Link>
            </nav>
            <div className="flex items-center ml-auto gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle navigation"
              >
                {mobileOpen ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 shadow-md hover:brightness-105"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          {/* Backdrop with blur */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
              mobileAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out ${
              mobileAnimating ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow">
                    CK
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">Menu</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="px-5 py-4 space-y-1">
                  {isLoggedIn ? (
                    <>
                      {/* User info card */}
                      <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20 border border-purple-100 dark:border-purple-900/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center shadow-lg text-lg">
                            {userInitial}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{userName}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{session?.user?.email}</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50">
                          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 capitalize">{userRole.toLowerCase()}</span>
                        </div>
                      </div>

                      {/* Navigation section */}
                      <div className="space-y-1">
                        <p className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Navigation</p>
                        <Link
                          href={dashboardHref}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            pathname?.startsWith(dashboardHref)
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/25"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <Home className="w-5 h-5 flex-shrink-0" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/courses"
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            pathname?.startsWith("/courses")
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/25"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <BookOpen className="w-5 h-5 flex-shrink-0" />
                          <span>Courses</span>
                        </Link>
                        <Link
                          href="/schedule"
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            pathname?.startsWith("/schedule")
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/25"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <Calendar className="w-5 h-5 flex-shrink-0" />
                          <span>Schedule</span>
                        </Link>
                        <Link
                          href="/messages"
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            pathname?.startsWith("/messages")
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/25"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <MessageSquare className="w-5 h-5 flex-shrink-0" />
                          <span>Messages</span>
                        </Link>
                      </div>

                      {/* Account section */}
                      <div className="mt-6 space-y-1">
                        <p className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account</p>
                        <Link
                          href="/settings"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                        >
                          <Settings className="w-5 h-5 flex-shrink-0" />
                          <span>Settings</span>
                        </Link>
                        <Link
                          href="/subscription"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                        >
                          <Award className="w-5 h-5 flex-shrink-0" />
                          <span>Subscription</span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <Link
                          href="/courses"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                        >
                          <BookOpen className="w-5 h-5 flex-shrink-0" />
                          <span>Courses</span>
                        </Link>
                        <Link
                          href="/pricing"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                        >
                          <Award className="w-5 h-5 flex-shrink-0" />
                          <span>Pricing</span>
                        </Link>
                        <Link
                          href="/playground"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                        >
                          <Code2 className="w-5 h-5 flex-shrink-0" />
                          <span>Playground</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-4">
                {isLoggedIn ? (
                  <button
                    onClick={async () => {
                      setMobileOpen(false);
                      await signOut({ callbackUrl: "/auth/login" });
                    }}
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3.5 shadow-lg hover:brightness-105 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
