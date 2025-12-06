"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Home, BookOpen, Calendar, Settings, LogOut, Moon, Sun, Code2, X,
  GraduationCap, Newspaper, Rocket, BookMarked, Search, Command, Zap,
  Menu, Brain, HelpCircle, Mail, Users, Heart, ChevronDown, ArrowRight,
} from "lucide-react";
import { logout } from "@/lib/logout";
import NotificationBell from "../notifications/NotificationBell";

// Navigation configuration with groups
const navGroups = [
  {
    label: "Learn",
    items: [
      { href: "/curriculum", label: "Curriculum", icon: BookMarked, description: "Structured learning paths", badge: "New" },
      { href: "/courses", label: "Courses", icon: BookOpen, description: "Browse all courses" },
      { href: "/playground", label: "Playground", icon: Code2, description: "Write and run code", badge: "Popular" },
      { href: "/placement-exam", label: "Placement Exam", icon: Brain, description: "Find your coding level" },
    ],
  },
  {
    label: "Programs",
    items: [
      { href: "/programs", label: "Programs", icon: GraduationCap, description: "Enroll in programs" },
      { href: "/schedule", label: "Schedule", icon: Calendar, description: "View upcoming sessions" },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/showcase", label: "Showcase", icon: Rocket, description: "Student projects gallery" },
      { href: "/blog", label: "Blog", icon: Newspaper, description: "News and articles" },
    ],
  },
  {
    label: "About",
    items: [
      { href: "/about", label: "About Us", icon: Users, description: "Learn about our mission" },
      { href: "/our-story", label: "Our Story", icon: Heart, description: "Meet our founder" },
      { href: "/faq", label: "FAQ", icon: HelpCircle, description: "Frequently asked questions" },
      { href: "/contact", label: "Contact", icon: Mail, description: "Get in touch with us" },
    ],
  },
];

// Flat navigation for command palette
const allNavItems = navGroups.flatMap(group => group.items);
const extraItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home, description: "Your personal hub" },
  { href: "/settings", label: "Settings", icon: Settings, description: "Manage your account" },
];

