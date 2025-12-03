import { Skeleton } from "@/components/ui/Skeleton";

export default function LessonLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Lesson header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-3 w-32 mt-1" />
            </div>
            <Skeleton className="h-2 w-48 rounded-full" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video/content placeholder */}
            <Skeleton className="aspect-video w-full rounded-xl" />

            {/* Lesson content */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
              <Skeleton className="h-7 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Code block placeholder */}
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 space-y-2">
                <Skeleton className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700" />
                <Skeleton className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700" />
                <Skeleton className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
