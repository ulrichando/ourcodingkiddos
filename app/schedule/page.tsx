import { Suspense } from "react";
import ScheduleRedirectContent from "./ScheduleRedirectContent";
import { Loader2 } from "lucide-react";

function RedirectLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

export default function ScheduleRedirectPage() {
  return (
    <Suspense fallback={<RedirectLoadingFallback />}>
      <ScheduleRedirectContent />
    </Suspense>
  );
}
