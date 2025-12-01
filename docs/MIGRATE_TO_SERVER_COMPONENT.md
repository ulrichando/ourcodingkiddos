# Migrate Courses Page to Server Component

## Why Server Components?

### Current (Client Component) Issues:
- ❌ Data fetches on client (slower)
- ❌ Multiple cache layers cause sync issues
- ❌ Manual state management with useState
- ❌ Waterfall loading pattern
- ❌ Larger JavaScript bundle
- ❌ SEO challenges

### Server Component Benefits:
- ✅ Data fetches on server (faster)
- ✅ Direct database access (no API route needed)
- ✅ Automatic cache revalidation
- ✅ Zero JavaScript for data fetching
- ✅ Better SEO
- ✅ Simpler code

---

## Implementation

### Step 1: Create Server Component for Data

Create a new file for the server component that fetches data:

```tsx
// app/dashboard/admin/courses/CoursesList.tsx (Server Component)
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CoursesClient from './CoursesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CoursesList() {
  // 1. Check authentication server-side
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role?.toUpperCase();

  if (!session?.user || (role !== 'ADMIN' && role !== 'INSTRUCTOR')) {
    redirect('/auth/signin');
  }

  // 2. Fetch courses directly from database (no API call!)
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      lessons: {
        select: { id: true, title: true, slug: true, orderIndex: true }
      }
    }
  });

  // 3. Transform data
  const transformedCourses = courses.map(course => ({
    ...course,
    _count: {
      lessons: course.lessons?.length || 0
    }
  }));

  // 4. Pass to client component for interactivity
  return <CoursesClient initialCourses={transformedCourses} />;
}
```

### Step 2: Create Client Component for Interactivity

```tsx
// app/dashboard/admin/courses/CoursesClient.tsx (Client Component)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleCoursePublishStatus } from './actions';

type Course = {
  id: string;
  title: string;
  description?: string | null;
  language: string;
  level: string;
  ageGroup: string;
  isPublished: boolean;
  totalXp?: number | null;
  _count?: { lessons: number };
};

interface CoursesClientProps {
  initialCourses: Course[];
}

export default function CoursesClient({ initialCourses }: CoursesClientProps) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);

  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'publish' : 'unpublish';

    if (updatingCourseId) return;
    setUpdatingCourseId(courseId);

    try {
      // Call server action
      const result = await toggleCoursePublishStatus(courseId, newStatus);

      if (result.success) {
        // Optimistic update
        setCourses(prev =>
          prev.map(c =>
            c.id === courseId ? { ...c, isPublished: newStatus } : c
          )
        );

        // Force router refresh to get fresh server data
        router.refresh();

        alert(`Course ${action}ed successfully!`);
      } else {
        alert(`Failed to ${action}: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to ${action} course`);
    } finally {
      setUpdatingCourseId(null);
    }
  };

  // ... rest of your filtering and rendering logic ...

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchTerm === '' ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || course.language === filterLanguage;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && course.isPublished) ||
      (filterStatus === 'draft' && !course.isPublished);
    return matchesSearch && matchesLanguage && matchesLevel && matchesStatus;
  });

  return (
    <div>
      {/* Your existing UI code here */}
      {/* Just replace useState courses with the filtered courses */}
      {/* And use handleTogglePublish for the toggle buttons */}
    </div>
  );
}
```

### Step 3: Update Main Page

```tsx
// app/dashboard/admin/courses/page.tsx (Server Component)
import AdminLayout from '@/components/admin/AdminLayout';
import CoursesList from './CoursesList';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminCoursesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<CoursesLoadingSkeleton />}>
        <CoursesList />
      </Suspense>
    </AdminLayout>
  );
}

function CoursesLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Architecture Comparison

### Before (Current - Client Component)
```
Browser → Next.js → HTML shell
Browser → Run JavaScript
Browser → Fetch /api/courses
API Route → Prisma → Database
Database → API Route → Browser
Browser → Render courses
```
**Total:** 3+ round trips, client-side cache issues

### After (Server Component)
```
Browser → Next.js → Server Component
Server Component → Prisma → Database
Database → Server Component → HTML
Browser ← HTML with data
```
**Total:** 1 round trip, no client cache issues

---

## Benefits Summary

| Feature | Client Component | Server Component |
|---------|------------------|------------------|
| Initial Load | Slow (waterfall) | Fast (single request) |
| Data Freshness | Cache issues | Always fresh |
| JavaScript Bundle | Large | Small |
| SEO | Poor (no data) | Excellent |
| Code Complexity | High | Low |
| Cache Control | Manual | Automatic |
| Database Access | Via API | Direct |
| Type Safety | Partial | Full |

---

## Migration Steps

1. ✅ Keep Server Actions file ([actions.ts](../app/dashboard/admin/courses/actions.ts)) - already created
2. ⬜ Create `CoursesList.tsx` (Server Component for data)
3. ⬜ Create `CoursesClient.tsx` (Client Component for interactivity)
4. ⬜ Update `page.tsx` to use Server Component pattern
5. ⬜ Remove `/api/courses` route (no longer needed)
6. ⬜ Test thoroughly
7. ⬜ Deploy to production

---

## Testing Checklist

After migration:

- [ ] Page loads with courses data immediately
- [ ] Publish/unpublish works correctly
- [ ] No cache issues when toggling
- [ ] Search and filters work
- [ ] Loading skeleton shows during Suspense
- [ ] Direct database queries visible in logs
- [ ] No client-side API calls in Network tab
- [ ] Smaller JavaScript bundle (check DevTools)
- [ ] Faster initial page load (check Lighthouse)

---

## Rollback

If issues occur, you can instantly rollback:

1. Revert to current `page.tsx` implementation
2. Keep using `/api/courses` endpoint
3. Server Actions still work regardless

---

## When to Migrate

**Now (Recommended)**: Server Components are production-ready and solve your caching issues fundamentally.

**Later**: If you need time to test, the current `router.refresh()` fix will work for now.

---

## Next.js Best Practices (2024)

According to Next.js 13+ App Router best practices:

1. ✅ **Default to Server Components** (fetch on server)
2. ✅ **Use Client Components only when needed** (interactivity, useState, useEffect)
3. ✅ **Pass data as props** from Server to Client Components
4. ✅ **Use Server Actions** for mutations
5. ✅ **Use Suspense** for loading states

Your current all-client approach is the **old Pages Router pattern**. The App Router is designed for server-first rendering.

---

## Performance Impact

Expected improvements after migration:

- **Initial Load**: 40-60% faster (no JavaScript execution + API call)
- **Time to Interactive**: 30-50% faster (less JavaScript)
- **Cache Issues**: Eliminated (server-side rendering)
- **Lighthouse Score**: +10-20 points
- **Bundle Size**: -50KB+ (no client-side fetching code)

---

## Conclusion

Your courses are currently **dynamic but client-rendered**, which is causing the cache issues.

**Recommended approach**: Migrate to Server Components + Server Actions for a robust, production-grade solution that eliminates caching problems at the architectural level.

---

**Status**: Ready to implement
**Effort**: 1-2 hours
**Risk**: Low (easy rollback)
**Impact**: High (solves core issue permanently)
