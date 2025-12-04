"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CertificateCard from "../../components/certificates/CertificateCard";

type Certificate = {
  id: string;
  course_title: string;
  student_name: string;
  issued_date: string;
  achievement_type: "course_completion" | "track_completion" | "special_achievement";
};

export default function CertificatesPage() {
  const certificates = useMemo<Certificate[]>(() => [], []); // TODO: Fetch certificates

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Certificates</h1>
          <p className="text-slate-600 dark:text-slate-400">Celebrate your achievements!</p>
        </div>

        {certificates.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800">
            No certificates yet. Complete a course to earn your first certificate.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
