"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md p-8 space-y-4 leading-relaxed text-sm">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Cookie Policy</h1>
          <p className="text-slate-700 dark:text-slate-300">We use cookies to keep you signed in, remember preferences, and improve performance.</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Essential cookies keep the app secure and functional.</li>
            <li>Analytics cookies help us improve the learning experience.</li>
            <li>You can clear cookies anytime via your browser settings.</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
