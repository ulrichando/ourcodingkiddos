"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const emailValue = email.trim().toLowerCase();
    const passwordValue = password;

    if (!emailValue || !passwordValue) {
      setError("Please enter your email and password");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: emailValue,
        password: passwordValue,
      });
      if (res?.error) throw new Error("Wrong email or password. Try again!");
      const session = await getSession();
      const sessionRole = typeof (session?.user as any)?.role === "string"
        ? ((session?.user as any)?.role as string).toUpperCase()
        : null;

      if (sessionRole !== "STUDENT") {
        throw new Error("This login is for students only. Parents and instructors should use the main login.");
      }

      router.push("/dashboard/student");
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900 dark:via-slate-900 dark:to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-4 border-purple-200 dark:border-purple-700 p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white text-4xl flex items-center justify-center shadow-lg animate-bounce">
              🚀
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Student Login
            </h1>
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Ready to code?
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-purple-700 dark:text-purple-300">
                Your Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full rounded-xl border-2 border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-purple-300 dark:placeholder:text-purple-500 px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 focus:border-purple-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-purple-700 dark:text-purple-300">
                Your Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your secret password"
                  className="w-full rounded-xl border-2 border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-purple-300 dark:placeholder:text-purple-500 px-4 py-3 pr-12 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 focus:border-purple-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 rounded-xl p-3">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold rounded-xl py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-60 disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">🌀</span> Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Let&apos;s Go! 🎮
                </span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-purple-100 dark:border-purple-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">
              Ask your parent for your login details!
            </p>
            <Link
              href="/auth/login"
              className="block text-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
            >
              Parent or Instructor? Sign in here →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
