"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Card className="bg-white border border-slate-200 shadow-md p-8 space-y-4 leading-relaxed text-sm">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p>We respect your privacy and protect your data. We collect only the information needed to deliver classes, progress, and billing.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Account info is used for login and communication.</li>
            <li>We never sell personal data.</li>
            <li>Parents control student profiles and can request deletion anytime.</li>
          </ul>
          <p>For any questions, contact <a className="text-purple-600 hover:underline" href="mailto:privacy@ourcodingkiddos.com">privacy@ourcodingkiddos.com</a>.</p>
        </Card>
      </div>
    </main>
  );
}
