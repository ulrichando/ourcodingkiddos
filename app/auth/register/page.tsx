"use client";

import Link from "next/link";
import Section from "../../../components/ui/Section";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Registration failed");
      }

      // Auto sign-in after register
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
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
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-slate-800 flex items-center">
      <div className="max-w-md mx-auto px-4 py-10 w-full">
        <Section title="Join Our Coding Kiddos" subtitle="Create a parent account to get started" color="mint">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700">
              Name
              <input
                name="name"
                required
                type="text"
                placeholder="Your name"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input
                name="email"
                required
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                name="password"
                required
                minLength={6}
                type="password"
                placeholder="Create a password"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white font-semibold rounded-xl py-2 shadow hover:bg-emerald-600 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create parent account"}
            </button>
            <p className="text-sm text-slate-600 text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-emerald-700">
                Log in
              </Link>
            </p>
          </form>
        </Section>
      </div>
    </main>
  );
}
