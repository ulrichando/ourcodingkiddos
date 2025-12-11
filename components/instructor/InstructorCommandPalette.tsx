"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  BookOpen,
  PlusCircle,
  MessageSquare,
  Settings,
  Search,
  ArrowRight,
  Moon,
  Sun,
  LogOut,
  Command,
  X,
  ClipboardList,
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

type InstructorCommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function InstructorCommandPalette({ isOpen, onClose }: InstructorCommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = useMemo(() => [
    // Navigation
    { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard/instructor", category: "navigation", keywords: ["dashboard", "home"] },
    { id: "students", label: "My Students", icon: Users, href: "/dashboard/instructor/students", category: "navigation", keywords: ["learners", "kids"] },
    { id: "assignments", label: "Assignments", icon: ClipboardList, href: "/dashboard/instructor/assignments", category: "navigation", keywords: ["homework", "tasks"] },
    { id: "create-class", label: "Create Class", icon: PlusCircle, href: "/dashboard/instructor/create-class", category: "navigation", keywords: ["new", "session"] },
    { id: "content", label: "Course Content", icon: BookOpen, href: "/dashboard/instructor/content", category: "navigation", keywords: ["curriculum", "lessons"] },
    { id: "availability", label: "Availability", icon: Clock, href: "/dashboard/instructor/availability", category: "navigation", keywords: ["schedule", "hours"] },
    { id: "calendar", label: "Calendar", icon: Calendar, href: "/dashboard/instructor/calendar", category: "navigation", keywords: ["schedule", "events"] },
    { id: "messages", label: "Messages", icon: MessageSquare, href: "/dashboard/instructor/messages", category: "navigation", keywords: ["chat", "inbox"] },
    { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/instructor/settings", category: "navigation", keywords: ["preferences", "config"] },

    // Actions
    { id: "new-class", label: "Create New Class", description: "Schedule a new class session", icon: PlusCircle, href: "/dashboard/instructor/create-class", category: "actions" },
    { id: "new-assignment", label: "Create New Assignment", description: "Assign work to students", icon: ClipboardList, href: "/dashboard/instructor/assignments", category: "actions" },

    // Settings
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
          setSelectedIndex((prev) => (prev + 1) % flatCommands.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + flatCommands.length) % flatCommands.length);
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

  // Global Cmd+K handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-lg"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Commands List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {flatCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              No commands found
            </div>
          ) : (
            <>
              {Object.entries(groupedCommands).map(([category, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={category} className="py-2">
                    <div className="px-4 py-2">
                      <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {category}
                      </h3>
                    </div>
                    <div>
                      {items.map((cmd, index) => {
                        const Icon = cmd.icon;
                        const globalIndex = flatCommands.indexOf(cmd);
                        const isSelected = globalIndex === selectedIndex;
                        return (
                          <button
                            key={cmd.id}
                            onClick={() => executeCommand(cmd)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center gap-3 px-4 py-3 transition ${
                              isSelected
                                ? "bg-emerald-500 text-white"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{cmd.label}</div>
                              {cmd.description && (
                                <div className={`text-sm ${isSelected ? "text-emerald-100" : "text-slate-500 dark:text-slate-400"}`}>
                                  {cmd.description}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-50" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-[10px]">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-[10px]">↵</kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-[10px]">esc</kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
