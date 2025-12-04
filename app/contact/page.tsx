"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  ArrowLeft,
  Send,
  CheckCircle2,
  MapPin,
  ChevronDown,
  Sparkles,
  Zap,
  Clock,
  ArrowUpRight,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { checkRateLimit, formatTimeRemaining } from "@/lib/rate-limit";

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "enrollment", label: "Course Enrollment" },
  { value: "billing", label: "Billing & Payments" },
  { value: "technical", label: "Technical Support" },
  { value: "partnership", label: "Partnership" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "general", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);

    // Check rate limit (3 submissions per minute)
    const rateLimit = checkRateLimit("contact-form", { maxRequests: 3, windowMs: 60000 });
    if (!rateLimit.allowed) {
      setRateLimitError(`Too many submissions. Please try again in ${formatTimeRemaining(rateLimit.resetIn)}.`);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Message Sent!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">We&apos;ll get back to you within 24 hours. Check your inbox!</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => { setIsSubmitted(false); setFormData({ name: "", email: "", subject: "general", message: "" }); }} variant="outline" className="border-slate-300 dark:border-slate-700">
              Send Another
            </Button>
            <Link href="/"><Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Home</Button></Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-white overflow-hidden">
      {/* Ambient background - only visible in dark mode */}
      <div className="fixed inset-0 pointer-events-none dark:block hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <nav className="flex items-center justify-between mb-12 md:mb-16">
          <Link href="/" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online 24/7
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-sm text-purple-700 dark:text-slate-300 mb-6">
            <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            We&apos;d love to hear from you
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Get in <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Questions about courses, billing, or partnerships? We&apos;re here to help.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-3 gap-4 mb-16">
          {/* Contact Form - spans 2 cols */}
          <div className="lg:col-span-2 bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-600 dark:text-slate-400">Name</label>
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 h-12 rounded-xl focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-600 dark:text-slate-400">Email</label>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 h-12 rounded-xl focus:ring-purple-500 focus:border-purple-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-600 dark:text-slate-400">Subject</label>
                <div className="relative">
                  <select name="subject" value={formData.subject} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {subjects.map(s => <option key={s.value} value={s.value} className="bg-white dark:bg-slate-900">{s.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-600 dark:text-slate-400">Message</label>
                <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="How can we help?" required className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 min-h-[140px] rounded-xl resize-none focus:ring-purple-500 focus:border-purple-500" />
              </div>

              {/* Rate limit error message */}
              {rateLimitError && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{rateLimitError}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  Avg. response: 24h
                </div>
                <Button type="submit" disabled={isSubmitting || !!rateLimitError} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 h-12 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Sending
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Send <Send className="w-4 h-4" /></span>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right column cards */}
          <div className="space-y-4">
            {/* Email card */}
            <a href="mailto:support@ourcodingkiddos.com" className="block p-5 md:p-6 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-purple-300 dark:hover:border-purple-500/40 hover:shadow-md transition group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Email Us</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">support@ourcodingkiddos.com</p>
            </a>

            {/* Phone card */}
            <div className="p-5 md:p-6 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Call Us</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">+1 (555) 123-4567</p>
              <p className="text-xs text-slate-500 mt-1">Mon-Fri, 9AM-6PM EST</p>
            </div>

            {/* Location card */}
            <div className="p-5 md:p-6 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">100% Online</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Accessible worldwide</p>
            </div>

            {/* Chat card */}
            <button
              onClick={() => {
                const chatButton = document.querySelector('[data-chat-toggle]') as HTMLButtonElement;
                if (chatButton) chatButton.click();
              }}
              className="w-full p-5 md:p-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl hover:from-orange-600 hover:to-pink-600 transition text-left text-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Instant Help</h3>
                  <p className="text-xs text-white/80">Chat with Cody AI</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom CTA - Link to FAQ */}
        <div className="text-center py-8 border-t border-slate-200 dark:border-white/5">
          <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <HelpCircle className="w-4 h-4" />
            Looking for quick answers?{" "}
            <Link href="/faq" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition">
              Visit our FAQ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
