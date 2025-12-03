"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Oops! Something went wrong
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified and is working on it.
          </p>
        </div>

        {/* Error Details (in development) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-left">
            <p className="text-sm font-mono text-red-800 dark:text-red-300 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="inline-flex items-center gap-2 w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </button>

        {/* Support Link */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Need help?{" "}
          <Link href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </main>
  );
}
