"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Home, BookOpen, Calendar, MessageSquare, ChevronDown, Settings, Award, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

export default function AppHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userName = session?.user?.name || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole =
    typeof (session?.user as any)?.role === "string" ? ((session?.user as any)?.role as string).toUpperCase() : "PARENT";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isLoggedIn = Boolean(session);

  const linkClass = (href: string) =>
    `inline-flex items-center gap-2 text-sm font-semibold ${
      pathname?.startsWith(href) ? "text-slate-900" : "text-slate-700"
    } hover:text-slate-900`;

  const dashboardHref =
    userRole === "STUDENT"
      ? "/dashboard/student"
      : userRole === "INSTRUCTOR"
        ? "/dashboard/instructor"
        : userRole === "ADMIN"
          ? "/dashboard/admin"
          : "/dashboard/parent";

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
            CK
          </span>
          <span className="text-lg font-semibold text-slate-900">Coding Kiddos</span>
        </Link>

        {isLoggedIn ? (
          <>
            <nav className="flex-1 flex items-center justify-center gap-7">
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
            <div className="flex items-center ml-auto relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-100 transition"
              >
                <span className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center shadow">
                  {userInitial}
                </span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                  {userName}
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-60 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{userName}</p>
                    <p className="text-sm text-slate-500">{session?.user?.email}</p>
                  </div>
                <div className="border-t border-slate-100" />
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link href="/subscription" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50">
                  <Award className="w-4 h-4" />
                  Subscription
                </Link>
                <div className="border-t border-slate-100" />
                <button
                  onClick={async () => {
                    setMenuOpen(false);
                    await signOut({ callbackUrl: "/auth/login" });
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
            <nav className="flex-1 flex items-center justify-center gap-7 text-sm font-semibold text-slate-700">
              <Link href="/courses" className="hover:text-slate-900">
                Courses
              </Link>
              <Link href="/pricing" className="hover:text-slate-900">
                Pricing
              </Link>
              <Link href="/playground" className="hover:text-slate-900">
                Playground
              </Link>
            </nav>
            <div className="flex items-center ml-auto">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 shadow-md hover:brightness-105"
              >
                Go to Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
