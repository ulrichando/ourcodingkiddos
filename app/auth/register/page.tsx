"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Shield, CheckCircle, BadgeCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nameValue = name.trim();
    const emailValue = email.trim().toLowerCase();
    const passwordValue = password;

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue, email: emailValue, password: passwordValue, role: "parent" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Registration failed");
      }

      // Auto sign-in after register
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: emailValue,
        password: passwordValue,
      });
      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }
      router.push("/dashboard/parent");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative animate-fade-in-up">
        <div className="bg-white dark:bg-slate-800/90 dark:backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 p-8 space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold flex items-center justify-center shadow-lg shadow-purple-500/30 text-lg">
              CK
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create your account</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign up to manage your children&apos;s coding journey</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                focusedField === "name"
                  ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              }`}>
                <User className={`w-4 h-4 ml-3 transition-colors ${focusedField === "name" ? "text-purple-500" : "text-slate-400"}`} />
                <input
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your name"
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                focusedField === "email"
                  ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              }`}>
                <Mail className={`w-4 h-4 ml-3 transition-colors ${focusedField === "email" ? "text-purple-500" : "text-slate-400"}`} />
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                focusedField === "password"
                  ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              }`}>
                <Lock className={`w-4 h-4 ml-3 transition-colors ${focusedField === "password" ? "text-purple-500" : "text-slate-400"}`} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a password (min 6 characters)"
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-medium">or continue with</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard/parent" })}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium rounded-xl py-3 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 active:scale-[0.98]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          {/* Login Link */}
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-col items-center gap-3">
          {/* COPPA Compliance Badge */}
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">COPPA Compliant</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Children&apos;s privacy protected</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" />
              256-bit SSL
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              Verified instructors
            </p>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
