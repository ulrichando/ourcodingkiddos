"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MessageCircle, X, Send, Sparkles, RefreshCcw, ArrowRight, User, LogIn } from "lucide-react";
import Button from "../ui/button";

type Message = { role: "assistant" | "user"; content: string };

const suggestions = [
  { text: "What courses do you offer?", icon: "📚" },
  { text: "How much does it cost?", icon: "💰" },
  { text: "What ages do you teach?", icon: "👶" },
  { text: "How do I get started?", icon: "🚀" },
];

const faqResponses: Record<string, string> = {
  courses: "We teach **HTML**, **CSS**, **JavaScript**, **Python**, and **Roblox (Lua)**! Each has Beginner, Intermediate, and Advanced levels perfect for young coders.",
  pricing: "**Plans:**\n• Free Trial — 3 lessons\n• Monthly — $29/month\n• Annual — $249/year (save 28%)\n• Family — $49 for up to 3 kids\n\nAll include unlimited playground access!",
  ages: "**Age groups:**\n• 7-10 years: Fun visual coding\n• 11-14 years: Real websites & games\n• 15-18 years: Advanced projects & portfolios",
  booking: "**Getting started is easy:**\n1. Browse our courses\n2. Pick a class (1:1, Group, or Workshop)\n3. Choose your schedule\n4. Start coding!\n\nNeed help picking? Tell me about your child!",
  help: "I'd love to help you find the perfect course! Tell me:\n• Your child's age\n• Any coding experience\n• What they want to build (games, websites, apps)",
};

function formatMessage(content: string) {
  // Simple markdown-like formatting
  return content
    .split('\n')
    .map((line, i) => {
      // Bold text
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet points
      if (formatted.startsWith('• ')) {
        return `<li key=${i} class="ml-4">${formatted.slice(2)}</li>`;
      }
      // Numbered lists
      if (/^\d+\.\s/.test(formatted)) {
        return `<li key=${i} class="ml-4 list-decimal">${formatted.replace(/^\d+\.\s/, '')}</li>`;
      }
      return formatted;
    })
    .join('<br/>');
}

export default function ChatBot() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userName = session?.user?.name?.split(" ")[0] || "there";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const matchQuery = (text: string): string | null => {
    const lowered = text.toLowerCase();
    if (lowered.includes("price") || lowered.includes("cost") || lowered.includes("much")) return faqResponses.pricing;
    if (lowered.includes("course") || lowered.includes("teach") || lowered.includes("learn") || lowered.includes("offer")) return faqResponses.courses;
    if (lowered.includes("age") || lowered.includes("old") || lowered.includes("year")) return faqResponses.ages;
    if (lowered.includes("book") || lowered.includes("start") || lowered.includes("begin") || lowered.includes("sign")) return faqResponses.booking;
    if (lowered.includes("help") || lowered.includes("recommend") || lowered.includes("find")) return faqResponses.help;
    return null;
  };

  const handleSuggestion = async (text: string) => {
    setHasInteracted(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    const response = matchQuery(text) || "I'd be happy to help! Could you tell me more about what you're looking for?";
    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!isAuthenticated) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input.trim() },
        { role: "assistant", content: "Please sign in to send custom messages. You can use the suggestions above, or sign in for full access!" },
      ]);
      setInput("");
      setHasInteracted(true);
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setHasInteracted(true);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    const response = matchQuery(userMessage) ||
      "Thanks for your question! For specific inquiries, email us at support@ourcodingkiddos.com or tell me more about what you're looking for.";

    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setIsTyping(false);
  };

  const handleClear = () => {
    setMessages([]);
    setHasInteracted(false);
    setInput("");
  };

  const greeting = isAuthenticated ? `Hi ${userName}!` : "Hi there!";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        data-chat-toggle
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group ${isOpen ? "hidden" : ""}`}
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[380px] sm:h-[560px] flex flex-col bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Cody</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {hasInteracted && (
                <button
                  onClick={handleClear}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Clear chat"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {!hasInteracted ? (
              /* Empty State */
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {greeting} I'm Cody
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-[260px]">
                  Your coding assistant. Ask me about courses, pricing, or how to get started!
                </p>
                <div className="w-full space-y-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.text}
                      onClick={() => handleSuggestion(s.text)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors group"
                    >
                      <span className="text-lg">{s.icon}</span>
                      <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{s.text}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex gap-3 max-w-[90%]">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                        </div>
                      </div>
                    )}
                    {msg.role === "user" && (
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl rounded-br-md px-4 py-2.5">
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 animate-in fade-in duration-200">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex items-center gap-1 py-3">
                      <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Quick Suggestions (when chatting) */}
          {hasInteracted && !isTyping && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-hide">
              {suggestions.slice(0, 3).map((s) => (
                <button
                  key={s.text}
                  onClick={() => handleSuggestion(s.text)}
                  className="flex-shrink-0 px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask anything..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-shadow"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 p-0 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                Sign in to chat
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
