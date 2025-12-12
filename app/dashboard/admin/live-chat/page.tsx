"use client";

import { useEffect, useState, useRef } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
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
  Trash2,
  AlertTriangle,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
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
  isAdmin: boolean;
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

export default function AdminLiveChatPage() {
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

  // Delete state
  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevConversationCount = useRef<number>(0);
  const prevVisitorCount = useRef<number>(0);
  const prevMessageCount = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio and request notification permission
  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleWhDPZC/3NV3OhUtcbnd3JRQJBRXl+Xkpo9RIhdMidrqsJVYKRhDd9XuupxkLx08Zs3yuaFoMyA4XMX1vKRsMCUzUb72wKhwNCoxS7X4xKt0Ny0tRa35x650OiwpQKL6zLJ5PSwmO5f7z7V+QC0jNov91LmBRC4gMX/+1rqES/AtG2bh3rqMaT4mFVHf5MKZY0wfJUbf6sqnZ1EdLDzg8c+rbVgeNTXe9tWwc14gPi/c+tq1d2AjQCva/N+5e2EnQyjX/+K8fmQpRCbT/+W/gWcrRiPQ/+jCg2ouSB/L/+vFhm0wShzH/+7IiXAySxjD//HLjHI0TBW+//TOj3U2TRK6//fRknk4TQ+1//rUlXs6Tgux//3XmH09UAiu//3amn8/UQar//vdnYFAUgOo//rgoYRCVP+l/fjjpIdEVfui/Pbnp4lGV/mf+vTqq4xJWfac+PLtr49MXPeZ9u/wsJJOX/WW9O30s5VRYvST8uv3tphUZfGQ8On6uZxXaO6N7ub9vJ9acOqK7OP+wKJddOeH7OD/w6VgeOOE69z/xahke9+B6dn/yKtof9t+6NX/y65rgt185tH/zrFuhth56s3/0bRxic54683/1Ld0jMp16Mj/17p3j8Z06MT/2r16ksN06MD/3sB9lb9v573/4cKAnbtu3Lr/5MWDoLdp2bb/58iGo7Nk1rL/6suJprBf0q7/7c6MqaxZ0Kv/8NGPq6lUzaj/89SSraVPy6T/9deUr6JKyKD/+NqXsZ5FxZz/+92aspxAvZj//OCctp0+yZr//eOet5s8y5z/");

    // Check if notifications are already permitted
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      setNotificationsEnabled(true);
    }
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // Send browser notification
  const sendNotification = (title: string, body: string) => {
    if (notificationsEnabled && typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/icon.svg",
        tag: "live-chat-notification",
      });
    }
    playNotificationSound();
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (typeof Notification === "undefined") return;

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
    }
  };

  // Load conversations
  const loadConversations = async () => {
    try {
      const res = await fetch("/api/chat/conversations");
      const data = await res.json();
      const newConversations = data.conversations || [];

      // Check for new conversations
      if (prevConversationCount.current > 0 && newConversations.length > prevConversationCount.current) {
        const newChat = newConversations[0];
        sendNotification(
          "New Chat Message",
          `${newChat.userName || "Guest"}: ${newChat.lastMessage?.substring(0, 50)}...`
        );
      }

      prevConversationCount.current = newConversations.length;
      setConversations(newConversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  // Load visitors
  const loadVisitors = async () => {
    try {
      const res = await fetch("/api/visitors");
      const data = await res.json();
      const newVisitors = data.visitors || [];

      // Check for new visitors
      if (prevVisitorCount.current > 0 && newVisitors.length > prevVisitorCount.current) {
        sendNotification(
          "New Visitor",
          `Someone is browsing your site`
        );
      }

      prevVisitorCount.current = newVisitors.length;
      setVisitors(newVisitors);
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
      setMessages(data.messages || []);
      setSelectedUserEmail(data.conversation?.userEmail || "");
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Initial load
  useEffect(() => {
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
  }, [selectedConversation]);

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

  // Delete a single conversation
  const handleDeleteConversation = async (conversationId: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Clear selection if deleted conversation was selected
        if (selectedConversation === conversationId) {
          setSelectedConversation(null);
          setMessages([]);
          setSelectedUserEmail("");
        }
        await loadConversations();
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setDeletingConversationId(null);
    }
  };

  // Delete all conversations
  const handleClearAllConversations = async () => {
    setDeleting(true);
    try {
      // Delete all conversations one by one
      for (const conv of conversations) {
        await fetch(`/api/chat/conversations/${conv.id}`, {
          method: "DELETE",
        });
      }
      setSelectedConversation(null);
      setMessages([]);
      setSelectedUserEmail("");
      await loadConversations();
    } catch (error) {
      console.error("Failed to clear conversations:", error);
    } finally {
      setDeleting(false);
      setShowClearAllConfirm(false);
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <div className="relative">
                <Headphones className="w-8 h-8 text-purple-600" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900" />
              </div>
              Live Chat
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Real-time support chat and visitor monitoring
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Notification Controls */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <button
                onClick={notificationsEnabled ? () => setNotificationsEnabled(false) : requestNotificationPermission}
                className={`p-2 rounded-lg transition-colors ${
                  notificationsEnabled
                    ? "text-purple-600 bg-purple-100 dark:bg-purple-900/30"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
                title={notificationsEnabled ? "Notifications enabled" : "Enable notifications"}
              >
                {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  soundEnabled
                    ? "text-purple-600 bg-purple-100 dark:bg-purple-900/30"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
                title={soundEnabled ? "Sound enabled" : "Sound muted"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {conversations.length > 0 && (
              <Button
                onClick={() => setShowClearAllConfirm(true)}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            )}
            <Button onClick={() => { loadConversations(); loadVisitors(); }} variant="outline">
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Visitors</p>
                  <p className="text-2xl font-bold text-purple-600">{visitors.length}</p>
                </div>
                <Globe className="w-8 h-8 text-purple-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Chats</p>
                  <p className="text-2xl font-bold text-blue-600">{conversations.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Logged In</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {visitors.filter(v => v.isAuthenticated).length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600 opacity-50" />
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
                    ? "text-purple-600 border-b-2 border-purple-600"
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
                    ? "text-purple-600 border-b-2 border-purple-600"
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
                            ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500"
                            : ""
                        }`}
                      >
                        <button
                          onClick={() => handleSelectConversation(conv.id)}
                          className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
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
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingConversationId(conv.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-4 h-4" />
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
                            ? "bg-gradient-to-br from-purple-500 to-pink-500"
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
                                className="h-7 px-2 text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
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
                  <p className="text-lg font-medium">Support Online</p>
                  <p className="text-sm mt-1">Select a conversation to start responding</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex-shrink-0 p-4 border-b border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-purple-500/25">
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
                      <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-slate-500 dark:text-slate-400 py-10">
                      No messages yet
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] ${msg.isAdmin ? "order-2" : ""}`}>
                          <div
                            className={`rounded-2xl px-4 py-2.5 ${
                              msg.isAdmin
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md shadow-lg shadow-purple-500/25"
                                : "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-slate-900 dark:text-slate-100 rounded-bl-md border border-purple-100 dark:border-purple-800/50"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${msg.isAdmin ? "text-right" : ""}`}>
                            {msg.fromName} • {formatRelativeTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                <div className="flex-shrink-0 p-4 border-t border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendReply()}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sending}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
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
            <div className="p-4 border-b border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                  initiatingVisitor.isAuthenticated
                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
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
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
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

      {/* Delete Single Conversation Confirm Modal */}
      {showDeleteConfirm && deletingConversationId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Delete Conversation
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to delete this conversation? All messages will be permanently removed.
              </p>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingConversationId(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteConversation(deletingConversationId)}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Conversations Confirm Modal */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Clear All Conversations
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to delete <strong>all {conversations.length} conversations</strong>? All messages will be permanently removed.
              </p>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowClearAllConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearAllConversations}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting All...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
