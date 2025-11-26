import Link from "next/link";
import Section from "../../../components/ui/Section";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-slate-800 flex items-center">
      <div className="max-w-md mx-auto px-4 py-10 w-full">
        <Section title="Join Our Coding Kiddos" subtitle="Create a parent account to get started" color="mint">
          <form className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Name
              <input
                type="text"
                placeholder="Your name"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                type="password"
                placeholder="Create a password"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-emerald-500 text-white font-semibold rounded-xl py-2 shadow hover:bg-emerald-600"
            >
              Create parent account
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
