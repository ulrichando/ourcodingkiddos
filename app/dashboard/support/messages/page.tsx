"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SupportLayout from "../../../../components/support/SupportLayout";
import { Card, CardContent } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import {
  MessageSquare,
  Loader2,
  RefreshCcw,
  Send,
  Inbox,
  Mail,
  Clock,
  User,
  Search,
} from "lucide-react";

type Message = {
  id: string;
  subject: string;
  content: string;
  fromEmail: string;
  fromName: string;
  createdAt: string;
  read: boolean;
};

export default function SupportMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

    loadMessages();
  }, [session, status, router]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.fromEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.fromName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

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
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 sm:gap-3">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              Messages
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              View and respond to customer messages
            </p>
          </div>
          <Button onClick={loadMessages} variant="outline">
            <RefreshCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {/* Messages Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          {/* Message List */}
          <Card className="border-0 shadow-sm lg:col-span-1 flex flex-col overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Inbox className="w-4 h-4" />
                  Inbox
                </h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {filteredMessages.length} messages
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No messages</p>
                  <p className="text-sm mt-1">Messages will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMessages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        selectedMessage?.id === msg.id
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500"
                          : ""
                      } ${!msg.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {msg.fromName?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium text-slate-900 dark:text-slate-100 truncate ${!msg.read ? "font-semibold" : ""}`}>
                              {msg.fromName}
                            </p>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                            {msg.subject}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                            {msg.content?.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Message Detail */}
          <Card className="border-0 shadow-sm lg:col-span-2 flex flex-col overflow-hidden">
            {!selectedMessage ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Select a message</p>
                  <p className="text-sm mt-1">Choose a message to read and respond</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-shrink-0 p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {selectedMessage.fromName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedMessage.fromEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 p-4 border-t border-slate-100 dark:border-slate-800">
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500">
                    <Send className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </SupportLayout>
  );
}
