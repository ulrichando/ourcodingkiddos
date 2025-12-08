"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SupportLayout from "../../../components/support/SupportLayout";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Headphones,
  MessageSquare,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type Stats = {
  activeChats: number;
  pendingTickets: number;
  resolvedToday: number;
  avgResponseTime: string;
  onlineVisitors: number;
};

export default function SupportDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    activeChats: 0,
    pendingTickets: 0,
    resolvedToday: 0,
    avgResponseTime: "0m",
    onlineVisitors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentConversations, setRecentConversations] = useState<any[]>([]);

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

    // Load stats and conversations
    const loadData = async () => {
      try {
        // Load conversations
        const convRes = await fetch("/api/chat/conversations");
        const convData = await convRes.json();

        // Load visitors
        const visitorRes = await fetch("/api/visitors");
        const visitorData = await visitorRes.json();

        // Load tickets count
        const ticketRes = await fetch("/api/support-tickets?status=OPEN&limit=1");
        const ticketData = await ticketRes.json();

        setStats({
          activeChats: convData.conversations?.length || 0,
          pendingTickets: ticketData.total || 0,
          resolvedToday: 0,
          avgResponseTime: "< 5m",
          onlineVisitors: visitorData.visitors?.length || 0,
        });

        setRecentConversations(convData.conversations?.slice(0, 5) || []);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [session, status, router]);

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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900" />
            </div>
            Support Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back, {session?.user?.name || "Agent"}! Here's your overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Chats</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.activeChats}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-emerald-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pending Tickets</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingTickets}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Online Visitors</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.onlineVisitors}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Response</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.avgResponseTime}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Live Chat Card */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-emerald-600" />
                  Live Chat
                </h3>
                <Link
                  href="/dashboard/support/live-chat"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <CardContent className="p-4">
              {recentConversations.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No active conversations</p>
                  <p className="text-sm mt-1">New messages will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentConversations.map((conv: any) => (
                    <Link
                      key={conv.id}
                      href="/dashboard/support/live-chat"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                        {conv.userName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {conv.userName || "Guest"}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                          {conv.lastMessage || "No messages"}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips Card */}
          <Card className="border-0 shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Quick Tips
              </h3>
            </div>
            <CardContent className="p-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">1</span>
                  </span>
                  <div>
                    <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">Respond Quickly</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Aim to respond within 5 minutes for the best customer experience.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </span>
                  <div>
                    <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">Be Friendly</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Use a warm, welcoming tone. Parents appreciate friendly support.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-xs font-bold">3</span>
                  </span>
                  <div>
                    <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">Know Your Resources</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Familiarize yourself with our programs and pricing to help customers.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </SupportLayout>
  );
}
