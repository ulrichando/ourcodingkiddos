"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"parent" | "instructor">("parent");

  const destination = useMemo(
    () => (role === "instructor" ? "/dashboard/instructor" : "/dashboard/parent"),
    [role]
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) throw new Error(res.error);
      router.push(destination);
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
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

          <div className="grid grid-cols-2 gap-2 text-sm">
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

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: destination })}
            className="w-full inline-flex items-center justify-center gap-3 border border-slate-200 rounded-lg py-2.5 text-slate-700 font-semibold hover:bg-slate-50"
          >
            <span className="h-5 w-5 rounded-full bg-white shadow ring-1 ring-slate-200 flex items-center justify-center text-lg font-bold text-red-500">
              G
            </span>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            OR
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                required
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
