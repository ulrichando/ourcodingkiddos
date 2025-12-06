"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Lock, Loader2, CheckCircle2, Eye, EyeOff, AlertTriangle, Shield } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validate token and email exist
  if (!token || !email) {
    return (
      <div className="text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Invalid Reset Link
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          This password reset link is invalid or has expired.
        </p>
        <div className="pt-4">
          <Link
            href="/auth/forgot-password"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 active:scale-[0.98]"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login?message=password-reset");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Password Reset Successful!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Your password has been updated. Redirecting you to login...
        </p>
        <div className="pt-4">
          <Link
            href="/auth/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 active:scale-[0.98]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* New Password Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          New Password
        </label>
        <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
          focusedField === "password"
            ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
            : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
        }`}>
          <Lock className={`w-4 h-4 ml-3 transition-colors ${focusedField === "password" ? "text-purple-500" : "text-slate-400"}`} />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter new password"
            required
            minLength={8}
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Must be at least 8 characters
        </p>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Confirm New Password
        </label>
        <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
          focusedField === "confirmPassword"
            ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
            : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
        }`}>
          <Lock className={`w-4 h-4 ml-3 transition-colors ${focusedField === "confirmPassword" ? "text-purple-500" : "text-slate-400"}`} />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setFocusedField("confirmPassword")}
            onBlur={() => setFocusedField(null)}
            placeholder="Confirm new password"
            required
            minLength={8}
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="p-2 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !password || !confirmPassword}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Resetting...
          </>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
              Reset Password
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Create a new password for your account.
            </p>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>

        {/* Trust badge */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            Your password is encrypted and secure
          </p>
        </div>
      </div>
    </main>
  );
}
