"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "resend">("loading");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setStatus("resend");
      setMessage("Invalid verification link. Please request a new verification email.");
      return;
    }

    // Verify the email
    fetch(`/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. Please try again.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("An error occurred. Please try again.");
      });
  }, [token, email]);

  const handleResend = async () => {
    if (!email) return;

    setResending(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.status === "ok") {
        setStatus("resend");
        setMessage("A new verification email has been sent. Please check your inbox.");
      } else {
        setMessage(data.message || "Failed to send verification email.");
      }
    } catch {
      setMessage("Failed to send verification email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative animate-fade-in-up">
        <div className="bg-white dark:bg-slate-800/90 dark:backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 p-8 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold flex items-center justify-center shadow-lg shadow-purple-500/30 text-lg">
              CK
            </div>
          </div>

          {/* Loading State */}
          {status === "loading" && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Verifying your email...
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Email Verified!
              </h1>
              <p className="text-slate-500 dark:text-slate-400">{message}</p>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200"
              >
                Continue to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Verification Failed
              </h1>
              <p className="text-slate-500 dark:text-slate-400">{message}</p>
              {email && (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 disabled:opacity-60"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Resend Verification Email
                    </>
                  )}
                </button>
              )}
              <Link
                href="/auth/login"
                className="block text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          )}

          {/* Resend State */}
          {status === "resend" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Check Your Email
              </h1>
              <p className="text-slate-500 dark:text-slate-400">{message}</p>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium rounded-xl py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
