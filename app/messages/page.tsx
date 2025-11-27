"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/button";
import { MessageSquare, Send, Paperclip, Smile, Search, X } from "lucide-react";

type Conversation = {
  id: string;
  name: string;
  preview?: string;
  time?: string;
  roles?: { from: string; to: string };
  participants?: string[];
};

type ChatMessage = {
  id: string;
  conversationId?: string;
  fromRole: string;
  toRole: string;
  text: string;
  fromName?: string;
  attachmentName?: string;
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
  const [showEmojis, setShowEmojis] = useState(false);
  const emojiList = [
    "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚",
    "😋","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥",
    "😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎",
    "🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱",
    "😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","🤯","😳","🥹","🤡","👻","💀","👽","🤖",
    "💩","🙏","👍","👎","👏","🙌","🤝","🤟","🤘","👌","✌️","🤌","🤏","👊","🤛","🤜","✋","🖐️","🤚",
    "🖖","🤙","💪","🦾","🫶","❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓",
    "💗","💖","💘","💝","💟","🚀","✨","🌟","🎉","🏆","🎯","📚","💻","🧠","🧑‍💻","👩‍💻","👾","🎮","🛠️"
  ];

  useEffect(() => {
    fetch(`/api/messages?role=${userRole}`)
      .then((r) => r.json())
      .then((data) => {
        const convos = (data.conversations || []).map((c: any) => ({
          ...c,
          name: c.name || c.label || "Conversation",
        }));
        setConversations(convos);
        setMessages(data.messages || []);
        if (convos.length) setActiveId(convos[0].id);
        setContacts(data.contacts || []);
      })
      .catch(() => {});
  }, [userRole]);

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

  const handleSend = async () => {
    if (!input.trim() || !activeId) return;
    const text = input.trim();
    setInput("");
    const optimistic: ChatMessage = {
      id: `tmp-${Date.now()}`,
      conversationId: activeId,
      fromRole: userRole,
      toRole: "instructor",
      text,
      attachmentName: attachment || undefined,
    };
    setMessages((prev) => [...prev, optimistic]);
    setAttachment(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeId,
          fromRole: userRole,
          toRole: "instructor",
          text,
          fromName: userName,
          attachmentName: optimistic.attachmentName,
        }),
      });
      const json = await res.json();
      if (json.message) {
        setMessages((prev) => [...prev.filter((m) => m.id !== optimistic.id), json.message]);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId ? { ...c, preview: text || optimistic.attachmentName, time: "Just now" } : c
          )
        );
      }
    } catch {
      // keep optimistic
    }
  };

  const handleCreateConversation = async () => {
    const recipients = newGroup.length ? newGroup : newTo ? [newTo.trim()] : [];
    if (!recipients.length || !newBody.trim()) return;
    const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createConversation",
          fromRole: userRole,
          toRole: "instructor",
          toName: recipients[0],
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
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
            <p className="text-slate-600">Chat with coaches and support</p>
          </div>
          <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setShowNew(true)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>

        <div className="grid md:grid-cols-[280px,1fr] gap-4">
          {/* Sidebar */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  placeholder="Search..."
                  className="w-full bg-transparent text-sm outline-none text-slate-700"
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
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl border transition ${
                      active ? "border-purple-200 bg-purple-50" : "border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex justify-between text-sm font-semibold text-slate-800">
                      <span>{label}</span>
                      <span className="text-xs text-slate-500">{c.time}</span>
                    </div>
                    {people && <p className="text-[11px] text-slate-500 line-clamp-1">With: {people}</p>}
                    <p className="text-xs text-slate-500 line-clamp-1">{c.preview}</p>
                  </button>
                );
              })}
              {conversations.length === 0 && (
                <div className="text-sm text-slate-500 text-center py-4">
                  No messages yet. Start a new conversation.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

          {/* Thread */}
          <Card className="border-0 shadow-sm min-h-[520px] flex flex-col">
            <CardContent className="p-4 flex flex-col gap-4 flex-1">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center">
                  {activeLabel.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{activeLabel}</p>
                  <p className="text-xs text-emerald-600">Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {activeMessages.map((m) => (
                  <div key={m.id} className={`flex ${m.fromRole === userRole ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                        m.fromRole === userRole
                          ? "bg-purple-500 text-white rounded-br-sm"
                          : "bg-slate-100 text-slate-800 rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                      {m.attachmentName && (
                        <p className="mt-1 text-xs opacity-80">📎 {m.attachmentName}</p>
                      )}
                    </div>
                  </div>
                ))}
                {activeMessages.length === 0 && (
                  <div className="text-center text-slate-500 text-sm mt-10">No messages yet. Start the conversation.</div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-slate-100 pt-3 relative">
                <div className="relative">
                  <button
                    className="p-2 rounded-full hover:bg-slate-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowEmojis((s) => !s);
                    }}
                    title="Insert emoji"
                  >
                    <Smile className="w-5 h-5 text-slate-500" />
                  </button>
                  {showEmojis && (
                    <div className="absolute bottom-12 left-0 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-20 w-[520px]">
                      <div className="grid grid-cols-12 gap-2 max-h-60 overflow-y-auto pr-1">
                        {emojiList.map((emoji) => (
                          <button
                            key={emoji}
                            className="text-xl h-9 w-9 flex items-center justify-center rounded-md hover:bg-slate-100"
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
                        className="w-full mt-2 text-xs text-purple-600 font-semibold text-center hover:underline pt-1"
                        onClick={() => setShowEmojis(false)}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
                <label className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setAttachment(file.name);
                    }}
                  />
                  <Paperclip className="w-5 h-5 text-slate-500" />
                </label>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <Button size="sm" onClick={handleSend} disabled={!input.trim() || !activeId}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {attachment && <div className="text-xs text-slate-500 pt-1">Attached: {attachment}</div>}
            </CardContent>
          </Card>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">New Message</h3>
              <button onClick={() => setShowNew(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500">To</p>
                <input
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  placeholder="Search name..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  list="contacts"
                />
                <datalist id="contacts">
                  {contacts.map((c) => (
                    <option key={c.name} value={c.name} />
                  ))}
                </datalist>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Group name (optional)</p>
                    <input
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g., Parents & Coach"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Add to group</p>
                    <div className="max-h-24 overflow-y-auto border rounded-lg border-slate-200 p-2 space-y-1 text-sm">
                      {contacts.map((c) => (
                        <label key={c.name} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newGroup.includes(c.name)}
                            onChange={(e) => {
                              setNewGroup((prev) =>
                                e.target.checked ? [...prev, c.name] : prev.filter((n) => n !== c.name)
                              );
                            }}
                          />
                          {c.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">Message</p>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Write your message..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNew(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConversation} disabled={(!newTo.trim() && newGroup.length === 0) || !newBody.trim()}>
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
