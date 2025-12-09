"use client";

import { useState, useCallback, useEffect, useRef, memo } from "react";
import { usePathname } from "next/navigation";
import { Clock, X } from "lucide-react";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";

// 30 minutes inactivity timeout, 2 minute warning
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
const WARNING_TIME = 2 * 60 * 1000;
const WARNING_SECONDS = Math.floor(WARNING_TIME / 1000);

function InactivityWarning() {
  const pathname = usePathname();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_SECONDS);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Don't enable on auth pages or public pages
  const isAuthPage = pathname?.startsWith("/auth");
  const isPublicPage = !pathname?.startsWith("/dashboard") && !pathname?.startsWith("/settings");
  const shouldEnable = !isAuthPage && !isPublicPage;

  // Cleanup countdown interval
  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const handleWarning = useCallback(() => {
    startTimeRef.current = Date.now();
    setCountdown(WARNING_SECONDS);
    setShowWarning(true);
  }, []);

  const handleLogout = useCallback(() => {
    clearCountdown();
    setShowWarning(false);
  }, [clearCountdown]);

  const { resetTimer, getTimeRemaining } = useInactivityLogout({
    timeout: INACTIVITY_TIMEOUT,
    warningTime: WARNING_TIME,
    onWarning: handleWarning,
    onLogout: handleLogout,
    enabled: shouldEnable,
  });

  // Countdown timer - uses actual time elapsed for accuracy
  useEffect(() => {
    if (!showWarning) {
      clearCountdown();
      return;
    }

    // Calculate countdown based on actual remaining time
    const updateCountdown = () => {
      const remaining = getTimeRemaining();
      const seconds = Math.max(0, Math.ceil(remaining / 1000));
      setCountdown(seconds);

      if (seconds <= 0) {
        clearCountdown();
      }
    };

    // Initial update
    updateCountdown();

    // Update every second
    countdownRef.current = setInterval(updateCountdown, 1000);

    return clearCountdown;
  }, [showWarning, getTimeRemaining, clearCountdown]);

  // Handle "Stay Logged In" click
  const handleStayLoggedIn = useCallback(() => {
    clearCountdown();
    setShowWarning(false);
    setCountdown(WARNING_SECONDS);
    resetTimer();
  }, [resetTimer, clearCountdown]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    setShowWarning(false);
    // Let the timeout handle the logout
  }, []);

  if (!showWarning) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const progressPercent = Math.max(0, (countdown / WARNING_SECONDS) * 100);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      style={{ animation: "fadeIn 200ms ease-out" }}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        style={{ animation: "zoomIn 200ms ease-out" }}
      >
        {/* Header */}
        <div className="bg-amber-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Session Expiring Soon</h2>
              <p className="text-sm text-white/80">You&apos;ve been inactive</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <div className="text-5xl font-bold text-slate-900 dark:text-white tabular-nums">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              until automatic logout
            </p>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-6">
            For your security, you&apos;ll be logged out due to inactivity.
            Click below to stay logged in.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleStayLoggedIn}
              className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
            >
              Stay Logged In
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium rounded-xl transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full bg-amber-500 transition-[width] duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(InactivityWarning);
