"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md p-8 space-y-4 leading-relaxed text-sm">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Privacy Policy</h1>
          <p className="text-slate-700 dark:text-slate-300">We respect your privacy and protect your data. We collect only the information needed to deliver classes, progress, and billing.</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Account info is used for login and communication.</li>
            <li>We never sell personal data.</li>
            <li>Parents control student profiles and can request deletion anytime.</li>
          </ul>
          <p className="text-slate-700 dark:text-slate-300">For any questions, contact <a className="text-purple-600 dark:text-purple-400 hover:underline" href="mailto:privacy@ourcodingkiddos.com">privacy@ourcodingkiddos.com</a>.</p>
        </Card>
      </div>
    </main>
  );
}
