import { Suspense } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import CoursesList from './CoursesList';
import { BookOpen } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';




export const revalidate = 0;

/**
 * Admin Courses Page - Server Component
 *
 * Architecture:
 * - This page is a Server Component (no "use client")
 * - CoursesList fetches data on the server (direct DB access)
 * - CoursesClient handles interactivity (search, filters, buttons)
 * - Suspense provides loading state during server fetch
 *
 * Benefits:
 * - Zero caching issues (always fresh server data)
 * - Faster initial load (no API waterfall)
 * - Smaller JavaScript bundle
 * - Better SEO
 * - Simpler architecture
 */
export default function AdminCoursesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<CoursesLoadingSkeleton />}>
        <CoursesList />
      </Suspense>
    </AdminLayout>
  );
}

/**
 * Loading skeleton shown while server fetches course data
 */
function CoursesLoadingSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-40 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-lg animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Courses Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-200 dark:bg-purple-800 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-6 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 space-y-1">
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <div className="flex-1 h-9 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse"></div>
              <div className="flex-1 h-9 bg-blue-100 dark:bg-blue-900/20 rounded-lg animate-pulse"></div>
              <div className="flex-1 h-9 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm">Loading courses from database...</span>
        </div>
      </div>
    </main>
  );
}
