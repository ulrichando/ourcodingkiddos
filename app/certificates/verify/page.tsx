"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  User,
  BookOpen,
  Search,
  Loader2,
  Shield,
  ArrowLeft,
} from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CertificateData {
  id: string;
  studentName: string;
  courseTitle: string;
  achievementType: string;
  issuedAt: string;
  verificationCode: string;
  course?: {
    language: string;
    level: string;
  };
}

function VerificationContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code");

  const [code, setCode] = useState(codeFromUrl || "");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState("");

  const handleVerify = useCallback(async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code;

    if (!codeToVerify.trim()) {
      setError("Please enter a verification code");
      return;
    }

    setLoading(true);
    setError("");
    setVerified(null);
    setCertificate(null);

    try {
      const res = await fetch(
        `/api/certificates/verify?code=${encodeURIComponent(codeToVerify.trim())}`
      );
      const data = await res.json();

      if (data.valid && data.certificate) {
        setVerified(true);
        setCertificate(data.certificate);
      } else {
        setVerified(false);
        setError(data.error || "Certificate not found");
      }
    } catch {
      setVerified(false);
      setError("Failed to verify certificate");
    } finally {
      setLoading(false);
    }
  }, [code]);

  // Auto-verify if code is in URL
  useEffect(() => {
    if (codeFromUrl) {
      handleVerify(codeFromUrl);
    }
  }, [codeFromUrl, handleVerify]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAchievementType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Verification Code
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter certificate code (e.g., A1B2C3D4)"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all uppercase font-mono tracking-wider"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {verified === true && certificate && (
        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Certificate Verified</h2>
                  <p className="text-green-100">This certificate is authentic</p>
                </div>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Student Name
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {certificate.studentName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Course Completed
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {certificate.courseTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Achievement Type
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatAchievementType(certificate.achievementType)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Issued Date
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatDate(certificate.issuedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Shield className="w-4 h-4" />
                    <span>Verification Code:</span>
                  </div>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                    {certificate.verificationCode}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {verified === false && (
        <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Certificate Not Found
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {error || "We couldn't find a certificate with this verification code. Please check the code and try again."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      {verified === null && !loading && (
        <div className="text-center text-slate-500 dark:text-slate-400 py-8">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Enter a verification code above to verify a certificate</p>
        </div>
      )}
    </div>
  );
}

export default function CertificateVerifyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Verify Certificate
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Enter the verification code from a Coding Kiddos certificate to confirm its authenticity.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          }
        >
          <VerificationContent />
        </Suspense>
      </div>
    </main>
  );
}
