"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Award, CheckCircle, GraduationCap } from "lucide-react";

export default function InstructorRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nameValue = name.trim();
    const emailValue = email.trim().toLowerCase();
    const passwordValue = password;
    const resumeUrlValue = resumeUrl.trim();

    // Validate consent checkbox
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    // Validate resume URL
    if (!resumeUrlValue) {
      setError("Please provide a link to your resume/CV.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameValue,
          email: emailValue,
          password: passwordValue,
          role: "INSTRUCTOR",
          resumeUrl: resumeUrlValue
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      // Show success message instead of auto-login
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Success screen
  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative animate-fade-in-up">
          <div className="bg-white dark:bg-slate-800/90 dark:backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 p-8 space-y-6 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Application Submitted!</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Thank you for applying to become an instructor at Coding Kiddos. Your application is now pending admin approval.
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-left space-y-2">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">What happens next?</p>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Check your email to verify your address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Our admin team will review your application</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>You'll receive an email once your account is approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>After approval, you can log in and start teaching</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 active:scale-[0.98]"
              >
                Go to Login
              </Link>
              <Link
                href="/"
                className="block text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative animate-fade-in-up">
        <div className="bg-white dark:bg-slate-800/90 dark:backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 p-8 space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold flex items-center justify-center shadow-lg shadow-purple-500/30 text-lg">
              CK
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Become an Instructor</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Apply to teach coding to the next generation</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm text-purple-900 dark:text-purple-100">
                <p className="font-semibold mb-1">Application Process</p>
                <p className="text-purple-700 dark:text-purple-300 text-xs">
                  After submitting your application, our admin team will review your credentials. You'll be notified by email once approved.
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                focusedField === "name"
                  ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              }`}>
                <User className={`w-4 h-4 ml-3 transition-colors ${focusedField === "name" ? "text-purple-500" : "text-slate-400"}`} />
                <input
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                focusedField === "email"
                  ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              }`}>
                <Mail className={`w-4 h-4 ml-3 transition-colors ${focusedField === "email" ? "text-purple-500" : "text-slate-400"}`} />
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="instructor@example.com"
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                focusedField === "password"
                  ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              }`}>
                <Lock className={`w-4 h-4 ml-3 transition-colors ${focusedField === "password" ? "text-purple-500" : "text-slate-400"}`} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a password (min 8 characters)"
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Resume URL Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Resume/CV Link <span className="text-red-500">*</span>
              </label>
              <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                focusedField === "resume"
                  ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              }`}>
                <svg className={`w-4 h-4 ml-3 transition-colors ${focusedField === "resume" ? "text-purple-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <input
                  name="resumeUrl"
                  type="url"
                  required
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  onFocus={() => setFocusedField("resume")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="https://drive.google.com/... or https://dropbox.com/..."
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm focus:outline-none"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload your resume to Google Drive, Dropbox, or similar and paste the sharing link here
              </p>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 peer-checked:border-purple-500 peer-checked:bg-purple-500 transition-all flex items-center justify-center">
                    {agreedToTerms && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting application...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-medium">or continue with</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Google OAuth Section with Resume Input */}
          <div className="space-y-3">
            {/* Resume URL for Google OAuth */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Resume/CV Link (Required for Google Sign-Up) <span className="text-red-500">*</span>
              </label>
              <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                focusedField === "google-resume"
                  ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              }`}>
                <svg className={`w-4 h-4 ml-3 transition-colors ${focusedField === "google-resume" ? "text-purple-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <input
                  name="googleResumeUrl"
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  onFocus={() => setFocusedField("google-resume")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="https://drive.google.com/... or https://dropbox.com/..."
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm focus:outline-none"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provide your resume link before signing up with Google
              </p>
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={async () => {
                // Validate resume URL
                const resumeUrlValue = resumeUrl.trim();
                if (!resumeUrlValue) {
                  setError("Please provide a resume/CV link before signing up with Google.");
                  return;
                }

                setError(null);
                try {
                  // Get an instructor intent token from the server
                  const res = await fetch("/api/auth/mark-instructor-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resumeUrl: resumeUrlValue }),
                  });
                  const data = await res.json();

                  if (data.token) {
                    // Store the token in a cookie (10 minutes expiry)
                    document.cookie = `instructor_intent_token=${data.token}; path=/; max-age=600; SameSite=Lax`;
                    signIn("google", { callbackUrl: "/auth/login" });
                  } else {
                    setError("Failed to initiate Google sign-up. Please try again.");
                  }
                } catch (err) {
                  console.error("Failed to mark instructor intent:", err);
                  setError("Failed to initiate Google sign-up. Please try again.");
                }
              }}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium rounded-xl py-3 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Apply with Google
            </button>

            {/* Google OAuth Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> Your application will be set to pending status and require admin approval before you can access the platform.
              </p>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </p>

          {/* Parent Registration Link */}
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Are you a parent?{" "}
            <Link href="/auth/register" className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
              Register as a parent
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">Join Our Team</p>
              <p className="text-[10px] text-purple-600 dark:text-purple-400">Inspire the next generation of coders</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
