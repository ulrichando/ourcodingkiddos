"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  Megaphone,
  DollarSign,
  Calendar,
  Settings,
  Activity,
  Shield,
  HelpCircle,
  UserPlus,
  Newspaper,
  Rocket,
  Award,
  UserCircle,
  Search,
  ArrowRight,
  Moon,
  Sun,
  LogOut,
  Home,
  Command,
  X,
} from "lucide-react";

type CommandItem = {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  category: "navigation" | "actions" | "settings";
  keywords?: string[];
};

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = useMemo(() => [
    // Navigation
    { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard/admin", category: "navigation", keywords: ["dashboard", "home"] },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/dashboard/admin/analytics", category: "navigation", keywords: ["stats", "charts"] },
    { id: "users", label: "Users", icon: Users, href: "/dashboard/admin/users", category: "navigation", keywords: ["members", "accounts"] },
    { id: "instructors", label: "Instructors", icon: Award, href: "/dashboard/admin/instructors", category: "navigation", keywords: ["teachers"] },
    { id: "parents", label: "Parent Stats", icon: UserCircle, href: "/dashboard/admin/parents", category: "navigation" },
    { id: "programs", label: "Programs", icon: GraduationCap, href: "/dashboard/admin/programs", category: "navigation", keywords: ["curriculum"] },
    { id: "courses", label: "Courses", icon: BookOpen, href: "/dashboard/admin/courses", category: "navigation", keywords: ["lessons", "classes"] },
    { id: "content", label: "Course Builder", icon: FileText, href: "/dashboard/admin/content", category: "navigation", keywords: ["editor"] },
    { id: "blog", label: "Blog", icon: Newspaper, href: "/dashboard/admin/blog", category: "navigation", keywords: ["posts", "articles"] },
    { id: "showcase", label: "Student Showcase", icon: Rocket, href: "/dashboard/admin/showcase", category: "navigation", keywords: ["portfolio", "projects"] },
    { id: "reports", label: "Reports", icon: FileText, href: "/dashboard/admin/reports", category: "navigation" },
    { id: "announcements", label: "Announcements", icon: Megaphone, href: "/dashboard/admin/announcements", category: "navigation", keywords: ["notify", "broadcast"] },
    { id: "support", label: "Support Tickets", icon: HelpCircle, href: "/dashboard/admin/support-tickets", category: "navigation", keywords: ["help", "issues"] },
    { id: "finance", label: "Finance", icon: DollarSign, href: "/dashboard/admin/finance", category: "navigation", keywords: ["payments", "billing", "revenue"] },
    { id: "sessions", label: "Sessions", icon: Calendar, href: "/dashboard/admin/sessions", category: "navigation", keywords: ["schedule", "classes"] },
    { id: "requests", label: "Class Requests", icon: UserPlus, href: "/dashboard/admin/class-requests", category: "navigation" },
    { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/admin/settings", category: "navigation", keywords: ["preferences", "config"] },
    { id: "health", label: "Health Monitor", icon: Activity, href: "/dashboard/admin/health", category: "navigation", keywords: ["status", "system"] },
    { id: "audit", label: "Audit Logs", icon: Shield, href: "/dashboard/admin/audit", category: "navigation", keywords: ["logs", "history", "security"] },

    // Actions
    { id: "add-user", label: "Add New User", description: "Create a new user account", icon: UserPlus, href: "/dashboard/admin/users?action=create", category: "actions" },
    { id: "add-course", label: "Add New Course", description: "Create a new course", icon: BookOpen, href: "/dashboard/admin/courses?action=create", category: "actions" },
    { id: "announcement", label: "Create Announcement", description: "Send a new announcement", icon: Megaphone, href: "/dashboard/admin/announcements?action=create", category: "actions" },

    // Settings
    { id: "go-home", label: "Go to Homepage", icon: Home, href: "/", category: "settings" },
    {
      id: "toggle-theme",
      label: "Toggle Dark Mode",
      icon: Moon,
      category: "settings",
      action: () => {
        const isDark = document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", !isDark);
        localStorage.setItem("ok-theme", isDark ? "light" : "dark");
      }
    },
    { id: "logout", label: "Sign Out", icon: LogOut, href: "/api/auth/signout", category: "settings" },
  ], []);

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;
    const term = search.toLowerCase();
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(term) ||
      cmd.description?.toLowerCase().includes(term) ||
      cmd.keywords?.some(k => k.includes(term))
    );
  }, [search, commands]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      navigation: [],
      actions: [],
      settings: [],
    };
    filteredCommands.forEach(cmd => {
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const flatCommands = useMemo(() => filteredCommands, [filteredCommands]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const executeCommand = useCallback((cmd: CommandItem) => {
    if (cmd.action) {
      cmd.action();
    } else if (cmd.href) {
      router.push(cmd.href);
    }
    onClose();
  }, [router, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, flatCommands.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            executeCommand(flatCommands[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, flatCommands, executeCommand, onClose]);

  if (!isOpen) return null;

  const categoryLabels: Record<string, string> = {
    navigation: "Navigate",
    actions: "Quick Actions",
    settings: "Settings",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
        <div
          className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands..."
              className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-sm"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto ios-scroll p-2">
            {flatCommands.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No commands found</p>
              </div>
            ) : (
              <>
                {Object.entries(groupedCommands).map(([category, items]) =>
                  items.length > 0 && (
                    <div key={category} className="mb-2">
                      <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {categoryLabels[category]}
                      </div>
                      <div className="space-y-0.5">
                        {items.map((cmd) => {
                          const Icon = cmd.icon;
                          const globalIndex = flatCommands.findIndex(c => c.id === cmd.id);
                          const isSelected = globalIndex === selectedIndex;
                          return (
                            <button
                              key={cmd.id}
                              onClick={() => executeCommand(cmd)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                                isSelected
                                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg ${
                                isSelected
                                  ? "bg-purple-100 dark:bg-purple-800/50"
                                  : "bg-slate-100 dark:bg-slate-800"
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{cmd.label}</p>
                                {cmd.description && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{cmd.description}</p>
                                )}
                              </div>
                              {isSelected && (
                                <ArrowRight className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">↵</kbd>
                Select
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <Command className="w-3 h-3" />
              <span>K to open</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
