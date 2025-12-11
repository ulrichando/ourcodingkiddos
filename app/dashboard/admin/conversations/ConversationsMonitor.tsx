"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import { MessageSquare, Search, User, Calendar, Eye, Loader2, Filter, ArrowLeft } from "lucide-react";

type ConversationData = {
  id: string;
  title: string | null;
  type: string;
  createdAt: string;
  lastMessageAt: string | null;
  participantNames: string[];
  participantRoles: string[];
  messageCount: number;
  lastMessage: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
};

export default function ConversationsMonitor() {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "instructor" | "parent" | "student">("all");
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.participantNames.some(name =>
      name.toLowerCase().includes(search.toLowerCase())
    ) || c.title?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      c.participantRoles.some(role => role.toLowerCase() === filter);

    return matchesSearch && matchesFilter;
  });

  const selectedConversation = conversations.find(c => c.id === selectedConv);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">Conversations Monitor</h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">Track all conversations between instructors, parents, and students</p>
      </div>

      <Card className="flex-1 border-0 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Conversations List */}
          <div className={`${selectedConv ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 flex-col`}>
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className="col-span-2"
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filter === "instructor" ? "default" : "outline"}
                  onClick={() => setFilter("instructor")}
                >
                  Instructors
                </Button>
                <Button
                  size="sm"
                  variant={filter === "parent" ? "default" : "outline"}
                  onClick={() => setFilter("parent")}
                >
                  Parents
                </Button>
                <Button
                  size="sm"
                  variant={filter === "student" ? "default" : "outline"}
                  onClick={() => setFilter("student")}
                  className="col-span-2"
                >
                  Students
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <MessageSquare className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConv(conv.id);
                      loadMessages(conv.id);
                    }}
                    className={`w-full p-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left border-b border-slate-100 dark:border-slate-800 ${
                      selectedConv === conv.id ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-medium truncate ${conv.isDeleted ? 'text-red-600 dark:text-red-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                          {conv.title || conv.participantNames.join(" & ")}
                          {conv.isDeleted && <span className="ml-2 text-xs font-normal">(Deleted)</span>}
                        </p>
                        <span className="text-xs text-slate-400">{conv.messageCount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        {conv.participantRoles.map((role, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 capitalize">
                            {role.toLowerCase()}
                          </span>
                        ))}
                        {conv.isDeleted && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs">
                            Deleted by {conv.deletedBy}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {conv.lastMessageAt ? formatDate(conv.lastMessageAt) : 'No messages'}
                        {conv.isDeleted && conv.deletedAt && (
                          <span className="ml-2 text-red-500">• Deleted {formatDate(conv.deletedAt)}</span>
                        )}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Messages View */}
          <div className={`${selectedConv ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => setSelectedConv(null)}
                      className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedConversation.title || selectedConversation.participantNames.join(" & ")}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>Participants:</span>
                    {selectedConversation.participantNames.map((name, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
                        {name} ({selectedConversation.participantRoles[idx]})
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Created: {formatDate(selectedConversation.createdAt)} | Last activity: {formatDate(selectedConversation.lastMessageAt)}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No messages yet
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                          {msg.fromName?.charAt(0) || msg.fromRole?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                              {msg.fromName || msg.fromRole}
                            </span>
                            <span className="text-xs text-slate-400">
                              {msg.timestamp && new Date(msg.timestamp).toLocaleString()}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 capitalize">
                              {msg.fromRole}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
