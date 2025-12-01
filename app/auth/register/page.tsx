"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"parent" | "instructor">("parent");

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
        body: JSON.stringify({ name, email, password, role }),
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
      const destination = role === "instructor" ? "/dashboard/instructor" : "/dashboard/parent";
      router.push(destination);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create your account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Select your role and sign up</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              type="button"
              onClick={() => setRole("parent")}
              className={`rounded-lg border px-3 py-2 font-semibold transition ${
                role === "parent"
                  ? "border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              Parent
              <p className="text-xs font-normal text-slate-500 dark:text-slate-400">Add students & manage billing</p>
            </button>
            <button
              type="button"
              onClick={() => setRole("instructor")}
              className={`rounded-lg border px-3 py-2 font-semibold transition ${
                role === "instructor"
                  ? "border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              Instructor
              <p className="text-xs font-normal text-slate-500 dark:text-slate-400">Teach classes & content</p>
            </button>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Name
              <input
                name="name"
                required
                type="text"
                placeholder="Your name"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email
              <input
                name="email"
                required
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
              <input
                name="password"
                required
                minLength={6}
                type="password"
                placeholder="Create a password"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600"
              />
            </label>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg py-2.5 shadow-sm hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-60"
            >
              {loading ? "Creating..." : role === "instructor" ? "Create instructor account" : "Create parent account"}
            </button>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-purple-700 dark:text-purple-400">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
