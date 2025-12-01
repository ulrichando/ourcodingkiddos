"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, X, Send, Bot, RefreshCcw, Mail } from "lucide-react";
import Button from "../ui/button";
import Input from "../ui/input";
import { Card } from "../ui/card";

type Message = { role: "assistant" | "user"; content: string };

const quickReplies = [
  { text: "What courses do you offer?", category: "courses" },
  { text: "How much does it cost?", category: "pricing" },
  { text: "What age groups do you teach?", category: "ages" },
  { text: "How do I book a class?", category: "booking" },
  { text: "Help me find a course", category: "help" },
];

const faqResponses: Record<string, string> = {
  courses:
    "We teach HTML, CSS, JavaScript, Python, and Roblox (Lua)! Each has Beginner, Intermediate, and Advanced levels. 🚀",
  pricing:
    "Plans: Free Trial (3 lessons), Monthly $29, Annual $249 (save 28%), Family $49 for up to 3 kids. All include playground access.",
  ages:
    "Ages 7-10: fun visual coding; 11-14: real websites/games; 15-18: advanced projects and portfolios.",
  booking:
    "To book: go to Schedule → pick class type (1:1, Group, Workshop) → choose time → confirm. Need help? I’m here!",
  help:
    "Tell me your child’s age, experience, and goals (games, websites, etc.) and I’ll recommend a course. 🎯",
};

export default function ChatBot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hi there! 👋 I'm Cody. How can I help?" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickReply = async (reply: (typeof quickReplies)[number]) => {
    setMessages((prev) => [...prev, { role: "user" as const, content: reply.text }]);
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 600));
    const response = faqResponses[reply.category] || "Let me help with that!";
    setMessages((prev) => [...prev, { role: "assistant" as const, content: response }]);
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user" as const, content: userMessage }]);
    setIsTyping(true);

    // Simple FAQ match
    const lowered = userMessage.toLowerCase();
    let response: string | null = null;
    if (lowered.includes("price") || lowered.includes("cost")) response = faqResponses.pricing;
    else if (lowered.includes("course") || lowered.includes("teach")) response = faqResponses.courses;
    else if (lowered.includes("age")) response = faqResponses.ages;
    else if (lowered.includes("book")) response = faqResponses.booking;

    await new Promise((r) => setTimeout(r, 700));
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant" as const,
        content:
          response ||
          "I'd love to help! For specifics, email support@ourcodingkiddos.com or tell me your child's age and goals. 😊",
      },
    ]);
    setIsTyping(false);
  };

  const handleGotoMessages = () => {
    setIsOpen(false);
    router.push("/messages");
  };

  const handleClear = () => {
    setMessages([{ role: "assistant", content: "Hi there! 👋 I'm Cody. How can I help?" }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center ${
          isOpen ? "hidden" : ""
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] flex flex-col shadow-2xl rounded-2xl overflow-hidden border-0 bg-white dark:bg-slate-800">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Cody the Helper</h3>
                <p className="text-xs text-white/80">Always here to help!</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === "user" ? "bg-purple-500 text-white rounded-br-sm" : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-bl-sm shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-300 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-300 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-300 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 flex flex-wrap gap-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            {quickReplies.slice(0, 3).map((reply) => (
              <button
                key={reply.text}
                onClick={() => handleQuickReply(reply)}
                className="text-xs px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              >
                {reply.text}
              </button>
            ))}
            <button
              onClick={handleGotoMessages}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Open Messages
            </button>
            <button
              onClick={handleClear}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors inline-flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3" />
              Clear
            </button>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping} className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3" />
                support@ourcodingkiddos.com
              </span>
              <span>We reply within a few minutes</span>
            </div>
          </div>

          <style>{`
            @keyframes confetti-fall {
              to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </Card>
      )}
    </>
  );
}
