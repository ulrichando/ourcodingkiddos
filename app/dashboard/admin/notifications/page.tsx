"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Link from "next/link";
import {  Bell,
  ChevronLeft,
  HelpCircle,
  UserPlus,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Trash2,
  Check,
  RefreshCw,
  Filter,
  Search,
  Settings,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type Notification = {
  id: string;
  type: "ticket" | "enrollment" | "payment" | "request" | "alert" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  priority?: "low" | "medium" | "high";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "ticket":
        return <HelpCircle className="w-5 h-5" />;
      case "enrollment":
        return <UserPlus className="w-5 h-5" />;
      case "payment":
        return <CreditCard className="w-5 h-5" />;
      case "request":
        return <Calendar className="w-5 h-5" />;
      case "alert":
        return <AlertTriangle className="w-5 h-5" />;
      case "system":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: Notification["type"], priority?: string) => {
    if (priority === "high") return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
    switch (type) {
      case "ticket":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";
      case "enrollment":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20";
      case "payment":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "request":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20";
      case "alert":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "system":
        return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20";
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch(`/api/admin/notifications/${id}/read`, { method: "POST" });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/admin/notifications/mark-all-read", { method: "POST" });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesRead =
      filterRead === "all" ||
      (filterRead === "unread" && !notification.read) ||
      (filterRead === "read" && notification.read);
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesRead && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeCounts = {
    all: notifications.length,
    ticket: notifications.filter((n) => n.type === "ticket").length,
    enrollment: notifications.filter((n) => n.type === "enrollment").length,
    payment: notifications.filter((n) => n.type === "payment").length,
    request: notifications.filter((n) => n.type === "request").length,
    alert: notifications.filter((n) => n.type === "alert").length,
    system: notifications.filter((n) => n.type === "system").length,
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="px-3 py-1 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Check className="w-4 h-4" />
                Mark all read
              </button>
            )}
            <button
              onClick={fetchNotifications}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types ({typeCounts.all})</option>
            <option value="ticket">Tickets ({typeCounts.ticket})</option>
            <option value="enrollment">Enrollments ({typeCounts.enrollment})</option>
            <option value="payment">Payments ({typeCounts.payment})</option>
            <option value="request">Requests ({typeCounts.request})</option>
            <option value="alert">Alerts ({typeCounts.alert})</option>
            <option value="system">System ({typeCounts.system})</option>
          </select>

          {/* Read Filter */}
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {searchQuery || filterType !== "all" || filterRead !== "all"
                ? "No matching notifications"
                : "No notifications yet"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchQuery || filterType !== "all" || filterRead !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                  !notification.read ? "bg-purple-50/50 dark:bg-purple-900/10" : ""
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                      notification.type,
                      notification.priority
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-semibold ${
                              !notification.read
                                ? "text-slate-900 dark:text-slate-100"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {notification.priority === "high" && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                              High Priority
                            </span>
                          )}
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      {notification.link && (
                        <Link
                          href={notification.link}
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                        >
                          View Details <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          <Check className="w-4 h-4" /> Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-red-500 dark:hover:text-red-400 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
