"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../ui/button";
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  FileCode,
  Users,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
} from "lucide-react";
import { cn } from "../../lib/utils";
import NotificationBell from "../notifications/NotificationBell";

type UserType = "parent" | "student" | "instructor";

type NavLink = { name: string; href: string; icon: any };

type Props = {
  user?: { full_name?: string; email?: string };
  userType?: UserType;
  onLogout?: () => void;
};

export default function MainNav({ user, userType = "parent", onLogout }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const parentLinks: NavLink[] = [
    { name: "Dashboard", href: "/dashboard/parent", icon: Home },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Messages", href: "/messages", icon: MessageSquare },
  ];

  const studentLinks: NavLink[] = [
    { name: "Learn", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Playground", href: "/playground", icon: FileCode },
    { name: "My Projects", href: "/dashboard/student", icon: Award },
  ];

  const instructorLinks: NavLink[] = [
    { name: "Dashboard", href: "/dashboard/instructor", icon: LayoutDashboard },
    { name: "My Classes", href: "/dashboard/instructor", icon: Calendar },
    { name: "Students", href: "/dashboard/instructor", icon: Users },
    { name: "Content", href: "/dashboard/instructor/content", icon: BookOpen },
  ];

  const links = userType === "instructor" ? instructorLinks : userType === "student" ? studentLinks : parentLinks;

  const userInitial = (user?.full_name || "U").charAt(0).toUpperCase();
  const displayEmail = user?.email || "demo.instructor@ourcodingkiddos.com";

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
              CK
            </div>
            <span className="font-bold text-xl text-slate-800 hidden sm:block">Coding Kiddos</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-purple-600 transition-colors font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 relative">
            <NotificationBell userEmail={user?.email} />
            <Button variant="ghost" className="flex items-center gap-2" onClick={() => setMenuOpen((o) => !o)}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                {userInitial}
              </div>
              <span className="hidden sm:block font-medium">{user?.full_name || "User"}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            {menuOpen && (
              <div className="absolute right-0 top-12 w-56 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
                <div className="px-3 py-2">
                  <p className="font-medium text-slate-900">{user?.full_name || "User"}</p>
                  <p className="text-sm text-slate-500 truncate">{displayEmail}</p>
                </div>
                <div className="border-t border-slate-100" />
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                {userType === "parent" && (
                  <Link href="/pricing" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50">
                    <Award className="w-4 h-4" />
                    Subscription
                  </Link>
                )}
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}

            <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={() => setMobileOpen((o) => !o)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-purple-600 transition-colors"
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
