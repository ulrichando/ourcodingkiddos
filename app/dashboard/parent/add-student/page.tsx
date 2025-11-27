"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Sparkles } from "lucide-react";
import Button from "../../../../components/ui/button";
import { useSession } from "next-auth/react";

const avatars = ["🦊", "🐼", "🦁", "🐯", "🐸", "🦉", "🐙", "🦄", "🐲", "🤖", "👾", "🎮"];
const ageOptions = ["7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"];

export default function AddStudentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [accessibility, setAccessibility] = useState({
    dyslexia_font: false,
    high_contrast: false,
    larger_text: false,
  });

  const ageGroup = age ? (Number(age) <= 10 ? "AGES_7_10" : Number(age) <= 14 ? "AGES_11_14" : "AGES_15_18") : null;

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          username,
          password,
          age: Number(age),
          ageGroup,
          avatar,
          parentEmail: session?.user?.email ?? "",
          accessibility,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Could not create student");
      const creds = json?.credentials;
      setSuccess(
        creds
          ? `Student created. Username: ${creds.username} • Password: ${creds.password}`
          : "Student account created. Share credentials to log in."
      );
      setTimeout(() => router.push("/dashboard/parent"), 1200);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7ecff,_#ffffff_45%)] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center shadow-lg">
              <User className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Add a New Student</h1>
            <p className="text-sm text-slate-500">Create a profile for your child to start their coding journey</p>
            <p className="text-xs text-slate-400">0 of 1 student slots used</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm font-semibold text-slate-700 space-y-1 md:col-span-2">
              Student&apos;s First Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter first name"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700 space-y-1">
              Username (for student login)
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., emma2024"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700 space-y-1">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g., coder123"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </label>
            <p className="md:col-span-2 text-xs text-slate-500">
              Share these credentials with your child to log in to the Student portal
            </p>

            <label className="text-sm font-semibold text-slate-700 space-y-1 md:col-span-2">
              Age
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
              >
                <option value="">Select age</option>
                {ageOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">Choose an Avatar</p>
            <div className="grid grid-cols-8 gap-2">
              {avatars.map((av) => {
                const active = av === avatar;
                return (
                  <button
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`h-12 w-12 rounded-xl border flex items-center justify-center text-2xl ${
                      active ? "border-purple-400 bg-purple-50 shadow-[0_0_0_3px_rgba(168,85,247,0.3)]" : "border-slate-200 bg-slate-50"
                    }`}
                    aria-label={`Select avatar ${av}`}
                  >
                    {av}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">Accessibility Options</p>
            {[
              { key: "dyslexia_font", label: "Dyslexia-friendly font", desc: "Uses OpenDyslexic font" },
              { key: "high_contrast", label: "High contrast mode", desc: "Increases color contrast" },
              { key: "larger_text", label: "Larger text", desc: "Increases font size" },
            ].map((opt) => (
              <div key={opt.key} className="flex items-center justify-between border-b last:border-b-0 border-slate-100 py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                  <p className="text-xs text-slate-500">{opt.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={(accessibility as any)[opt.key]}
                    onChange={(e) => setAccessibility((prev) => ({ ...prev, [opt.key]: e.target.checked }))}
                  />
                  <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500 transition flex items-center px-1">
                    <span className="w-5 h-5 bg-white rounded-full shadow transform transition peer-checked:translate-x-5" />
                  </div>
                </label>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}

          <Button
            onClick={handleSubmit}
            disabled={loading || !name || !age}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "Creating..." : "Add Student"}
          </Button>
        </div>
      </div>
    </main>
  );
}
