"use client";

import Link from "next/link";
import { Bell, Trophy, Flame, Calendar, TrendingUp, Info, Users, BookOpen, Award, CheckCheck, Trash2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Notification = {
  id: string;
  userEmail: string;
  title: string;
  message: string;
  type: "achievement" | "streak" | "class_reminder" | "progress" | "system" | "student_added" | "course_started" | "course_completed" | "welcome";
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
} as const;

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
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
    if (status === "authenticated") {
      fetchNotifications();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const markAllRead = async () => {
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

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setItems((prev) => prev.filter((n) => n.id !== id));
      // Update unread count if deleted notification was unread
      const notification = items.find((n) => n.id === id);
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">Notifications</span>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="font-medium text-slate-700 dark:text-slate-300">Please log in</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">You need to be logged in to view notifications.</p>
            <Link href="/auth/login">
              <Button>Log In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs">
            <CheckCheck className="w-3 h-3 mr-1" />
            Mark all read
          </Button>
        )}
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
              <Card
                key={notification.id}
                className={`transition-colors ${!notification.isRead ? "border-purple-200 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/20" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${typeConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${notification.isRead ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-slate-100"}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && <span className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{formatDate(notification.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                markOne(notification.id);
                              }}
                              title="Mark as read"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            if (notification.link) {
              return (
                <Link href={notification.link} key={notification.id} onClick={() => markOne(notification.id)}>
                  {content}
                </Link>
              );
            }
            return <div key={notification.id}>{content}</div>;
          })}
        </div>
      )}
    </div>
  );
}
