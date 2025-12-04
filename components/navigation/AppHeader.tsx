"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { Home } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Calendar } from "lucide-react";
import { Settings } from "lucide-react";
import { LogOut } from "lucide-react";
import { Moon } from "lucide-react";
import { Sun } from "lucide-react";
import { Code2 } from "lucide-react";
import { X } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { Newspaper } from "lucide-react";
import { Rocket } from "lucide-react";
import { BookMarked } from "lucide-react";
import { Search } from "lucide-react";
import { Command } from "lucide-react";
import { Zap } from "lucide-react";
import { Menu } from "lucide-react";
import { logout } from "../../lib/logout";
import NotificationBell from "../notifications/NotificationBell";

// Navigation configuration
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home, keywords: ["home", "main"], shortcut: "D", description: "Your personal hub" },
  { href: "/curriculum", label: "Curriculum", icon: BookMarked, keywords: ["learn", "lessons", "syllabus"], shortcut: "C", description: "Structured learning paths", badge: "New" },
  { href: "/courses", label: "Courses", icon: BookOpen, keywords: ["learn", "classes", "study"], shortcut: "O", description: "Browse all courses" },
  { href: "/playground", label: "Playground", icon: Code2, keywords: ["code", "practice", "sandbox", "editor"], shortcut: "P", description: "Write and run code", badge: "Popular" },
  { href: "/programs", label: "Programs", icon: GraduationCap, keywords: ["enroll", "join", "classes"], shortcut: "R", description: "Enroll in programs" },
  { href: "/showcase", label: "Showcase", icon: Rocket, keywords: ["projects", "students", "work", "gallery"], shortcut: "S", description: "Student projects gallery" },
  { href: "/blog", label: "Blog", icon: Newspaper, keywords: ["news", "articles", "posts"], shortcut: "B", description: "News and articles" },
  { href: "/schedule", label: "Schedule", icon: Calendar, keywords: ["calendar", "events", "dates", "sessions"], shortcut: "E", description: "View upcoming sessions" },
  { href: "/settings", label: "Settings", icon: Settings, keywords: ["account", "profile", "preferences"], shortcut: ",", description: "Manage your account" },
];

