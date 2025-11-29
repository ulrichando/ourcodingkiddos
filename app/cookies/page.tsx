"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Card className="bg-white border border-slate-200 shadow-md p-8 space-y-4 leading-relaxed text-sm">
          <h1 className="text-3xl font-bold">Cookie Policy</h1>
          <p>We use cookies to keep you signed in, remember preferences, and improve performance.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Essential cookies keep the app secure and functional.</li>
            <li>Analytics cookies help us improve the learning experience.</li>
            <li>You can clear cookies anytime via your browser settings.</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