export default function AppHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const userName = session?.user?.name || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole = session?.user?.role?.toUpperCase() ?? "PARENT";
  const showBell = ["PARENT", "STUDENT", "INSTRUCTOR", "ADMIN"].includes(userRole);

  const dashboardHref = userRole === "STUDENT" ? "/dashboard/student"
    : userRole === "INSTRUCTOR" ? "/dashboard/instructor"
    : userRole === "ADMIN" ? "/dashboard/admin"
    : "/dashboard/parent";

  // All items for command palette
  const commandItems = [...allNavItems, ...extraItems].map(item => ({
    ...item,
    href: item.href === "/dashboard" ? dashboardHref : item.href,
  }));

  const filteredItems = commandItems.filter(item => {
    const query = searchQuery.toLowerCase();
    return item.label.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query);
  });

  // Dropdown handlers
  const handleDropdownEnter = useCallback((label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

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
        setActiveDropdown(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus search input
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
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
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
  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";

  // Hide header on dashboard routes (they have their own navigation)
  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) return null;

  return (
    <>
      {/* Skip to content - accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              CK
            </span>
            <span className="hidden sm:block font-semibold text-slate-900 dark:text-white">
              Coding Kiddos
            </span>
          </Link>

          {/* Center Navigation */}
          <nav ref={navRef} className="hidden lg:flex items-center">
            <div className="flex items-center bg-slate-100/50 dark:bg-slate-800/50 rounded-full p-1">
              {navGroups.map((group, groupIndex) => (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(group.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      activeDropdown === group.label
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {/* Animated background */}
                    {activeDropdown === group.label && (
                      <span
                        className="absolute inset-0 bg-white dark:bg-slate-700 rounded-full shadow-sm"
                        style={{
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                    )}
                    <span className="relative z-10">{group.label}</span>
                    <ChevronDown className={`relative z-10 w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === group.label ? "rotate-180" : ""
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === group.label && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                      onMouseEnter={() => handleDropdownEnter(group.label)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2">
                          {group.items.map((item, index) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-150 group/item ${
                                  active
                                    ? "bg-violet-50 dark:bg-violet-900/20"
                                    : hoveredIndex === index
                                    ? "bg-slate-50 dark:bg-slate-800"
                                    : ""
                                }`}
                              >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                  active
                                    ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover/item:bg-slate-200 dark:group-hover/item:bg-slate-700"
                                }`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-medium text-sm ${
                                      active ? "text-violet-700 dark:text-violet-300" : "text-slate-900 dark:text-white"
                                    }`}>
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                        item.badge === "New"
                                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                      }`}>
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {item.description}
                                  </p>
                                </div>
                                <ArrowRight className={`w-4 h-4 text-slate-300 dark:text-slate-600 transition-all ${
                                  hoveredIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                                }`} />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden md:flex items-center gap-2 h-9 w-52 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left text-sm">Search...</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-medium">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>

            {/* Mobile search */}
            <button
              onClick={() => setCommandOpen(true)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => {
                const isDark = document.documentElement.classList.contains("dark");
                const newTheme = isDark ? "light" : "dark";
                document.documentElement.classList.add("theme-transition");
                document.documentElement.classList.toggle("dark", !isDark);
                document.documentElement.setAttribute("data-theme", newTheme);
                try { localStorage.setItem("ok-theme", newTheme); } catch {}
                setTimeout(() => document.documentElement.classList.remove("theme-transition"), 300);
              }}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                    className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      {userInitial}
                    </span>
                    <ChevronDown className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{userName}</p>
                        <p className="text-sm text-slate-500 truncate">{session?.user?.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                          {userRole.toLowerCase()}
                        </span>
                      </div>
                      <div className="p-2">
                        <Link
                          href={dashboardHref}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Home className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={async () => { setMenuOpen(false); await logout(); }}
                          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="h-9 px-4 flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
                >
                  <Zap className="h-4 w-4" />
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
              className="w-full max-w-lg animate-in fade-in slide-in-from-top-4 duration-200"
              onKeyDown={handleCommandKeyDown}
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
                  <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search pages..."
                    className="flex-1 h-14 px-3 bg-transparent text-base text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  />
                  <kbd className="hidden sm:flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-400">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto p-2">
                  {filteredItems.length === 0 ? (
                    <div className="py-12 text-center">
                      <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">No results found</p>
                    </div>
                  ) : (
                    filteredItems.map((item, index) => {
                      const Icon = item.icon;
                      const selected = index === selectedIndex;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setCommandOpen(false)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            selected
                              ? "bg-violet-50 dark:bg-violet-900/20"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${
                            selected
                              ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium text-sm ${
                                selected ? "text-violet-700 dark:text-violet-300" : "text-slate-900 dark:text-white"
                              }`}>
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  item.badge === "New"
                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {item.description}
                            </p>
                          </div>
                          {selected && (
                            <ArrowRight className="w-4 h-4 text-violet-500" />
                          )}
                        </Link>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <kbd className="w-5 h-5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] flex items-center justify-center">↑</kbd>
                      <kbd className="w-5 h-5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] flex items-center justify-center">↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1.5">
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

      {/* Mobile Navigation - Slide from right */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User section */}
              {isLoggedIn && (
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold flex items-center justify-center shadow-lg shadow-violet-500/25">
                      {userInitial}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{userName}</p>
                      <p className="text-sm text-slate-500 truncate">{session?.user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Dashboard link for logged in users */}
                {isLoggedIn && (
                  <div>
                    <Link
                      href={dashboardHref}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                        isActive(dashboardHref)
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Home className="h-5 w-5" />
                      Dashboard
                    </Link>
                  </div>
                )}

                {/* Nav groups */}
                {navGroups.map(group => (
                  <div key={group.label}>
                    <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {group.label}
                    </p>
                    <div className="space-y-1">
                      {group.items.map(item => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                              active
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                active
                                  ? "bg-white/20 text-white"
                                  : item.badge === "New"
                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link>
                    <button
                      onClick={async () => { setMobileOpen(false); await logout(); }}
                      className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25"
                    >
                      <Zap className="h-5 w-5" />
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
