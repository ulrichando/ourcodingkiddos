"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, Loader2, Rocket, User, Lock } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Clear inactivity localStorage on page load to ensure fresh session
  useEffect(() => {
    try {
      localStorage.removeItem("lastActivityTime");
      localStorage.removeItem("forceLogout");
    } catch {
      // localStorage not available
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inputValue = username.trim().toLowerCase();
    const passwordValue = password;

    if (!inputValue || !passwordValue) {
      setError("Please enter your username and password");
      return;
    }

    // Check if input looks like an email (for existing students) or username (for new students)
    const isEmail = inputValue.includes("@");
    let emailValue: string;

    if (isEmail) {
      // Existing student with real email
      emailValue = inputValue;
    } else {
      // New student with username - convert to pseudo-email
      const usernameValue = inputValue.replace(/[^a-z0-9]/g, "");
      emailValue = `${usernameValue}@student.ourcodingkiddos.local`;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: emailValue,
        password: passwordValue,
      });
      if (res?.error) throw new Error("Wrong username/email or password. Try again!");

      // Clear inactivity localStorage to prevent immediate logout
      try {
        localStorage.removeItem("lastActivityTime");
        localStorage.removeItem("forceLogout");
        localStorage.setItem("lastActivityTime", Date.now().toString());
      } catch {}

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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Fun colorful background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-cyan-100 dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-900" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300/50 dark:bg-purple-900/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-300/50 dark:bg-pink-900/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-cyan-300/40 dark:bg-cyan-900/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative animate-fade-in-up">
        <div className="bg-white dark:bg-slate-800/90 dark:backdrop-blur-sm rounded-2xl shadow-xl shadow-purple-200/50 dark:shadow-slate-900/50 border-2 border-purple-200/50 dark:border-purple-700/30 p-8 space-y-6">
          {/* Fun header with animated rocket */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 relative overflow-hidden">
              <Rocket className="w-10 h-10 animate-bounce" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/30" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Student Login
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Ready to code?
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username/Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-purple-700 dark:text-purple-300">
                Your Username or Email
              </label>
              <div className={`relative flex items-center border-2 rounded-xl transition-all duration-200 ${
                focusedField === "username"
                  ? "ring-2 ring-purple-400/50 border-purple-400 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-900/20"
                  : "border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-purple-50/30 dark:bg-slate-800"
              }`}>
                <User className={`w-5 h-5 ml-3 transition-colors ${focusedField === "username" ? "text-purple-500" : "text-purple-400"}`} />
                <input
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="coder123 or email@example.com"
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-purple-300 dark:placeholder:text-purple-600 px-3 py-3.5 text-base focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-purple-700 dark:text-purple-300">
                Your Password
              </label>
              <div className={`relative flex items-center border-2 rounded-xl transition-all duration-200 ${
                focusedField === "password"
                  ? "ring-2 ring-purple-400/50 border-purple-400 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-900/20"
                  : "border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-purple-50/30 dark:bg-slate-800"
              }`}>
                <Lock className={`w-5 h-5 ml-3 transition-colors ${focusedField === "password" ? "text-purple-500" : "text-purple-400"}`} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Your secret password"
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-purple-300 dark:placeholder:text-purple-600 px-3 py-3.5 text-base focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 mr-1 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button - Fun and colorful */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold rounded-xl py-4 text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Let&apos;s Go!
                  <span className="text-xl">🎮</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-purple-100 dark:border-purple-800/50 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Ask your parent for your login details!
            </p>
            <Link
              href="/auth/login"
              className="block text-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              Parent or Instructor? Sign in here →
            </Link>
          </div>
        </div>

        {/* Fun badge */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <span className="text-lg">🌟</span>
            Learn to code, one adventure at a time!
            <span className="text-lg">🌟</span>
          </p>
        </div>
      </div>
    </main>
  );
}
