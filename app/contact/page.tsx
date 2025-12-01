"use client";

import Link from "next/link";
import { Mail, Phone, ArrowLeft, MessageSquare, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            Safe & private — we reply within 24 hours
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-6">
          <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">Contact Our Team</CardTitle>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                We're here to help with enrollments, live classes, billing, or anything else.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-slate-600 dark:text-slate-400">Your Name</label>
                  <Input placeholder="Jane Doe" className="h-11" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-600 dark:text-slate-400">Email</label>
                  <Input type="email" placeholder="you@example.com" className="h-11" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600 dark:text-slate-400">How can we help?</label>
                <Textarea placeholder="Tell us about your question…" className="min-h-[140px]" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Typical reply time: under 24 hours
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">Send Message</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Quick Ways to Reach Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <a className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition" href="mailto:support@ourcodingkiddos.com">
                  <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Email</div>
                    <div className="text-slate-500 dark:text-slate-400">support@ourcodingkiddos.com</div>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Phone (Mon–Fri)</div>
                    <div className="text-slate-500 dark:text-slate-400">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Chat with us</div>
                    <div className="text-slate-500 dark:text-slate-400">Use the bottom-right chat bubble anytime.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Need faster help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <p>Click the chat bubble in the bottom-right corner to open Cody (our chatbot) and get instant answers.</p>
                <a
                  href="#chatbot"
                  className="w-full inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Open Chat
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
