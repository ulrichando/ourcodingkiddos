"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlertCircle, Clock, Mail } from "lucide-react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  // Check if this is a pending instructor error
  const isPendingInstructor = error?.includes("pending approval") || error?.includes("pending");

  if (isPendingInstructor) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative">
          <div className="bg-white dark:bg-slate-800/90 dark:backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 p-8 space-y-6 text-center">
            {/* Pending Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Application Pending
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Your instructor application is currently under review
              </p>
            </div>

            {/* Message */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3 text-left">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    What happens next?
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• An admin will review your application and resume</li>
                    <li>• You'll receive an email once approved</li>
                    <li>• After approval, you can log in and start teaching</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <p>
                <strong className="text-slate-700 dark:text-slate-300">Note:</strong> Review typically takes 24-48 hours
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Link
                href="/"
                className="block w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/25"
              >
                Back to Homepage
              </Link>
              <Link
                href="/contact"
                className="block w-full px-6 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Generic error page for other errors
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 space-y-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Authentication Error
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {error || "An error occurred during authentication"}
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Link
              href="/auth/login"
              className="block w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Back to Login
            </Link>
            <Link
              href="/contact"
              className="block w-full px-6 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </main>
    }>
      <ErrorContent />
    </Suspense>
  );
}
