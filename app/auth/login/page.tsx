"use client";

import Link from "next/link";
import Section from "../../../components/ui/Section";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      if (res?.error) {
        throw new Error(res.error);
      }
      router.push("/dashboard/parent");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 text-slate-800 flex items-center">
      <div className="max-w-md mx-auto px-4 py-10 w-full">
        <Section title="Welcome back" subtitle="Log in as a parent, student, or instructor" color="sky">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 text-white font-semibold rounded-xl py-2 shadow hover:bg-sky-600 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
            <button
              type="button"
              className="w-full bg-white border border-slate-200 text-slate-800 font-semibold rounded-xl py-2 shadow-sm hover:bg-slate-50"
              onClick={() => signIn("google", { callbackUrl: "/dashboard/parent" })}
            >
              Continue with Google
            </button>
            <div className="flex justify-between text-sm text-slate-600">
              <Link href="/auth/register" className="font-semibold text-sky-700">
                Create account
              </Link>
              <Link href="#" className="font-semibold text-slate-600">
                Forgot password?
              </Link>
            </div>
          </form>
        </Section>
      </div>
    </main>
  );
}
