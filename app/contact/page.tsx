"use client";

import Link from "next/link";
import { Mail, Phone, ArrowLeft, MessageSquare, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-xs text-slate-500 inline-flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            Safe & private — we reply within 24 hours
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-6">
          <Card className="bg-white border border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Contact Our Team</CardTitle>
              <p className="text-slate-600 text-sm">
                We’re here to help with enrollments, live classes, billing, or anything else.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-slate-600">Your Name</label>
                  <Input placeholder="Jane Doe" className="h-11" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-600">Email</label>
                  <Input type="email" placeholder="you@example.com" className="h-11" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">How can we help?</label>
                <Textarea placeholder="Tell us about your question…" className="min-h-[140px]" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Typical reply time: under 24 hours
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">Send Message</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-white border border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Quick Ways to Reach Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <a className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-purple-300 transition" href="mailto:support@ourcodingkiddos.com">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-slate-500">support@ourcodingkiddos.com</div>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-semibold">Phone (Mon–Fri)</div>
                    <div className="text-slate-500">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-semibold">Chat with us</div>
                    <div className="text-slate-500">Use the bottom-right chat bubble anytime.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Need faster help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>Click the chat bubble in the bottom-right corner to open Cody (our chatbot) and get instant answers.</p>
                <a
                  href="#chatbot"
                  className="w-full inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
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
