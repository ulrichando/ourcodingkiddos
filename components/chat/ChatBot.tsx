"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, X, Send, Sparkles, RefreshCcw, ArrowRight, Mail, ArrowLeft, Loader2, Headphones, User, Bot, GraduationCap, Phone, Check } from "lucide-react";
import Button from "../ui/button";
import { emails } from "@/lib/emails";

type Message = { role: "assistant" | "user" | "support"; content: string; timestamp?: Date };

// Team members who provide support
const supportTeam = [
  { name: "Ulrich", initials: "U", color: "from-violet-500 to-purple-600" },
  { name: "Lizzy", initials: "L", color: "from-pink-500 to-rose-500" },
];

const suggestions = [
  { text: "What courses do you offer?", icon: "📚" },
  { text: "How much does it cost?", icon: "💰" },
  { text: "What ages do you teach?", icon: "👶" },
  { text: "Register my child", icon: "🎓", isRegistration: true },
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
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userName = session?.user?.name?.split(" ")[0] || "there";
  const userEmail = session?.user?.email || "";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Support chat mode
  const [supportMode, setSupportMode] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Registration interest mode
  const [registrationMode, setRegistrationMode] = useState(false);
  const [regData, setRegData] = useState({
    parentName: "",
    parentEmail: "",
    phone: "",
    childName: "",
    childAge: "",
    interests: "",
  });
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Poll for new messages when in support mode
  useEffect(() => {
    if (!supportMode || !conversationId) return;

    const pollMessages = async () => {
      const email = isAuthenticated ? userEmail : guestEmail;
      if (!email) return;

      try {
        const response = await fetch(`/api/chat/messages?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.messages && data.messages.length > 0) {
          // Get admin messages we haven't shown yet
          const adminMessages = data.messages.filter(
            (msg: { isAdmin: boolean }) => msg.isAdmin
          );

          // Update messages if there are new admin messages
          if (adminMessages.length > 0) {
            setMessages((prev) => {
              // Count current admin messages
              const currentAdminCount = prev.filter((m) => m.role === "support").length;
              const systemMessageCount = prev.filter((m) =>
                m.role === "support" && (
                  m.content.includes("Message sent!") ||
                  m.content.includes("connected with our support") ||
                  m.content.includes("Thanks")
                )
              ).length;
              const realAdminCount = currentAdminCount - systemMessageCount;

              // Only update if there are new admin messages
              if (adminMessages.length > realAdminCount) {
                // Convert API messages to chat format
                const newMessages: Message[] = data.messages.map((msg: { isAdmin: boolean; content: string }) => ({
                  role: msg.isAdmin ? "support" as const : "user" as const,
                  content: msg.content,
                }));
                return newMessages;
              }
              return prev;
            });
          }
        }
      } catch (error) {
        console.debug("Failed to poll messages:", error);
      }
    };

    // Poll every 10 seconds
    const interval = setInterval(pollMessages, 10000);

    return () => clearInterval(interval);
  }, [supportMode, conversationId, isAuthenticated, userEmail, guestEmail]);

  const matchQuery = (text: string): string | null => {
    const lowered = text.toLowerCase();
    if (lowered.includes("price") || lowered.includes("cost") || lowered.includes("much")) return faqResponses.pricing;
    if (lowered.includes("course") || lowered.includes("teach") || lowered.includes("learn") || lowered.includes("offer")) return faqResponses.courses;
    if (lowered.includes("age") || lowered.includes("old") || lowered.includes("year")) return faqResponses.ages;
    if (lowered.includes("book") || lowered.includes("start") || lowered.includes("begin") || lowered.includes("sign")) return faqResponses.booking;
    if (lowered.includes("help") || lowered.includes("recommend") || lowered.includes("find")) return faqResponses.help;
    return null;
  };

  const handleSuggestion = async (text: string, isSupport?: boolean, isRegistration?: boolean) => {
    setHasInteracted(true);

    if (isRegistration) {
      // Switch to registration mode
      setRegistrationMode(true);
      setRegSuccess(false);
      setMessages((prev) => [...prev, { role: "user", content: "I want to register my child" }]);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "That's wonderful! Let me help you get started. Please fill out the form below and our team will reach out to schedule a free trial class."
      }]);

      // Pre-fill data if authenticated
      if (isAuthenticated) {
        setRegData((prev) => ({
          ...prev,
          parentName: session?.user?.name || "",
          parentEmail: userEmail,
        }));
      }
      return;
    }

    if (isSupport) {
      // Switch to support mode
      setSupportMode(true);
      setMessages((prev) => [...prev, { role: "user", content: "I'd like to talk to support" }]);

      // Check if user is authenticated or has guest info
      if (!isAuthenticated && !guestEmail) {
        setShowGuestForm(true);
        setMessages((prev) => [...prev, {
          role: "support",
          content: "Hi! To connect you with our support team, please provide your name and email so we can get back to you."
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: "support",
          content: `Hi ${isAuthenticated ? userName : guestName || "there"}! You're now connected with our support team. Type your message and we'll get back to you as soon as possible. Our team typically responds within a few hours during business hours.`
        }]);
      }
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    const response = matchQuery(text) || "I'd be happy to help! Could you tell me more about what you're looking for?";
    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setIsTyping(false);
  };

  // Handle registration interest submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = isAuthenticated ? userEmail : regData.parentEmail;
    if (!email || !regData.childName) return;

    setIsSubmittingReg(true);

    try {
      const response = await fetch("/api/chat/register-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: isAuthenticated ? session?.user?.name : regData.parentName,
          parentEmail: email,
          phone: regData.phone,
          childName: regData.childName,
          childAge: regData.childAge ? parseInt(regData.childAge) : undefined,
          interests: regData.interests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegSuccess(true);
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: `Thank you! We've received your interest for ${regData.childName}. Our team will contact you at ${email} within 24 hours to schedule a free trial class!`
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: data.error || "Sorry, there was an error. Please try again or contact us directly."
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Connection error. Please check your internet and try again."
      }]);
    } finally {
      setIsSubmittingReg(false);
    }
  };

  // Exit registration mode
  const exitRegistrationMode = () => {
    setRegistrationMode(false);
    setRegSuccess(false);
    setRegData({
      parentName: "",
      parentEmail: "",
      phone: "",
      childName: "",
      childAge: "",
      interests: "",
    });
  };

  // Send message to support API
  const handleSupportMessage = async () => {
    if (!input.trim()) return;

    const messageEmail = isAuthenticated ? userEmail : guestEmail;
    const messageName = isAuthenticated ? session?.user?.name || "User" : guestName || "Guest";

    if (!messageEmail) {
      setShowGuestForm(true);
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);
    setIsSendingSupport(true);

    try {
      const response = await fetch("/api/chat/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          name: messageName,
          email: messageEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!conversationId) {
          setConversationId(data.conversationId);
        }
        setMessages((prev) => [...prev, {
          role: "support",
          content: "Message sent! Our team has been notified and will respond soon. You'll receive an email when we reply."
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: "support",
          content: "Sorry, there was an error sending your message. Please try again or email us directly at " + emails.support
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "support",
        content: "Connection error. Please check your internet and try again."
      }]);
    } finally {
      setIsSendingSupport(false);
    }
  };

  // Handle guest form submission
  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;

    setShowGuestForm(false);
    setMessages((prev) => [...prev, {
      role: "support",
      content: `Thanks ${guestName}! You're now connected with our support team. Type your message below and we'll respond to ${guestEmail}.`
    }]);
  };

  // Switch back to bot mode
  const switchToBot = () => {
    setSupportMode(false);
    setMessages((prev) => [...prev, {
      role: "assistant",
      content: "You're back to chatting with Cody! How can I help?"
    }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // If in support mode, use support handler
    if (supportMode) {
      handleSupportMessage();
      return;
    }

    if (!isAuthenticated) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input.trim() },
        { role: "assistant", content: "Please sign in to send custom messages, or click **Talk to Support** to chat with our team directly!" },
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
      `Thanks for your question! For specific inquiries, click **Talk to Support** or tell me more about what you're looking for.`;

    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setIsTyping(false);
  };

  const handleClear = () => {
    setMessages([]);
    setHasInteracted(false);
    setInput("");
    setSupportMode(false);
    setShowGuestForm(false);
    setConversationId(null);
    setRegistrationMode(false);
    setRegSuccess(false);
    setRegData({
      parentName: "",
      parentEmail: "",
      phone: "",
      childName: "",
      childAge: "",
      interests: "",
    });
  };

  const greeting = isAuthenticated ? `Hi ${userName}!` : "Hi there!";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        data-chat-toggle
        style={{ background: "linear-gradient(to bottom right, #7c3aed, #9333ea)" }}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full text-white shadow-lg shadow-violet-500/25 flex items-center justify-center transition-all hover:scale-105 hover:shadow-violet-500/40 border-0 cursor-pointer ${isOpen ? "hidden" : ""}`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[380px] sm:h-[560px] flex flex-col bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${supportMode ? "border-pink-200 dark:border-pink-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20" : "border-slate-100 dark:border-slate-800"}`}>
            <div className="flex items-center gap-3">
              {supportMode ? (
                <>
                  {/* Stacked team member avatars */}
                  <div className="flex -space-x-2">
                    {supportTeam.map((member, index) => (
                      <div
                        key={member.name}
                        className={`relative w-8 h-8 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white dark:border-slate-900`}
                        style={{ zIndex: supportTeam.length - index }}
                        title={member.name}
                      >
                        {member.initials}
                      </div>
                    ))}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" style={{ zIndex: 10 }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {supportTeam.map((m) => m.name).join(", ").replace(/, ([^,]*)$/, " & $1")}
                    </h3>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Online to Chat
                    </p>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {supportMode && (
                <button
                  onClick={switchToBot}
                  className="p-2 rounded-lg text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                  title="Switch to Cody (AI)"
                >
                  <Bot className="w-4 h-4" />
                </button>
              )}
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
                      onClick={() => handleSuggestion(s.text, false, (s as { isRegistration?: boolean }).isRegistration)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${
                        (s as { isRegistration?: boolean }).isRegistration
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 border border-emerald-200 dark:border-emerald-800"
                          : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span className="text-lg">{s.icon}</span>
                      <span className={`flex-1 text-sm ${
                        (s as { isRegistration?: boolean }).isRegistration
                          ? "text-emerald-700 dark:text-emerald-300 font-medium"
                          : "text-slate-700 dark:text-slate-300"
                      }`}>{s.text}</span>
                      <ArrowRight className={`w-4 h-4 transition-all group-hover:translate-x-0.5 ${
                        (s as { isRegistration?: boolean }).isRegistration
                          ? "text-emerald-400 group-hover:text-emerald-600"
                          : "text-slate-400 group-hover:text-violet-500"
                      }`} />
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
                    {msg.role === "support" && (
                      <div className="flex gap-3 max-w-[90%]">
                        <div className="relative flex-shrink-0 mt-0.5">
                          {/* Rotating team member avatar for support messages */}
                          {(() => {
                            const member = supportTeam[i % supportTeam.length];
                            return (
                              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-[10px] font-bold`} title={member.name}>
                                {member.initials}
                              </div>
                            );
                          })()}
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-slate-900" />
                        </div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl rounded-tl-md px-3 py-2 border border-purple-100 dark:border-purple-800/50">
                          <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                        </div>
                      </div>
                    )}
                    {msg.role === "user" && (
                      <div className="flex gap-3 max-w-[85%]">
                        <div className={`rounded-2xl rounded-br-md px-4 py-2.5 ${supportMode ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25" : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"}`}>
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
          {hasInteracted && !isTyping && !supportMode && !isSendingSupport && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-hide">
              {suggestions.map((s) => (
                <button
                  key={s.text}
                  onClick={() => handleSuggestion(s.text)}
                  className="flex-shrink-0 px-3 py-1.5 text-xs rounded-full transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300"
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className={`p-4 border-t ${registrationMode ? "border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10" : supportMode ? "border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10" : "border-slate-100 dark:border-slate-800"}`}>
            {/* Registration Mode - Form */}
            {registrationMode && !regSuccess ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={exitRegistrationMode}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Register Interest
                  </span>
                </div>

                {!isAuthenticated && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={regData.parentName}
                          onChange={(e) => setRegData((prev) => ({ ...prev, parentName: e.target.value }))}
                          placeholder="Your name"
                          className="w-full pl-10 pr-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-emerald-200 dark:border-emerald-800"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={regData.parentEmail}
                          onChange={(e) => setRegData((prev) => ({ ...prev, parentEmail: e.target.value }))}
                          placeholder="Your email"
                          className="w-full pl-10 pr-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-emerald-200 dark:border-emerald-800"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={regData.phone}
                        onChange={(e) => setRegData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone (optional)"
                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-emerald-200 dark:border-emerald-800"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={regData.childName}
                      onChange={(e) => setRegData((prev) => ({ ...prev, childName: e.target.value }))}
                      placeholder="Child's name"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-emerald-200 dark:border-emerald-800"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="5"
                      max="18"
                      value={regData.childAge}
                      onChange={(e) => setRegData((prev) => ({ ...prev, childAge: e.target.value }))}
                      placeholder="Age"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-emerald-200 dark:border-emerald-800"
                    />
                  </div>
                </div>

                <select
                  value={regData.interests}
                  onChange={(e) => setRegData((prev) => ({ ...prev, interests: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-emerald-200 dark:border-emerald-800"
                >
                  <option value="">What would they like to learn?</option>
                  <option value="Web Development (HTML/CSS/JavaScript)">Web Development</option>
                  <option value="Python">Python</option>
                  <option value="Roblox Game Development">Roblox Games</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>

                <button
                  type="submit"
                  disabled={isSubmittingReg || (!isAuthenticated && !regData.parentEmail) || !regData.childName}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingReg ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      Get Free Trial
                    </>
                  )}
                </button>
              </form>
            ) : registrationMode && regSuccess ? (
              /* Registration Success */
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium mb-3">
                  Interest Registered!
                </p>
                <button
                  onClick={exitRegistrationMode}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                >
                  Continue chatting
                </button>
              </div>
            ) : supportMode && showGuestForm && !isAuthenticated ? (
              <form onSubmit={handleGuestSubmit} className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => { setShowGuestForm(false); setSupportMode(false); }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Enter your details</span>
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-200 dark:border-purple-800"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-200 dark:border-purple-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  <Headphones className="w-4 h-4" />
                  Connect to Support
                </button>
              </form>
            ) : supportMode && (isAuthenticated || guestEmail) ? (
              /* Support Mode - Chat Input */
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Type your message to support..."
                  disabled={isSendingSupport}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-200 dark:border-purple-800 transition-shadow disabled:opacity-50"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isSendingSupport}
                  className="h-10 w-10 p-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                >
                  {isSendingSupport ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ) : isAuthenticated ? (
              /* Authenticated - Regular Chat Input */
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
              /* Guest - Talk to Support */
              <button
                onClick={() => handleSuggestion("Talk to Support", true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/40 transition-all"
              >
                <div className="relative flex -space-x-1">
                  {supportTeam.slice(0, 3).map((member, idx) => (
                    <div
                      key={member.name}
                      className={`w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-[8px] font-bold border border-white/30`}
                      style={{ zIndex: supportTeam.length - idx }}
                    >
                      {member.initials}
                    </div>
                  ))}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse border border-white" style={{ zIndex: 10 }} />
                </div>
                <span>Chat with Ulrich & Lizzy</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
