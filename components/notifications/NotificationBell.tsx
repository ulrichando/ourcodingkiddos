"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "../ui/button";
import { Bell, Trophy, Flame, Calendar, TrendingUp, Info, CheckCheck } from "lucide-react";

type Notification = {
  id: string;
  user_email: string;
  title: string;
  message: string;
  type: "achievement" | "streak" | "class_reminder" | "progress" | "system";
  is_read?: boolean;
  link?: string;
  created_date?: string;
};

const typeIcons = {
  achievement: { icon: Trophy, color: "text-amber-500", bg: "bg-amber-100" },
  streak: { icon: Flame, color: "text-orange-500", bg: "bg-orange-100" },
  class_reminder: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-100" },
  progress: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-100" },
  system: { icon: Info, color: "text-purple-500", bg: "bg-purple-100" },
} as const;

// Demo fallback data so there is always something visible in development
const demoNotifications: Notification[] = [
  {
    id: "n1",
    user_email: "demo@ourcodingkiddos.com",
    title: "Welcome to Coding Kiddos!",
    message: "Start exploring courses and add your first student.",
    type: "system",
    is_read: false,
    link: "/courses",
    created_date: new Date().toISOString(),
  },
  {
    id: "n2",
    user_email: "demo@ourcodingkiddos.com",
    title: "New Course Available!",
    message: "HTML Basics for Kids is now live. Earn 500 XP.",
    type: "progress",
    is_read: false,
    link: "/courses/html-basics",
    created_date: new Date().toISOString(),
  },
  {
    id: "n3",
    user_email: "demo@ourcodingkiddos.com",
    title: "Certificate earned!",
    message: "Demo Student just earned HTML Basics for Kids. View the certificate.",
    type: "achievement",
    is_read: false,
    link: "/certificates/cert-demo",
    created_date: new Date().toISOString(),
  },
];

export default function NotificationBell({ userEmail }: { userEmail?: string }) {
  const baseNotifications = useMemo(() => {
    if (!userEmail) return demoNotifications;
    return demoNotifications.map((n) => ({ ...n, user_email: userEmail }));
  }, [userEmail]);

  const [items, setItems] = useState<Notification[]>(baseNotifications);
  const [open, setOpen] = useState(false);

  const readStore = () => {
    try {
      const data = localStorage.getItem("ck_notification_read");
      return data ? (JSON.parse(data) as string[]) : [];
    } catch {
      return [];
    }
  };

  const persistRead = (ids: string[]) => {
    try {
      localStorage.setItem("ck_notification_read", JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const readIds = readStore();
    setItems(baseNotifications.map((n) => ({ ...n, is_read: readIds.includes(n.id) })));
  }, [baseNotifications]);

  const unreadCount = items.filter((n) => !n.is_read).length;

  const markAll = () => {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    persistRead(items.map((n) => n.id));
  };

  const markOne = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    const readIds = new Set(readStore());
    readIds.add(id);
    persistRead(Array.from(readIds));
  };

  return (
    <div className="relative inline-flex items-center">
      <Button
        variant="ghost"
        size="sm"
        className="relative rounded-full hover:bg-slate-100 w-10 h-10"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-1rem)] p-0 z-50 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-purple-600"
                onClick={markAll}
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
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
                    className={`p-3 border-b last:border-0 cursor-pointer transition-colors ${
                      notification.is_read ? "bg-white" : "bg-purple-50"
                    } hover:bg-slate-50`}
                    onClick={() => markOne(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`w-9 h-9 rounded-full ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${notification.is_read ? "text-slate-700" : "font-medium text-slate-900"}`}>
                            {notification.title}
                          </p>
                          {!notification.is_read && <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
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
          <div className="p-2 border-t">
            <Link href="/notifications" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full text-sm">
                View all notifications
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
