"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const faqs = [
  { q: "How do I book a class?", a: "Go to Schedule → pick a day/time → confirm." },
  { q: "What courses should we start with?", a: "For ages 7-10, start with HTML Basics or CSS Magic. Ages 11-14 can jump into JavaScript Quests or Roblox." },
  { q: "How do I track progress?", a: "Use the Parent Dashboard to see XP, badges, and course completion." },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <div className="w-80 max-w-xs md:max-w-sm mb-3 rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-900">Need help?</p>
              <p className="text-xs text-slate-500">Ask a quick question.</p>
            </div>
            <button
              className="p-1 rounded-full text-slate-500 hover:bg-slate-100"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-4 py-3 space-y-3 text-sm text-slate-700">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase text-slate-500 mb-1">Popular questions</p>
              <ul className="space-y-2">
                {faqs.map((item) => (
                  <li key={item.q}>
                    <p className="font-semibold text-slate-800">{item.q}</p>
                    <p className="text-slate-600">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-600">Your message</label>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                rows={3}
                placeholder="Type a question..."
              />
              <button className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        aria-label="Open chat"
        onClick={() => setOpen((prev) => !prev)}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl text-white flex items-center justify-center hover:scale-105 transition"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
