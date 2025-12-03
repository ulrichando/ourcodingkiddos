"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicSending, setMagicSending] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const session = await getSession();
      const sessionRole = typeof (session?.user as any)?.role === "string" ? ((session?.user as any)?.role as string).toUpperCase() : null;
      const target =
        sessionRole === "ADMIN"
          ? "/dashboard/admin"
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center shadow-lg">
              CK
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome to Coding Kiddos</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-purple-600 text-white font-semibold rounded-lg py-2.5 shadow-sm hover:bg-slate-800 dark:hover:bg-purple-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
              <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">or</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
            </div>

            {/* Google Sign In - for instructors to enable Google Meet */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg py-2.5 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <button
              type="button"
              onClick={handleMagicLink}
              disabled={magicSending}
              className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg py-2.5 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-60"
            >
              {magicSending ? "Sending link..." : magicSent ? "Link sent! Check your email" : "Email me a sign-in link"}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Instructors: Sign in with Google to enable Google Meet for your classes.
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/auth/student-login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg"
            >
              🎮 Student? Click here to login
            </Link>
          </div>

          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <Link href="/auth/forgot-password" className="hover:text-slate-700 dark:hover:text-slate-300">
              Forgot password?
            </Link>
            <div className="flex items-center gap-1">
              <span>Need an account?</span>
              <Link href="/auth/register" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
