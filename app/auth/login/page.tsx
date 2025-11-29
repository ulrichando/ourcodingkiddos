"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"parent" | "instructor" | "student">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicSending, setMagicSending] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const destination = useMemo(
    () => {
      if (role === "instructor") return "/dashboard/instructor";
      if (role === "student") return "/dashboard/student";
      return "/dashboard/parent";
    },
    [role]
  );

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
        callbackUrl: destination,
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
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center shadow-lg">
              CK
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome to Coding Kiddos</h1>
            <p className="text-sm text-slate-500">Choose your role and sign in</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`rounded-lg border px-3 py-2 font-semibold transition ${
                role === "student"
                  ? "border-purple-300 bg-purple-50 text-purple-700"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              Student
              <p className="text-xs font-normal text-slate-500">Learn & earn XP</p>
            </button>
            <button
              type="button"
              onClick={() => setRole("parent")}
              className={`rounded-lg border px-3 py-2 font-semibold transition ${
                role === "parent"
                  ? "border-purple-300 bg-purple-50 text-purple-700"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              Parent
              <p className="text-xs font-normal text-slate-500">Manage students & billing</p>
            </button>
            <button
              type="button"
              onClick={() => setRole("instructor")}
              className={`rounded-lg border px-3 py-2 font-semibold transition ${
                role === "instructor"
                  ? "border-purple-300 bg-purple-50 text-purple-700"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              Instructor
              <p className="text-xs font-normal text-slate-500">Teach classes & content</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-semibold rounded-lg py-2.5 shadow-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase tracking-wide text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={magicSending}
              className="w-full border border-slate-200 bg-white text-slate-800 font-semibold rounded-lg py-2.5 shadow-sm hover:bg-slate-50 disabled:opacity-60"
            >
              {magicSending ? "Sending link..." : magicSent ? "Link sent! Check your email" : "Email me a sign-in link"}
            </button>
            <p className="text-xs text-slate-500 text-center">
              We’ll send a magic link to your inbox. The link expires in 24 hours.
            </p>
          </div>

          <div className="flex justify-between text-xs text-slate-500">
            <Link href="#" className="hover:text-slate-700">
              Forgot password?
            </Link>
            <div className="flex items-center gap-1">
              <span>Need an account?</span>
              <Link href="/auth/register" className="text-purple-600 font-semibold hover:text-purple-700">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
