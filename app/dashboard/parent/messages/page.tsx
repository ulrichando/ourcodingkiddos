"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import ParentLayout from "../../../../components/parent/ParentLayout";
import { MessageSquare, Send, Search, Check, CheckCheck, Loader2, User, Plus } from "lucide-react";

type Conversation = {
  id: string;
  name: string;
  preview?: string;
  time?: string;
  isOnline?: boolean;
  unreadCount?: number;
};

type ChatMessage = {
  id: string;
  conversationId?: string;
  fromRole: string;
  toRole: string;
  text: string;
  fromName?: string;
  timestamp?: number;
  status?: "sending" | "sent" | "delivered" | "read";
};

export default function ParentMessagesPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "You";
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    }
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (data.conversations?.length > 0 && !activeId) {
          setActiveId(data.conversations[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeId) return;

    const newMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: activeId,
      fromRole: "parent",
      toRole: "instructor",
      text: input,
      fromName: userName,
      timestamp: Date.now(),
      status: "sending",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeId,
          text: newMsg.text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? { ...m, id: data.id, status: "sent" } : m))
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeConversation = conversations.find((c) => c.id === activeId);

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ParentLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Messages</h1>
            <p className="text-slate-600 dark:text-slate-400">Chat with instructors</p>
          </div>
          <Button onClick={() => setShowNewChat(true)}>
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        <Card className="flex-1 border-0 shadow-sm overflow-hidden">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col">
              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
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
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <MessageSquare className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">No conversations yet</p>
                    <Button size="sm" variant="outline" className="mt-3" onClick={() => setShowNewChat(true)}>
                      Start a conversation
                    </Button>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveId(conv.id)}
                      className={`w-full p-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${
                        activeId === conv.id ? "bg-violet-50 dark:bg-violet-900/20" : ""
                      }`}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {conv.name.charAt(0)}
                        </div>
                        {conv.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{conv.name}</p>
                          <span className="text-xs text-slate-400">{conv.time}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{conv.preview}</p>
                      </div>
                      {conv.unreadCount && conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {activeConversation.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{activeConversation.name}</p>
                      <p className="text-xs text-slate-500">Instructor</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => {
                      const isMe = msg.fromRole === "parent";
                      return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[70%] ${isMe ? "order-2" : ""}`}>
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isMe
                                  ? "bg-violet-500 text-white rounded-br-md"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : ""}`}>
                              <span className="text-xs text-slate-400">{formatTime(msg.timestamp)}</span>
                              {isMe && msg.status && (
                                <>
                                  {msg.status === "sending" && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
                                  {msg.status === "sent" && <Check className="w-3 h-3 text-slate-400" />}
                                  {msg.status === "delivered" && <CheckCheck className="w-3 h-3 text-slate-400" />}
                                  {msg.status === "read" && <CheckCheck className="w-3 h-3 text-violet-500" />}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || sending}
                        className="rounded-full w-10 h-10 p-0"
                      >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* New Chat Modal */}
        {showNewChat && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-0 shadow-2xl">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">New Conversation</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Start a conversation with your child's instructor.
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Contact Instructor</p>
                      <p className="text-sm text-slate-500">Message your child's teacher</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowNewChat(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1">Start Chat</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
