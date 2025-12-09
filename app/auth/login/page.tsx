"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, Loader2, Clock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [inactivityLogout, setInactivityLogout] = useState(false);

  // Check if user was logged out due to inactivity
  useEffect(() => {
    // Always clear inactivity localStorage on login page load to ensure fresh session
    try {
      localStorage.removeItem("lastActivityTime");
      localStorage.removeItem("forceLogout");
    } catch {
      // localStorage not available
    }

    if (searchParams.get("reason") === "inactivity") {
      setInactivityLogout(true);
      // Clear the URL parameter
      window.history.replaceState({}, "", "/auth/login");
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicSending, setMagicSending] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const emailValue = email.trim().toLowerCase();
    const passwordValue = password;
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: emailValue,
        password: passwordValue,
      });
      if (res?.error) throw new Error(res.error);

      // Clear inactivity localStorage to prevent immediate logout
      try {
        localStorage.removeItem("lastActivityTime");
        localStorage.removeItem("forceLogout");
        // Set fresh activity time for the new session
        localStorage.setItem("lastActivityTime", Date.now().toString());
      } catch {
        // localStorage not available
      }

      const session = await getSession();
      const sessionRole = typeof (session?.user as any)?.role === "string" ? ((session?.user as any)?.role as string).toUpperCase() : null;
      const target =
        sessionRole === "ADMIN"
          ? "/dashboard/admin"
          : sessionRole === "SUPPORT"
            ? "/dashboard/support"
            : sessionRole === "INSTRUCTOR"
              ? "/dashboard/instructor"
              : sessionRole === "STUDENT"
                ? "/dashboard/student"
                : "/dashboard/parent";
      router.push(target);
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    const emailValue = email.trim().toLowerCase();
    if (!emailValue) {
      setError("Please enter your email first.");
      return;
    }
    setError(null);
    setMagicSending(true);
    setMagicSent(false);
    try {
      const res = await signIn("email", {
        email: emailValue,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (res?.error) throw new Error(res.error);
      setMagicSent(true);
    } catch (err: any) {
      setError(err?.message || "Could not send magic link. Please try again.");
    } finally {
      setMagicSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative animate-fade-in-up">
        <div className="bg-white dark:bg-slate-800/90 dark:backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 p-8 space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold flex items-center justify-center shadow-lg shadow-purple-500/30 text-lg">
              CK
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your Coding Kiddos account</p>
            </div>
          </div>

          {/* Inactivity logout message */}
          {inactivityLogout && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                You were logged out due to inactivity. Please sign in again.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
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

          {/* Social & Magic Link Buttons */}
          <div className="space-y-3">
            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => {
                // Clear inactivity localStorage before Google sign-in
                try {
                  localStorage.removeItem("lastActivityTime");
                  localStorage.removeItem("forceLogout");
                  localStorage.setItem("lastActivityTime", Date.now().toString());
                } catch {}
                signIn("google", { callbackUrl: "/dashboard" });
              }}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium rounded-xl py-3 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            {/* Magic Link */}
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={magicSending}
              className={`w-full flex items-center justify-center gap-2 border rounded-xl py-3 font-medium transition-all duration-200 active:scale-[0.98] ${
                magicSent
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                  : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {magicSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending link...
                </>
              ) : magicSent ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Link sent! Check your email
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Email me a sign-in link
                </>
              )}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Instructors: Sign in with Google to enable Google Meet for your classes.
            </p>
          </div>

          {/* Student Login Link */}
          <div className="text-center">
            <Link
              href="/auth/student-login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md group"
            >
              <span className="text-lg">🎮</span>
              Student? Click here to login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Footer Links */}
          <div className="flex justify-between items-center text-sm pt-2">
            <Link
              href="/auth/forgot-password"
              className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Forgot password?
            </Link>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span>Need an account?</span>
              <Link href="/auth/register" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Secure, COPPA compliant platform
          </p>
        </div>
      </div>
    </main>
  );
}
