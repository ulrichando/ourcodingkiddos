"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import CertificateCard from "../../components/certificates/CertificateCard";

type Certificate = {
  id: string;
  courseTitle: string;
  studentName: string;
  issuedAt: string;
  achievementType: "course_completion" | "track_completion" | "special_achievement";
  verificationCode: string;
};

export default function CertificatesPage() {
  const { status } = useSession();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCertificates() {
      if (status !== "authenticated") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/certificates");
        if (!response.ok) {
          throw new Error("Failed to fetch certificates");
        }
        const data = await response.json();
        setCertificates(data.certificates || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, [status]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        </div>
      </main>
    );
  }

  if (status !== "authenticated") {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800">
            Please <Link href="/auth/login" className="text-purple-600 hover:underline">sign in</Link> to view your certificates.
          </div>
        </div>
      </main>
    );
  }

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

        {error ? (
          <div className="border border-red-200 dark:border-red-800 rounded-xl p-10 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
            {error}
          </div>
        ) : certificates.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800">
            No certificates yet. Complete a course to earn your first certificate.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={{
                  id: cert.id,
                  course_title: cert.courseTitle,
                  student_name: cert.studentName,
                  issued_date: new Date(cert.issuedAt).toLocaleDateString(),
                  achievement_type: cert.achievementType,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
