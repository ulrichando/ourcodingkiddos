"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  CreditCard,
  TrendingUp,
  Award,
  BookOpen,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Heart,
  Rocket,
  Newspaper,
  GraduationCap,
  Clock,
  Brain,
  BookMarked,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const navigationGroups = [
  {
    title: "Dashboard",
    items: [
      { href: "/dashboard/parent", label: "Overview", icon: LayoutDashboard },
    ]
  },
  {
    title: "Students",
    items: [
      { href: "/dashboard/parent/students", label: "My Students", icon: Users },
      { href: "/dashboard/parent/add-student", label: "Add Student", icon: UserPlus },
      { href: "/dashboard/parent/reports", label: "Progress Reports", icon: TrendingUp },
    ]
  },
  {
    title: "Classes",
    items: [
      { href: "/dashboard/parent/class-requests", label: "Class Requests", icon: Calendar },
      { href: "/dashboard/parent/certificates", label: "Certificates", icon: Award },
    ]
  },
  {
    title: "Learn",
    items: [
      { href: "/dashboard/parent/curriculum", label: "Curriculum", icon: BookMarked },
      { href: "/dashboard/parent/courses", label: "Courses", icon: BookOpen },
      { href: "/dashboard/parent/placement-exam", label: "Placement Exam", icon: Brain },
    ]
  },
  {
    title: "Explore",
    items: [
      { href: "/dashboard/parent/programs", label: "Programs", icon: GraduationCap },
      { href: "/dashboard/parent/schedule", label: "Schedule", icon: Clock },
      { href: "/dashboard/parent/showcase", label: "Showcase", icon: Rocket },
      { href: "/dashboard/parent/blog", label: "Blog", icon: Newspaper },
      { href: "/dashboard/parent/reviews", label: "Leave a Review", icon: Heart },
    ]
  },
  {
    title: "Account",
    items: [
      { href: "/dashboard/parent/profile", label: "My Profile", icon: UserPlus },
      { href: "/dashboard/parent/billing", label: "Billing", icon: CreditCard },
      { href: "/dashboard/parent/messages", label: "Messages", icon: MessageSquare },
      { href: "/dashboard/parent/settings", label: "Settings", icon: Settings },
    ]
  },
];

type ParentSidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function ParentSidebar({ isOpen = false, onClose }: ParentSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("parent-sidebar-collapsed");
    if (stored !== null) {
      setIsCollapsed(stored === "true");
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem("parent-sidebar-collapsed", String(newValue));
      return newValue;
    });
  }, []);

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
          <Link href="/dashboard/parent" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Heart className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h2 className="font-bold text-slate-900 dark:text-slate-100 truncate">Parent</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Dashboard</p>
              </div>
            )}
          </Link>
        </div>

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
                  const isActive = mounted ? (
                    item.href === "/dashboard/parent"
                      ? pathname === item.href
                      : pathname?.startsWith(item.href)
                  ) : false;
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
                            ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25"
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
