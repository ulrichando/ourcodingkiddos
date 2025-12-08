"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Headphones,
  MessageSquare,
  HelpCircle,
  UserCircle,
  Users,
  Clock,
  FileText,
  Search,
  ArrowRight,
  Moon,
  LogOut,
  Home,
  Command,
  Bell,
  RefreshCcw,
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

type SupportCommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SupportCommandPalette({ isOpen, onClose }: SupportCommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = useMemo(() => [
    // Navigation
    { id: "overview", label: "Overview", description: "Support dashboard home", icon: LayoutDashboard, href: "/dashboard/support", category: "navigation", keywords: ["dashboard", "home"] },
    { id: "live-chat", label: "Live Chat", description: "Real-time chat with visitors", icon: Headphones, href: "/dashboard/support/live-chat", category: "navigation", keywords: ["chat", "conversation", "visitor"] },
    { id: "tickets", label: "Support Tickets", description: "Manage support requests", icon: HelpCircle, href: "/dashboard/support/tickets", category: "navigation", keywords: ["help", "issues", "requests"] },
    { id: "messages", label: "Messages", description: "View all messages", icon: MessageSquare, href: "/dashboard/support/messages", category: "navigation", keywords: ["inbox", "mail"] },
    { id: "customers", label: "Customers", description: "Customer directory", icon: Users, href: "/dashboard/support/customers", category: "navigation", keywords: ["parents", "users", "accounts"] },
    { id: "history", label: "Chat History", description: "Past conversations", icon: Clock, href: "/dashboard/support/history", category: "navigation", keywords: ["past", "archive", "old"] },
    { id: "canned-responses", label: "Quick Replies", description: "Canned responses", icon: FileText, href: "/dashboard/support/canned-responses", category: "navigation", keywords: ["templates", "macros", "quick"] },
    { id: "profile", label: "My Profile", description: "Your account settings", icon: UserCircle, href: "/dashboard/support/profile", category: "navigation", keywords: ["account", "settings"] },

    // Actions
    { id: "refresh", label: "Refresh Data", description: "Reload all data", icon: RefreshCcw, category: "actions", action: () => window.location.reload(), keywords: ["reload", "update"] },
    { id: "new-chat", label: "View Live Chats", description: "Go to live chat", icon: Headphones, href: "/dashboard/support/live-chat", category: "actions" },
    { id: "view-tickets", label: "View Open Tickets", description: "See all open tickets", icon: HelpCircle, href: "/dashboard/support/tickets?filter=OPEN", category: "actions" },

    // Settings
    { id: "go-home", label: "Go to Homepage", icon: Home, href: "/", category: "settings" },
    {
      id: "toggle-theme",
      label: "Toggle Dark Mode",
      description: "Switch between light and dark",
      icon: Moon,
      category: "settings",
      action: () => {
        const isDark = document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", !isDark);
        localStorage.setItem("ok-theme", isDark ? "light" : "dark");
      }
    },
    { id: "notifications", label: "Notifications", description: "View notifications", icon: Bell, href: "/notifications", category: "settings" },
    { id: "logout", label: "Sign Out", description: "Log out of your account", icon: LogOut, href: "/api/auth/signout", category: "settings" },
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
          className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-emerald-500" />
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
                                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg ${
                                isSelected
                                  ? "bg-emerald-100 dark:bg-emerald-800/50"
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
                                <ArrowRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
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