export default function AppHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const userName = session?.user?.name || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole = typeof (session?.user as any)?.role === "string"
    ? ((session?.user as any)?.role as string).toUpperCase()
    : "PARENT";
  const showBell = ["PARENT", "STUDENT", "INSTRUCTOR", "ADMIN"].includes(userRole);

  const dashboardHref = userRole === "STUDENT" ? "/dashboard/student"
    : userRole === "INSTRUCTOR" ? "/dashboard/instructor"
    : userRole === "ADMIN" ? "/dashboard/admin"
    : "/dashboard/parent";

  // Filter items based on search
  const filteredItems = navItems.filter(item => {
    const query = searchQuery.toLowerCase();
    return item.label.toLowerCase().includes(query) ||
      item.keywords.some(k => k.includes(query));
  }).map(item => ({
    ...item,
    href: item.href === "/dashboard" ? dashboardHref : item.href
  }));

  // Command palette keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
        setSearchQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus search input when command palette opens
  useEffect(() => {
    if (commandOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [commandOpen]);

  // Command palette navigation
  const handleCommandKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      router.push(filteredItems[selectedIndex].href);
      setCommandOpen(false);
    }
  }, [filteredItems, selectedIndex, router]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Click outside handlers
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (commandRef.current && !commandRef.current.contains(e.target as Node)) {
        setCommandOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen || commandOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, commandOpen]);

  const isActive = (href: string) => pathname?.startsWith(href);

  // Use session status to determine login state (avoids hydration mismatch)
  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
              CK
            </span>
            <span className="hidden sm:block font-semibold text-slate-900 dark:text-white">
              Coding Kiddos
            </span>
          </Link>

          {/* Center: Search Trigger */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden md:flex items-center gap-3 h-10 w-72 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Search className="h-5 w-5" />
            <span className="flex-1 text-left text-sm">Search...</span>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-[11px] font-medium">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Mobile search */}
            <button
              onClick={() => setCommandOpen(true)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme toggle - uses suppressHydrationWarning */}
            <button
              onClick={() => {
                const isDark = document.documentElement.classList.contains("dark");
                document.documentElement.classList.toggle("dark", !isDark);
                try { localStorage.setItem("ok-theme", isDark ? "light" : "dark"); } catch {}
              }}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
              <Sun className="h-5 w-5 hidden dark:block" />
              <Moon className="h-5 w-5 block dark:hidden" />
            </button>

            {/* Auth section */}
            {isLoading ? (
              <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : isLoggedIn ? (
              <>
                {showBell && (
                  <div className="hidden sm:block">
                    <NotificationBell userEmail={session?.user?.email || ""} />
                  </div>
                )}

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(o => !o)}
                    className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className="h-7 w-7 rounded-md bg-violet-600 text-white text-xs font-bold flex items-center justify-center">
                      {userInitial}
                    </span>
                    <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[80px] truncate">
                      {userName}
                    </span>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden">
                      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-medium text-slate-900 dark:text-white truncate">{userName}</p>
                        <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                          {userRole.toLowerCase()}
                        </span>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/settings"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </div>
                      <div className="p-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={async () => { setMenuOpen(false); await logout(); }}
                          className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
              >
                <Zap className="h-4 w-4" />
                Get Started
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="sm:hidden h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      {commandOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
          />
          <div className="relative flex items-start justify-center pt-[15vh] px-4">
            <div
              ref={commandRef}
              className="w-full max-w-lg"
              onKeyDown={handleCommandKeyDown}
            >
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
                  <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 h-12 px-3 bg-transparent text-base text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:outline-none focus:ring-0 border-none"
                  />
                  <kbd className="hidden sm:flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-400">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto">
                  {filteredItems.length === 0 ? (
                    <div className="py-10 text-center">
                      <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No results found</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {filteredItems.map((item, index) => {
                        const Icon = item.icon;
                        const selected = index === selectedIndex;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setCommandOpen(false)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-colors ${
                              selected
                                ? "bg-slate-100 dark:bg-slate-800"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            }`}
                          >
                            <div className={`flex h-9 w-9 items-center justify-center rounded-md flex-shrink-0 ${
                              selected ? "bg-slate-200 dark:bg-slate-700" : "bg-slate-100 dark:bg-slate-800"
                            }`}>
                              <Icon className={`h-4 w-4 ${selected ? "text-slate-700 dark:text-slate-200" : "text-slate-500"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium text-sm ${selected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>{item.label}</span>
                                {item.badge && (
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${
                                    item.badge === "New"
                                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs truncate ${selected ? "text-slate-500 dark:text-slate-400" : "text-slate-400"}`}>
                                {item.description}
                              </p>
                            </div>
                            <kbd className={`hidden sm:flex items-center justify-center w-6 h-6 rounded text-xs font-medium ${
                              selected ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            }`}>
                              {item.shortcut}
                            </kbd>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="w-5 h-5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] flex items-center justify-center">↑</kbd>
                      <kbd className="w-5 h-5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] flex items-center justify-center">↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 h-5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] flex items-center justify-center">↵</kbd>
                      Select
                    </span>
                  </div>
                  <span>{filteredItems.length} results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isLoggedIn && (
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-lg bg-violet-600 text-white font-bold flex items-center justify-center">
                      {userInitial}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">{userName}</p>
                      <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 overflow-y-auto p-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const href = item.href === "/dashboard" ? dashboardHref : item.href;
                  const active = isActive(href);

                  return (
                    <Link
                      key={item.href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm ${
                        active
                          ? "bg-violet-600 text-white"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                {isLoggedIn ? (
                  <button
                    onClick={async () => { setMobileOpen(false); await logout(); }}
                    className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm text-white bg-violet-600"
                  >
                    <Zap className="h-5 w-5" />
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
