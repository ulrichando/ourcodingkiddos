import { Settings, Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-50 rounded-full" />
            <div className="relative bg-white dark:bg-slate-800 p-8 rounded-full shadow-xl border-4 border-purple-200 dark:border-purple-700">
              <Wrench className="w-16 h-16 text-purple-600 dark:text-purple-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Under Maintenance
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
            We're currently performing scheduled maintenance to improve your experience.
          </p>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              What's happening?
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Our team is working hard to make improvements to the platform.
            We'll be back shortly with enhanced features and better performance!
          </p>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Maintenance in Progress
            </span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please check back soon. Thank you for your patience!
          </p>
        </div>

        {/* Branding */}
        <div className="pt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Our Coding Kiddos
          </p>
        </div>
      </div>
    </div>
  );
}
