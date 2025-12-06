"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle2, Shield } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDevResetUrl("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);

      // Show reset URL in development mode
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Back Link */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800/90 dark:backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold flex items-center justify-center shadow-lg shadow-purple-500/30 text-lg mb-4">
              CK
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Forgot Password?
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              No worries! Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Check Your Email
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                If an account exists for <strong className="text-slate-700 dark:text-slate-300">{email}</strong>, you&apos;ll receive a password reset link shortly.
              </p>

              {/* Development mode reset URL */}
              {devResetUrl && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Development Mode - Reset Link:
                  </p>
                  <a
                    href={devResetUrl}
                    className="text-xs text-purple-600 dark:text-purple-400 break-all hover:underline"
                  >
                    {devResetUrl}
                  </a>
                </div>
              )}

              <div className="pt-4">
                <Link
                  href="/auth/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 active:scale-[0.98]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                  focusedField === "email"
                    ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                }`}>
                  <Mail className={`w-4 h-4 ml-3 transition-colors ${focusedField === "email" ? "text-purple-500" : "text-slate-400"}`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    required
                    className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>

        {/* Trust badge */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            Your information is secure
          </p>
        </div>
      </div>
    </main>
  );
}
