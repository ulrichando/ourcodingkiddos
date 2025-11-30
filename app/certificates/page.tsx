"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CertificateCard from "../../components/certificates/CertificateCard";

export default function CertificatesPage() {
  const certificates = useMemo(() => [], []);

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

        {certificates.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-500">
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
