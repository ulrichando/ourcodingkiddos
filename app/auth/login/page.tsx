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

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
              <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">or</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
            </div>
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={magicSending}
              className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg py-2.5 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-60"
            >
              {magicSending ? "Sending link..." : magicSent ? "Link sent! Check your email" : "Email me a sign-in link"}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              We'll send a magic link to your inbox. The link expires in 24 hours.
            </p>
          </div>

          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <Link href="#" className="hover:text-slate-700 dark:hover:text-slate-300">
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
