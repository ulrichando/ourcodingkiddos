"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
  Search,
  Command,
  Mail,
  Inbox,
  Home,
  MessageSquare,
  Headphones,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const navigationGroups = [
  {
    title: "Dashboard",
    items: [
      { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
    ]
  },
  {
    title: "Users & Access",
    items: [
      { href: "/dashboard/admin/users", label: "Users", icon: Users },
      { href: "/dashboard/admin/instructors", label: "Instructors", icon: Award },
      { href: "/dashboard/admin/parents", label: "Parent Stats", icon: UserCircle },
      { href: "/dashboard/admin/support-staff", label: "Support Staff", icon: Headphones },
    ]
  },
  {
    title: "Content Management",
    items: [
      { href: "/dashboard/admin/programs", label: "Programs", icon: GraduationCap },
      { href: "/dashboard/admin/courses", label: "Courses", icon: BookOpen },
      { href: "/dashboard/admin/content", label: "Course Builder", icon: FileText },
      { href: "/dashboard/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/dashboard/admin/showcase", label: "Student Showcase", icon: Rocket },
      { href: "/dashboard/admin/reviews", label: "Parent Reviews", icon: MessageSquare },
    ]
  },
  {
    title: "Analytics",
    items: [
      { href: "/dashboard/admin/reports", label: "Reports", icon: FileText },
    ]
  },
  {
    title: "Communication",
    items: [
      { href: "/dashboard/admin/inbox", label: "Inbox", icon: Inbox },
      { href: "/dashboard/admin/live-chat", label: "Live Chat", icon: Headphones },
      { href: "/dashboard/admin/announcements", label: "Announcements", icon: Megaphone },
      { href: "/dashboard/admin/email", label: "Email Users", icon: Mail },
      { href: "/dashboard/admin/subscribers", label: "Subscribers", icon: Users },
      { href: "/dashboard/admin/support-tickets", label: "Support Tickets", icon: HelpCircle },
    ]
  },
  {
    title: "Business",
    items: [
      { href: "/dashboard/admin/finance", label: "Finance", icon: DollarSign },
      { href: "/dashboard/admin/sessions", label: "Sessions", icon: Calendar },
      { href: "/dashboard/admin/class-requests", label: "Class Requests", icon: UserPlus },
    ]
  },
  {
    title: "System",
    items: [
      { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
      { href: "/dashboard/admin/health", label: "Health Monitor", icon: Activity },
      { href: "/dashboard/admin/audit", label: "Audit Logs", icon: Shield },
    ]
  }
];

type AdminSidebarProps = {
  onCommandOpen?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function AdminSidebar({ onCommandOpen, isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored !== null) {
      setIsCollapsed(stored === "true");
    }
  }, []);

  // Persist collapsed state
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem("admin-sidebar-collapsed", String(newValue));
      return newValue;
    });
  }, []);

  // Keyboard shortcut for collapse (Cmd/Ctrl + B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapsed]);

  return (
    <>
      {/* Mobile Menu Button - Hidden, controlled by header */}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-40 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-[72px]" : "w-64"}`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Logo Section */}
        <div className={`p-4 flex-shrink-0 border-b border-slate-100 dark:border-slate-800 ${isCollapsed ? "px-3" : "px-4"}`}>
          <Link href="/dashboard/admin" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h2 className="font-bold text-slate-900 dark:text-slate-100 truncate">Admin</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Control Panel</p>
              </div>
            )}
          </Link>
        </div>

        {/* Search/Command Trigger */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <button
              onClick={onCommandOpen}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors group"
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-700 rounded group-hover:bg-slate-300 dark:group-hover:bg-slate-600">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>
          </div>
        )}

        {isCollapsed && (
          <div className="px-3 py-3">
            <button
              onClick={onCommandOpen}
              className="w-full flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Section - Scrollable */}
        <nav className={`flex-1 overflow-y-auto ios-scroll py-4 space-y-6 ${isCollapsed ? "px-3" : "px-4"}`}>
          {navigationGroups.map((group) => (
            <div key={group.title}>
              {!isCollapsed && (
                <h3 className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = mounted ? pathname === item.href : false;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        title={isCollapsed ? item.label : undefined}
                        className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${
                          isCollapsed ? "justify-center p-2.5" : "px-3 py-2"
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/25"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Icon className={`flex-shrink-0 ${isCollapsed ? "w-5 h-5" : "w-4 h-4"}`} />
                        {!isCollapsed && (
                          <span className="text-sm font-medium truncate">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Back to Homepage */}
        <div className={`border-t border-slate-100 dark:border-slate-800 ${isCollapsed ? "p-3" : "p-4"}`}>
          <Link
            href="/"
            className={`flex items-center gap-3 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 ${
              isCollapsed ? "justify-center p-2.5" : "px-3 py-2"
            }`}
            title={isCollapsed ? "Back to Homepage" : undefined}
          >
            <Home className={`flex-shrink-0 ${isCollapsed ? "w-5 h-5" : "w-4 h-4"}`} />
            {!isCollapsed && <span className="text-sm font-medium">Back to Homepage</span>}
          </Link>
        </div>

        {/* Collapse Toggle Button - Desktop only */}
        <div className={`hidden lg:flex border-t border-slate-100 dark:border-slate-800 p-3 ${isCollapsed ? "justify-center" : "justify-end"}`}>
          <button
            onClick={toggleCollapsed}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={isCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
