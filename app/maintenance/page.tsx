"use client";

import { useEffect, useState } from "react";
import { Settings, Wrench, Clock, RefreshCw, AlertTriangle, Code2, Sparkles } from "lucide-react";
import Link from "next/link";

type MaintenanceStatus = {
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  maintenanceEndTime: string | null;
  siteName: string;
};

type CountdownTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(endTime: string | null): CountdownTime | null {
  if (!endTime) return null;

  const difference = new Date(endTime).getTime() - Date.now();

  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 blur-lg opacity-30 rounded-2xl" />
        <div className="relative bg-white dark:bg-slate-800 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl border border-purple-200 dark:border-purple-700 shadow-lg min-w-[70px] sm:min-w-[90px]">
          <span className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {String(value).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="mt-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function MaintenancePage() {
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);
  const [countdown, setCountdown] = useState<CountdownTime | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch maintenance status
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/maintenance/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
          setCountdown(calculateTimeLeft(data.maintenanceEndTime));
        }
      } catch (error) {
        console.error("Failed to fetch maintenance status:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
    // Refresh status every 30 seconds
    const statusInterval = setInterval(fetchStatus, 30000);
    return () => clearInterval(statusInterval);
  }, []);

  // Update countdown every second
  useEffect(() => {
    if (!status?.maintenanceEndTime) return;

    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft(status.maintenanceEndTime);
      setCountdown(timeLeft);

      // If countdown finished, refresh the page to check if maintenance is over
      if (!timeLeft) {
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status?.maintenanceEndTime]);

  // If not in maintenance mode, redirect to home
  useEffect(() => {
    if (!loading && status && !status.maintenanceMode) {
      window.location.href = "/";
    }
  }, [loading, status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200 dark:bg-orange-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-3xl w-full text-center space-y-8">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-50 rounded-full animate-pulse" />
            <div className="relative bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-full shadow-2xl border-4 border-purple-200 dark:border-purple-700">
              <div className="relative">
                <Wrench className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 dark:text-purple-400" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
              Scheduled Maintenance
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            We'll Be Right Back!
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            {status?.maintenanceMessage ||
              "We're currently performing scheduled maintenance to improve your learning experience. Hang tight, young coders!"}
          </p>
        </div>

        {/* Countdown Timer */}
        {countdown && (
          <div className="py-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Estimated Time Remaining
              </span>
            </div>
            <div className="flex justify-center gap-2 sm:gap-4">
              {countdown.days > 0 && (
                <CountdownUnit value={countdown.days} label="Days" />
              )}
              <CountdownUnit value={countdown.hours} label="Hours" />
              <CountdownUnit value={countdown.minutes} label="Minutes" />
              <CountdownUnit value={countdown.seconds} label="Seconds" />
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
              What's happening?
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Our team is working hard to bring you new features, improved performance, and a better coding experience.
            We'll be back online as soon as possible!
          </p>

          {/* Progress indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Updating</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/30 rounded-xl">
              <div className="p-2 bg-pink-100 dark:bg-pink-800 rounded-lg">
                <Wrench className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 dark:text-slate-400">Phase</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Maintenance</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
              <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
                <RefreshCw className="w-4 h-4 text-orange-600 dark:text-orange-400 animate-spin" style={{ animationDuration: '2s' }} />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 dark:text-slate-400">Progress</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">In Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full border border-yellow-200 dark:border-yellow-800">
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Maintenance in Progress
            </span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            This page will automatically refresh when we're back online.
          </p>
        </div>

        {/* Branding */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {status?.siteName || "Our Coding Kiddos"}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Teaching kids to code, one line at a time
          </p>
        </div>
      </div>
    </div>
  );
}
