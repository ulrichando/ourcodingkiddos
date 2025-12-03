import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Logo placeholder */}
          <div className="flex justify-center">
            <Skeleton className="h-12 w-12 rounded-xl bg-purple-200" />
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <Skeleton className="h-7 w-40 mx-auto bg-slate-200" />
            <Skeleton className="h-4 w-56 mx-auto bg-slate-100" />
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-slate-100" />
              <Skeleton className="h-12 w-full rounded-lg bg-slate-100" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-slate-100" />
              <Skeleton className="h-12 w-full rounded-lg bg-slate-100" />
            </div>
          </div>

          {/* Button */}
          <Skeleton className="h-12 w-full rounded-full bg-purple-200" />

          {/* Footer links */}
          <div className="flex justify-center gap-4">
            <Skeleton className="h-4 w-24 bg-slate-100" />
            <Skeleton className="h-4 w-20 bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
