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
  Menu,
  X,
  HelpCircle,
  UserPlus,
  Video,
  Newspaper,
  Rocket,
  Mail,
  CalendarDays,
  Award,
  UserCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

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
      { href: "/dashboard/admin/announcements", label: "Announcements", icon: Megaphone },
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

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-40 transition-transform duration-200 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-64 flex-shrink-0`}
      >
        {/* Logo Section - Fixed at top */}
        <div className="p-6 flex-shrink-0">
          <Link href="/dashboard/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-100">Admin</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Control Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation Section - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = mounted ? pathname === item.href : false;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
