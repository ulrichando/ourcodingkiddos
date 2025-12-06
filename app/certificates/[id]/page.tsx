"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import Button from "../../../components/ui/button";

type Certificate = {
  id: string;
  student: string;
  course: string;
  issued: string;
  code: string;
  type: string;
};

export default function CertificateDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch certificate data from API
    // For now, just set loading to false with no cert
    setLoading(false);
  }, [id]);

  const handleDownload = () => {
    if (!cert) return;
    const html = `
      <html>
        <head>
          <title>Certificate</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: #fff7e6; }
            .wrapper { padding: 24px; }
            .card { border: 8px double #d97706; border-radius: 12px; padding: 32px; background: #fff; max-width: 700px; margin: 0 auto; text-align: center; }
            .title { font-size: 28px; font-weight: 700; color: #92400e; margin-bottom: 8px; }
            .subtitle { font-size: 14px; color: #4b5563; margin-bottom: 16px; }
            .student { font-size: 24px; font-weight: 700; color: #111827; margin: 4px 0; }
            .course { font-size: 18px; font-weight: 600; color: #7c3aed; margin: 6px 0 18px; }
            .date { font-size: 14px; color: #4b5563; margin-top: 8px; }
            .code { font-size: 12px; color: #6b7280; margin-top: 4px; }
            .logo { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg,#f59e0b,#d97706); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px; color: #fff; }
            .footer { margin-top: 24px; font-size: 14px; color: #1f2937; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="logo">🎖️</div>
              <div class="title">Certificate of Completion</div>
              <div class="subtitle">This is to certify that</div>
              <div class="student">${cert.student}</div>
              <div class="subtitle">has successfully completed</div>
              <div class="course">${cert.course}</div>
              <div class="date">Issued: ${cert.issued}</div>
              <div class="code">Verification Code: ${cert.code}</div>
              <div class="footer">Coding Kiddos</div>
            </div>
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank", "height=900,width=700");
    if (win) {
      win.onload = () => {
        win.focus();
        win.print();
      };
    } else {
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center text-slate-600 dark:text-slate-400">
            Loading certificate...
          </div>
        </div>
      </main>
    );
  }

  if (!cert) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <Link href="/certificates" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" />
            Back to Certificates
          </Link>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center text-slate-600 dark:text-slate-400">
            No certificate found.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <Link href="/certificates" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" />
          Back to Certificates
        </Link>

        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-amber-200 dark:border-amber-700 overflow-hidden">
          <div className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800 p-8">
            <div className="max-w-3xl mx-auto border-[3px] border-amber-400 dark:border-amber-600 rounded-xl p-8 space-y-6 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500 dark:bg-amber-600 text-white flex items-center justify-center mx-auto text-2xl font-bold">
                🎖️
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-amber-800 dark:text-amber-400">{cert.type}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">This is to certify that</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{cert.student}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">has successfully completed</p>
                <p className="text-lg font-semibold text-purple-700 dark:text-purple-400">{cert.course}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                {cert.issued}
              </div>
              <div className="pt-4 border-t border-amber-200 dark:border-amber-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Coding Kiddos</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Verification Code: {cert.code}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 border-t border-amber-200 dark:border-amber-700 px-6 py-4 flex items-center justify-between">
            <Link href="/certificates">
              <Button variant="outline">Back</Button>
            </Link>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
