"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bell, Trophy, Flame, Calendar, TrendingUp, Info } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/button";
import { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "achievement" | "streak" | "class_reminder" | "progress" | "system";
  link?: string;
  is_read?: boolean;
  created_date?: string;
};

const typeIcons = {
  achievement: { icon: Trophy, color: "text-amber-500", bg: "bg-amber-100" },
  streak: { icon: Flame, color: "text-orange-500", bg: "bg-orange-100" },
  class_reminder: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-100" },
  progress: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-100" },
  system: { icon: Info, color: "text-purple-500", bg: "bg-purple-100" },
} as const;

const demoNotifications: Notification[] = [
  {
    id: "n1",
    title: "Welcome to Coding Kiddos!",
    message: "Start exploring courses and add your first student.",
    type: "system",
    link: "/courses",
    is_read: false,
  },
  {
    id: "n2",
    title: "New Course Available!",
    message: "HTML Basics for Kids is now live. Earn 500 XP.",
    type: "progress",
    link: "/courses/html-basics",
    is_read: false,
  },
  {
    id: "n3",
    title: "Certificate earned!",
    message: "Demo Student just earned HTML Basics for Kids. View the certificate.",
    type: "achievement",
    link: "/certificates/cert-demo",
    is_read: false,
  },
];

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(demoNotifications);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ck_notification_read");
      const readIds: string[] = saved ? JSON.parse(saved) : [];
      setItems(demoNotifications.map((n) => ({ ...n, is_read: readIds.includes(n.id) })));
      // mark all read when visiting the page
      localStorage.setItem("ck_notification_read", JSON.stringify(demoNotifications.map((n) => n.id)));
    } catch {
      setItems(demoNotifications);
    }
  }, []);

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 inline-flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </span>
            Notifications
          </Link>
          {unreadCount > 0 && <span className="text-xs text-purple-600 dark:text-purple-400">{unreadCount} unread</span>}
        </div>
        <Button variant="outline" size="sm">
          Mark all read
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="font-medium text-slate-700 dark:text-slate-300">No notifications</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">You're all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((notification) => {
            const typeConfig = typeIcons[notification.type] || typeIcons.system;
            const Icon = typeConfig.icon;
            const content = (
              <Card key={notification.id} className={`transition-colors ${!notification.is_read ? "border-purple-200 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/20" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full ${typeConfig.bg} dark:opacity-80 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${typeConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${notification.is_read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-slate-100"}`}>{notification.title}</h3>
                            {!notification.is_read && <span className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full" />}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            if (notification.link) {
              return (
                <Link href={notification.link} key={notification.id}>
                  {content}
                </Link>
              );
            }
            return content;
          })}
        </div>
      )}
    </div>
  );
}
