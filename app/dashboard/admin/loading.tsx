import { Loader2 } from "lucide-react";

/**
 * Admin Dashboard Loading State
 *
 * This file enables:
 * 1. Partial prefetching - Next.js prefetches up to this loading boundary
 * 2. Instant navigation - Users see this immediately while page loads
 * 3. Better UX - No blank screen during navigation
 */
export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
