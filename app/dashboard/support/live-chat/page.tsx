"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SupportLayout from "../../../../components/support/SupportLayout";
import { Card, CardContent } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import {  Headphones,
  MessageSquare,
  Users,
  Send,
  Loader2,
  RefreshCcw,
  Globe,
  Clock,
  User,
  Mail,
  ArrowLeft,
  Circle,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type Conversation = {
  id: string;
  userEmail: string;
  userName: string;
  lastMessage: string;
  lastMessageAt: string;
  messageCount: number;
  createdAt: string;
};

type Message = {
  id: string;
  content: string;
  fromEmail: string;
  fromName: string;
  fromRole: string;
  createdAt: string;
  isSupport: boolean;
};

type Visitor = {
  id: string;
  page: string;
  userAgent: string;
  lastSeen: string;
  sessionStart: string;
  isAuthenticated: boolean;
  userName?: string;
  userEmail?: string;
};

export default function SupportLiveChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"chats" | "visitors">("chats");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initiate chat state
  const [initiatingVisitor, setInitiatingVisitor] = useState<Visitor | null>(null);
  const [initiateMessage, setInitiateMessage] = useState("");
  const [initiating, setInitiating] = useState(false);

  // Auth check
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
  }, [session, status, router]);

  // Load conversations
  const loadConversations = async () => {
    try {
      const res = await fetch("/api/chat/conversations");
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  // Load visitors
  const loadVisitors = async () => {
    try {
      const res = await fetch("/api/visitors");
      const data = await res.json();
      setVisitors(data.visitors || []);
    } catch (error) {
      console.error("Failed to load visitors:", error);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}`);
      const data = await res.json();
      // Map isAdmin to isSupport for styling
      const formattedMessages = (data.messages || []).map((msg: any) => ({
        ...msg,
        isSupport: msg.fromRole === "ADMIN" || msg.fromRole === "SUPPORT",
      }));
      setMessages(formattedMessages);
      setSelectedUserEmail(data.conversation?.userEmail || "");
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (status !== "authenticated") return;

    const role = session?.user?.role;
    if (role !== "SUPPORT" && role !== "ADMIN") return;

    const loadAll = async () => {
      setLoading(true);
      await Promise.all([loadConversations(), loadVisitors()]);
      setLoading(false);
    };
    loadAll();

    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      loadConversations();
      loadVisitors();
      if (selectedConversation) {
        loadMessages(selectedConversation);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedConversation, session, status]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Select a conversation
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    loadMessages(conversationId);
  };

  // Send reply
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation,
          message: replyText,
          userEmail: selectedUserEmail,
        }),
      });

      if (res.ok) {
        setReplyText("");
        loadMessages(selectedConversation);
        loadConversations();
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
    }
  };

  // Initiate chat with visitor
  const handleInitiateChat = async () => {
    if (!initiatingVisitor?.userEmail || !initiateMessage.trim()) return;

    setInitiating(true);
    try {
      const res = await fetch("/api/chat/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorEmail: initiatingVisitor.userEmail,
          visitorName: initiatingVisitor.userName,
          message: initiateMessage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setInitiateMessage("");
        setInitiatingVisitor(null);
        // Reload conversations and select the new one
        await loadConversations();
        setSelectedConversation(data.conversationId);
        setSelectedUserEmail(initiatingVisitor.userEmail);
        loadMessages(data.conversationId);
        setActiveTab("chats");
      }
    } catch (error) {
      console.error("Failed to initiate chat:", error);
    } finally {
      setInitiating(false);
    }
  };

  // Format relative time
  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  // Get browser name from user agent
  const getBrowserName = (userAgent: string) => {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Browser";
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
              <div className="relative">
                <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900" />
              </div>
              Live Chat
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Chat with website visitors in real-time
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { loadConversations(); loadVisitors(); }} variant="outline">
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Visitors</p>
                  <p className="text-2xl font-bold text-emerald-600">{visitors.length}</p>
                </div>
                <Globe className="w-8 h-8 text-emerald-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Chats</p>
                  <p className="text-2xl font-bold text-teal-600">{conversations.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-teal-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Logged In</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {visitors.filter(v => v.isAuthenticated).length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-emerald-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Guests</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {visitors.filter(v => !v.isAuthenticated).length}
                  </p>
                </div>
                <User className="w-8 h-8 text-orange-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          {/* Left Panel - Conversations/Visitors List */}
          <Card className="border-0 shadow-sm lg:col-span-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex-shrink-0 flex border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab("chats")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "chats"
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Chats ({conversations.length})
              </button>
              <button
                onClick={() => setActiveTab("visitors")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "visitors"
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Visitors ({visitors.length})
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "chats" ? (
                conversations.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No chat conversations yet</p>
                    <p className="text-sm mt-1">Messages from website visitors will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`relative group ${
                          selectedConversation === conv.id
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500"
                            : ""
                        }`}
                      >
                        <button
                          onClick={() => handleSelectConversation(conv.id)}
                          className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                              {conv.userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                  {conv.userName}
                                </p>
                                <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                                  {formatRelativeTime(conv.lastMessageAt)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {conv.userEmail}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-300 truncate mt-1">
                                {conv.lastMessage}
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : visitors.length === 0 ? (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No active visitors</p>
                  <p className="text-sm mt-1">Visitors will appear here in real-time</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {visitors.map((visitor) => (
                    <div key={visitor.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
                          visitor.isAuthenticated
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                            : "bg-gradient-to-br from-slate-400 to-slate-500"
                        }`}>
                          {visitor.userName ? visitor.userName.charAt(0).toUpperCase() : "G"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                            <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                              {visitor.userName || "Guest Visitor"}
                            </p>
                          </div>
                          {visitor.userEmail && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {visitor.userEmail}
                            </p>
                          )}
                          <p className="text-sm text-slate-600 dark:text-slate-300 truncate mt-1 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {visitor.page}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                              <span>{getBrowserName(visitor.userAgent)}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatRelativeTime(visitor.sessionStart)}
                              </span>
                            </div>
                            {visitor.userEmail && (
                              <Button
                                size="sm"
                                onClick={() => setInitiatingVisitor(visitor)}
                                className="h-7 px-2 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                              >
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Chat
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Right Panel - Chat Messages */}
          <Card className="border-0 shadow-sm lg:col-span-2 flex flex-col overflow-hidden">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Headphones className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900" />
                  </div>
                  <p className="text-lg font-medium">Ready to Help</p>
                  <p className="text-sm mt-1">Select a conversation to start responding</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex-shrink-0 p-4 border-b border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-emerald-500/25">
                        {conversations.find(c => c.id === selectedConversation)?.userName.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {conversations.find(c => c.id === selectedConversation)?.userName || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedUserEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-slate-500 dark:text-slate-400 py-10">
                      No messages yet
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isSupport ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] ${msg.isSupport ? "order-2" : ""}`}>
                          <div
                            className={`rounded-2xl px-4 py-2.5 ${
                              msg.isSupport
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-md shadow-lg shadow-emerald-500/25"
                                : "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-slate-900 dark:text-slate-100 rounded-bl-md border border-emerald-100 dark:border-emerald-800/50"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${msg.isSupport ? "text-right" : ""}`}>
                            {msg.fromName} • {formatRelativeTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                <div className="flex-shrink-0 p-4 border-t border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendReply()}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sending}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Initiate Chat Modal */}
      {initiatingVisitor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                  initiatingVisitor.isAuthenticated
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                    : "bg-gradient-to-br from-slate-400 to-slate-500"
                }`}>
                  {initiatingVisitor.userName ? initiatingVisitor.userName.charAt(0).toUpperCase() : "G"}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Start chat with {initiatingVisitor.userName || "Guest"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {initiatingVisitor.userEmail}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Your message
              </label>
              <textarea
                value={initiateMessage}
                onChange={(e) => setInitiateMessage(e.target.value)}
                placeholder="Hi! I noticed you're browsing our site. How can I help you today?"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                The visitor will receive this message via email and can reply through the chat widget.
              </p>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setInitiatingVisitor(null);
                  setInitiateMessage("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleInitiateChat}
                disabled={!initiateMessage.trim() || initiating}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
              >
                {initiating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </SupportLayout>
  );
}
