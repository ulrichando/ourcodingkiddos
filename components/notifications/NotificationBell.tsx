"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Button from "../ui/button";
import { Bell, Trophy, Flame, Calendar, TrendingUp, Info, CheckCheck, Users, BookOpen, Award, UserX, Video, UserPlus, AlertTriangle } from "lucide-react";

type Notification = {
  id: string;
  userEmail: string;
  title: string;
  message: string;
  type: "achievement" | "streak" | "class_reminder" | "progress" | "system" | "student_added" | "course_started" | "course_completed" | "welcome" | "student_offline" | "class_starting" | "enrollment_new" | "attendance_alert";
  isRead: boolean;
  link?: string;
  createdAt: string;
  metadata?: Record<string, any>;
};

const typeIcons = {
  achievement: { icon: Trophy, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  streak: { icon: Flame, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  class_reminder: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  progress: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  system: { icon: Info, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  student_added: { icon: Users, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
  course_started: { icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  course_completed: { icon: Award, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  welcome: { icon: Info, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
  // Instructor-specific notification types
  student_offline: { icon: UserX, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  class_starting: { icon: Video, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  enrollment_new: { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  attendance_alert: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
} as const;

export default function NotificationBell({ userEmail }: { userEmail?: string }) {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/notifications", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userEmail]);

  // Click-outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const markAll = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "markAllRead" }),
      });
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const markOne = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "markRead", notificationId: id }),
      });
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  if (!userEmail) {
    return null; // Don't show bell if user not logged in
  }

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 w-10 h-10"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-1rem)] p-0 z-50 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-purple-600 dark:text-purple-400"
                onClick={markAll}
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto ios-scroll">
            {loading ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50 animate-pulse" />
                <p className="text-sm">Loading...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              items.map((notification) => {
                const typeConfig = typeIcons[notification.type] || typeIcons.system;
                const Icon = typeConfig.icon;
                const inner = (
                  <div
                    key={notification.id}
                    className={`p-3 border-b dark:border-slate-700 last:border-0 cursor-pointer transition-colors ${
                      notification.isRead
                        ? "bg-white dark:bg-slate-800"
                        : "bg-purple-50 dark:bg-purple-900/20"
                    } hover:bg-slate-50 dark:hover:bg-slate-700`}
                    onClick={() => markOne(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`w-9 h-9 rounded-full ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${notification.isRead ? "text-slate-700 dark:text-slate-300" : "font-medium text-slate-900 dark:text-slate-100"}`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full flex-shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                );
                if (notification.link) {
                  return (
                    <Link key={notification.id} href={notification.link} onClick={() => setOpen(false)}>
                      {inner}
                    </Link>
                  );
                }
                return inner;
              })
            )}
          </div>
          <div className="p-2 border-t dark:border-slate-700">
            <Link href="/notifications" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                View all notifications
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
