"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CertificateCard from "../../components/certificates/CertificateCard";

const demoCertificates = [
  {
    id: "cert-demo",
    course_title: "HTML Basics for Kids",
    student_name: "Demo Student",
    issued_date: "2025-11-28",
    achievement_type: "course_completion" as const,
  },
];

export default function CertificatesPage() {
  const certificates = useMemo(() => demoCertificates, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-slate-600">Celebrate your achievements!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      </div>
    </main>
  );
}
