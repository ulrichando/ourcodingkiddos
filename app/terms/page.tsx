"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Card className="bg-white border border-slate-200 shadow-md p-8 space-y-4 leading-relaxed text-sm">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use is intended for parents, students, and instructors on our platform.</li>
            <li>Subscriptions renew per your selected plan unless cancelled.</li>
            <li>Content is for educational use; do not redistribute without permission.</li>
          </ul>
          <p>Questions? Email <a className="text-purple-600 hover:underline" href="mailto:legal@ourcodingkiddos.com">legal@ourcodingkiddos.com</a>.</p>
        </Card>
      </div>
    </main>
  );
}
