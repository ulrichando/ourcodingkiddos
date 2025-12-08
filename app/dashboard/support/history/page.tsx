"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SupportLayout from "../../../../components/support/SupportLayout";
import { Card, CardContent } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import {
  Clock,
  Loader2,
  RefreshCcw,
  Search,
  MessageSquare,
  User,
  Calendar,
  ChevronRight,
  Filter,
} from "lucide-react";

type ChatHistory = {
  id: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  messageCount: number;
  createdAt: string;
  status: "active" | "closed";
};

export default function SupportHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }

    const role = session?.user?.role;
    if (role !== "SUPPORT" && role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    loadHistory();
  }, [session, status, router]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat/conversations");
      const data = await res.json();
      setHistory(data.conversations || []);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return then.toLocaleDateString();
  };

  const filterByDate = (conv: ChatHistory) => {
    if (dateFilter === "all") return true;
    const d = new Date(conv.lastMessageAt);
    const now = new Date();

    switch (dateFilter) {
      case "today":
        return d.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
      case "month":
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const filteredHistory = history
    .filter(
      (conv) =>
        (conv.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        filterByDate(conv)
    )
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  if (status === "loading" || loading) {
    return (
      <SupportLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </SupportLayout>
    );
  }

  return (
    <SupportLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 sm:gap-3">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              Chat History
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              View past conversations with customers
            </p>
          </div>
          <Button onClick={loadHistory} variant="outline">
            <RefreshCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Chats</p>
                  <p className="text-2xl font-bold text-emerald-600">{history.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-emerald-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Today</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {history.filter((c) => new Date(c.lastMessageAt).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">This Week</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {history.filter((c) => {
                      const d = new Date(c.lastMessageAt);
                      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      return d >= weekAgo;
                    }).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Unique Users</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {new Set(history.map((c) => c.userEmail)).size}
                  </p>
                </div>
                <User className="w-8 h-8 text-teal-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* History List */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No chat history found</p>
                <p className="text-sm mt-1">Past conversations will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredHistory.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => router.push("/dashboard/support/live-chat")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {conv.userName?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                            {conv.userName}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                            {formatRelativeTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                          {conv.userEmail}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 truncate mt-1">
                          {conv.lastMessage}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {conv.messageCount} messages
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Started {formatDate(conv.createdAt)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SupportLayout>
  );
}
