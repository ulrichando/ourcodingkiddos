import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentDashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Header skeleton */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-full" />
            <div className="flex-1 text-center md:text-left space-y-2">
              <Skeleton className="h-4 w-24 mx-auto md:mx-0" />
              <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-40 mx-auto md:mx-0" />
            </div>
            <div className="flex flex-row md:flex-col gap-3">
              <Skeleton className="h-16 w-28 rounded-2xl" />
              <Skeleton className="h-16 w-28 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Level Progress skeleton */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-6 w-20 ml-auto" />
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>
          </div>
          <Skeleton className="h-6 w-full rounded-full" />
        </div>

        {/* Daily Challenges skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Learning skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-44" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                <Skeleton className="h-2 w-full" />
                <div className="p-5 flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-28 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-center">
              <Skeleton className="w-14 h-14 mx-auto mb-3 rounded-2xl" />
              <Skeleton className="h-10 w-12 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
