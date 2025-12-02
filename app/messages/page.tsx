"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/button";
import { MessageSquare, Send, Paperclip, Smile, Search, X, Check, CheckCheck, Loader2, Trash2, Archive, AlertCircle, ArrowLeft } from "lucide-react";

type Conversation = {
  id: string;
  name: string;
  preview?: string;
  time?: string;
  roles?: { from: string; to: string };
  participants?: string[];
  isOnline?: boolean;
};

type ChatMessage = {
  id: string;
  conversationId?: string;
  fromRole: string;
  toRole: string;
  text: string;
  fromName?: string;
  attachmentName?: string;
  timestamp?: number;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
};

export default function MessagesPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "You";
  const userRole = (session as any)?.user?.role?.toLowerCase?.() || "parent";
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<Array<{ name: string; role: string }>>([]);
  const [showNew, setShowNew] = useState(false);
  const [newTo, setNewTo] = useState("");
  const [newGroup, setNewGroup] = useState<string[]>([]);
  const [newBody, setNewBody] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(0);
  const inferRole = (recipient: string) => {
    const lower = recipient.toLowerCase();
    if (lower.includes("@students.")) return "student";
    if (lower.includes("instructor") || lower.includes("coach")) return "instructor";
    if (lower.includes("parent")) return "parent";
    return "support";
  };
  const findTargetRole = (convoId: string | null) => {
    const convo = conversations.find((c) => c.id === convoId);
    if (!convo?.roles) return "support";
    const { from, to } = convo.roles;
    if (from === userRole && to) return to;
    if (to === userRole && from) return from;
    return to || from || "support";
  };
  const emojiList = [
    "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚",
    "😋","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥",
    "😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","��","😎",
    "🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱",
    "😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","🤯","😳","🥹","🤡","👻","💀","👽","🤖",
    "💩","🙏","👍","👎","👏","🙌","🤝","🤟","🤘","👌","✌️","🤌","🤏","👊","🤛","🤜","✋","🖐️","🤚",
    "🖖","🤙","💪","🦾","🫶","❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓",
    "💗","💖","💘","💝","💟","🚀","✨","🌟","🎉","🏆","🎯","📚","💻","🧠","🧑‍💻","👩‍💻","👾","🎮","🛠️"
  ];

  const activeMessages = useMemo(() => {
    return messages.filter((m) => {
      if (m.conversationId) return m.conversationId === activeId;
      const convo = conversations.find((c) => c.id === activeId);
      if (!convo || !convo.roles) return false;
      return (
        (m.fromRole === convo.roles.from && m.toRole === convo.roles.to) ||
        (m.fromRole === convo.roles.to && m.toRole === convo.roles.from)
      );
    });
  }, [messages, activeId, conversations]);

  const activeLabel = conversations.find((c) => c.id === activeId)?.name || "Select a conversation";

  // Auto-scroll to bottom only when NEW messages are added (not on initial load or conversation switch)
  useEffect(() => {
    const currentCount = activeMessages.length;
    // Only scroll if message count increased (new message sent/received)
    if (currentCount > prevMessageCount.current && prevMessageCount.current > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCount.current = currentCount;
  }, [activeMessages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojis(false);
      }
    };

    if (showEmojis) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojis]);

  useEffect(() => {
    fetch(`/api/messages?role=${userRole}`)
      .then((r) => r.json())
      .then((data) => {
        const convos = (data.conversations || []).map((c: any) => ({
          ...c,
          name: c.name || c.label || "Conversation",
          isOnline: Math.random() > 0.5, // Placeholder for online status
        }));
        setConversations(convos);
        setMessages(data.messages || []);
        if (convos.length) setActiveId(convos[0].id);
        setContacts(data.contacts || []);
      })
      .catch(() => {});
  }, [userRole]);

  // Prefill "new message" when arriving with ?to=&subject=
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    const subject = params.get("subject");
    if (to || subject) {
      setShowNew(true);
      if (to) setNewTo(to);
      if (subject) setNewGroupName(subject);
      // focus the composer; we rely on user to type a message before send
    }
  }, []);

  // Helper function to get relative time
  const getRelativeTime = (timestamp?: number) => {
    if (!timestamp) return "";
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSend = async () => {
    if (!input.trim() || !activeId) return;
    if (input.trim().length > 5000) {
      alert("Message is too long. Maximum 5000 characters.");
      return;
    }

    const text = input.trim();
    const targetRole = findTargetRole(activeId);
    const targetName = conversations.find((c) => c.id === activeId)?.name;
    setInput("");
    setIsSending(true);

    const optimistic: ChatMessage = {
      id: `tmp-${Date.now()}`,
      conversationId: activeId,
      fromRole: userRole,
      toRole: targetRole,
      text,
      attachmentName: attachment || undefined,
      timestamp: Date.now(),
      status: "sending",
    };
    setMessages((prev) => [...prev, optimistic]);
    setAttachment(null);
    setAttachmentPreview(null);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeId,
          fromRole: userRole,
          toRole: targetRole,
          text,
          fromName: userName,
          toName: targetName,
          attachmentName: optimistic.attachmentName,
        }),
      });
      const json = await res.json();
      if (json.message) {
        setMessages((prev) => [...prev.filter((m) => m.id !== optimistic.id), { ...json.message, status: "sent", timestamp: Date.now() }]);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId ? { ...c, preview: text || optimistic.attachmentName, time: "Just now" } : c
          )
        );
      }
    } catch {
      // Mark as failed
      setMessages((prev) => prev.map((m) => m.id === optimistic.id ? { ...m, status: "failed" as const } : m));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!confirm("Delete this conversation?")) return;
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeId === convId) setActiveId(conversations[0]?.id || null);
  };

  const handleArchiveConversation = async (convId: string) => {
    // Placeholder: In real app, would call API
    alert("Archive feature coming soon!");
  };

  const handleCreateConversation = async () => {
    const recipients = newGroup.length ? newGroup : newTo ? [newTo.trim()] : [];
    if (!recipients.length || !newBody.trim()) return;
    const primaryName = recipients[0];
    const contact =
      primaryName && contacts.length
        ? contacts.find((c) => c.name.toLowerCase() === primaryName.toLowerCase())
        : undefined;
    const targetRole = contact?.role || inferRole(primaryName);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createConversation",
        fromRole: userRole,
        toRole: targetRole,
        toName: contact?.name || primaryName,
        toEmail: primaryName,
        participantNames: recipients,
        label: newGroupName.trim()
          ? newGroupName.trim()
          : recipients.length > 1
            ? `Group: ${recipients.join(", ")}`
            : undefined,
        text: newBody.trim(),
        fromName: userName,
      }),
    });
    const json = await res.json();
    if (json.conversation) {
      setConversations((prev) => [json.conversation, ...prev]);
      setActiveId(json.conversation.id);
    }
    if (json.message) setMessages((prev) => [...prev, json.message]);
    setShowNew(false);
    setNewTo("");
    setNewGroup([]);
    setNewBody("");
    setNewGroupName("");
    setAttachment(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Messages</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Chat with coaches and support</p>
          </div>
          <Button variant="outline" onClick={() => setShowNew(true)} className="self-start sm:self-auto">
            <MessageSquare className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Message</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-[280px,1fr] gap-4">
          {/* Sidebar */}
          <Card className={`border-0 shadow-sm ${!showMobileSidebar && activeId ? 'hidden md:block' : 'block'}`}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-2">
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <input
                  placeholder="Search..."
                  className="w-full bg-transparent text-sm outline-none text-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            <div className="space-y-2">
              {conversations.map((c) => {
                const label = c.name || "Conversation";
                const people = c.participants?.join(", ");
                if (
                  search &&
                  !label.toLowerCase().includes(search.toLowerCase()) &&
                  !(people || "").toLowerCase().includes(search.toLowerCase())
                )
                  return null;
                const active = c.id === activeId;
                return (
                  <div key={c.id} className="relative group">
                    <button
                      onClick={() => {
                        setActiveId(c.id);
                        setShowMobileSidebar(false);
                      }}
                      className={`w-full text-left px-3 py-3 sm:py-2 rounded-xl border transition ${
                        active
                          ? "border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-600"
                          : "border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{label}</p>
                            {c.isOnline && <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>}
                          </div>
                          {people && <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">With: {people}</p>}
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.preview}</p>
                        </div>
                        {c.time && <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">{c.time}</span>}
                      </div>
                    </button>
                    <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveConversation(c.id);
                        }}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                        title="Archive"
                      >
                        <Archive className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(c.id);
                        }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {conversations.length === 0 && (
                <div className="text-center py-8 space-y-2">
                  <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">No messages yet</p>
                  <button
                    onClick={() => setShowNew(true)}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Start a new conversation
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

          {/* Thread */}
          <Card className={`border-0 shadow-sm min-h-[520px] flex flex-col ${showMobileSidebar && activeId ? 'hidden md:flex' : 'flex'}`}>
            <CardContent className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  {/* Mobile back button */}
                  <button
                    onClick={() => setShowMobileSidebar(true)}
                    className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center">
                    {activeLabel.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{activeLabel}</p>
                    {activeId && conversations.find((c) => c.id === activeId)?.isOnline && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Online
                      </p>
                    )}
                    {activeId && !conversations.find((c) => c.id === activeId)?.isOnline && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">Offline</p>
                    )}
                  </div>
                </div>
                {activeId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleArchiveConversation(activeId)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Archive conversation"
                    >
                      <Archive className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteConversation(activeId)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {activeMessages.map((m) => {
                  const isSent = m.fromRole === userRole;
                  const time = getRelativeTime(m.timestamp);
                  return (
                    <div key={m.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                        <div
                          className={`rounded-2xl px-3 sm:px-4 py-2 text-sm break-words ${
                            isSent
                              ? "bg-purple-500 text-white rounded-br-sm"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100 rounded-bl-sm"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.text}</p>
                          {m.attachmentName && (
                            <div className="mt-2 p-2 rounded bg-black/10 dark:bg-white/10 flex items-center gap-2">
                              <Paperclip className="w-3 h-3" />
                              <span className="text-xs opacity-90">{m.attachmentName}</span>
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 ${isSent ? "justify-end" : "justify-start"}`}>
                          {time && <span>{time}</span>}
                          {isSent && (
                            <>
                              {m.status === "sending" && <Loader2 className="w-3 h-3 animate-spin" />}
                              {m.status === "sent" && <Check className="w-3 h-3" />}
                              {m.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                              {m.status === "read" && <CheckCheck className="w-3 h-3 text-purple-500" />}
                              {m.status === "failed" && (
                                <div className="flex items-center gap-1 text-red-500">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Failed</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                  </div>
                )}
                {activeMessages.length === 0 && (
                  <div className="text-center py-10 space-y-2">
                    <MessageSquare className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No messages yet</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs">Start the conversation by typing below</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="space-y-2">
                {attachment && (
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg">
                    <Paperclip className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-xs text-slate-700 dark:text-slate-300 flex-1">{attachment}</span>
                    <button
                      onClick={() => {
                        setAttachment(null);
                        setAttachmentPreview(null);
                      }}
                      className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-700 pt-3 relative">
                  <div className="relative" ref={emojiPickerRef}>
                    <button
                      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowEmojis((s) => !s);
                      }}
                      title="Insert emoji"
                    >
                      <Smile className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                    {showEmojis && (
                      <div className="absolute bottom-12 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-3 z-20 w-[280px] sm:w-[520px]">
                        <div className="grid grid-cols-8 sm:grid-cols-12 gap-2 max-h-60 overflow-y-auto pr-1">
                          {emojiList.map((emoji) => (
                            <button
                              key={emoji}
                              className="text-xl h-9 w-9 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                              onClick={() => {
                                setInput((prev) => prev + (prev.endsWith(" ") ? "" : " ") + emoji + " ");
                                setShowEmojis(false);
                              }}
                              aria-label={`Add ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        <button
                          className="w-full mt-2 text-xs text-purple-600 dark:text-purple-400 font-semibold text-center hover:underline pt-1"
                          onClick={() => setShowEmojis(false)}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                  <label className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAttachment(file.name);
                          // Create preview for images
                          if (file.type.startsWith("image/")) {
                            const reader = new FileReader();
                            reader.onloadend = () => setAttachmentPreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                    />
                    <Paperclip className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </label>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={window.innerWidth < 640 ? "Type a message..." : "Type a message... (Enter to send)"}
                    className="flex-1 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 sm:px-4 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                    maxLength={5000}
                  />
                  <Button size="sm" onClick={handleSend} disabled={!input.trim() || !activeId || isSending} className="h-10 w-10 sm:h-auto sm:w-auto p-2 sm:px-3">
                    {isSending ? <Loader2 className="w-4 h-4 sm:w-4 sm:h-4 animate-spin" /> : <Send className="w-4 h-4 sm:w-4 sm:h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">New Message</h3>
              <button onClick={() => setShowNew(false)} className="hover:bg-slate-100 dark:hover:bg-slate-700 p-1 rounded">
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">To</p>
                <input
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  placeholder="Search name..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                  list="contacts"
                />
                <datalist id="contacts">
                  {contacts.map((c) => (
                    <option key={c.name} value={c.name} />
                  ))}
                </datalist>
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Group name (optional)</p>
                    <input
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g., Parents & Coach"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Add to group</p>
                    <div className="max-h-24 overflow-y-auto border rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 p-2 space-y-1 text-sm">
                      {contacts.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">No contacts available</p>
                      ) : (
                        contacts.map((c) => (
                          <label key={c.name} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newGroup.includes(c.name)}
                              onChange={(e) => {
                                setNewGroup((prev) =>
                                  e.target.checked ? [...prev, c.name] : prev.filter((n) => n !== c.name)
                                );
                              }}
                              className="rounded border-slate-300 dark:border-slate-600"
                            />
                            <span className="text-sm">{c.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">({c.role})</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Message</p>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                  placeholder="Write your message..."
                  maxLength={5000}
                />
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">{newBody.length}/5000</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNew(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConversation} disabled={(!newTo.trim() && newGroup.length === 0) || !newBody.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
