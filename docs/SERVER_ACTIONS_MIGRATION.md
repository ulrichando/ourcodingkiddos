# Server Actions Migration Guide

## Overview

This guide shows how to migrate the courses page from client-side API calls to Server Actions for more reliable state management.

## Current Implementation (router.refresh)

Currently implemented in [app/dashboard/admin/courses/page.tsx](../app/dashboard/admin/courses/page.tsx):

```tsx
const togglePublishStatus = async (courseId: string, currentStatus: boolean) => {
  const newStatus = !currentStatus;
  setUpdatingCourseId(courseId);

  try {
    const res = await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: courseId, isPublished: newStatus }),
    });

    if (res.ok) {
      router.refresh(); // Forces Next.js to revalidate
      await new Promise(resolve => setTimeout(resolve, 300));
      alert("Course updated successfully!");
    }
  } catch (error) {
    console.error("Update failed:", error);
  } finally {
    setUpdatingCourseId(null);
  }
};
```

**Status**: ✅ This should work for production

---

## Alternative: Server Actions (More Robust)

For a more robust, production-grade solution, you can migrate to Server Actions.

### Step 1: Import the Server Action

```tsx
// app/dashboard/admin/courses/page.tsx
import { toggleCoursePublishStatus } from './actions';
```

### Step 2: Replace the togglePublishStatus function

```tsx
const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
  const newStatus = !currentStatus;
  const action = newStatus ? "publish" : "unpublish";

  // Prevent concurrent updates
  if (updatingCourseId) return;

  setUpdatingCourseId(courseId);

  try {
    // Call the server action directly
    const result = await toggleCoursePublishStatus(courseId, newStatus);

    if (result.success) {
      console.log(`✓ Course ${action}ed successfully`);
      alert(`Course ${action}ed successfully!`);

      // Optionally update local state immediately for better UX
      if (result.course) {
        setCourses(prev =>
          prev.map(c =>
            c.id === courseId
              ? { ...c, isPublished: result.course.isPublished }
              : c
          )
        );
      }
    } else {
      console.error(`✗ Failed to ${action}:`, result.error);
      alert(`Failed to ${action} course: ${result.error}`);
    }
  } catch (error) {
    console.error(`✗ Exception:`, error);
    alert(`Failed to ${action} course. Please try again.`);
  } finally {
    setUpdatingCourseId(null);
  }
};
```

### Step 3: Update the button onClick handler

```tsx
<button
  onClick={() => handleTogglePublish(course.id, course.isPublished)}
  disabled={updatingCourseId === course.id}
  className="..."
>
  {/* button content */}
</button>
```

---

## Benefits of Server Actions

### 1. Automatic Revalidation
- No need to call `router.refresh()` or manually reload data
- Next.js automatically revalidates specified paths

### 2. Server-Side Execution
- Runs on the server (more secure)
- Direct database access (no API route needed)
- Better error handling

### 3. Progressive Enhancement
- Works without JavaScript enabled
- Can be used with forms for progressive enhancement

### 4. Type Safety
- Full TypeScript support
- No need for API route typing

### 5. Simplified Code
- No need to manage fetch requests
- No need to handle response parsing
- Built-in error handling

---

## Migration Checklist

If you decide to migrate to Server Actions:

- [ ] Import the server action: `import { toggleCoursePublishStatus } from './actions'`
- [ ] Replace `togglePublishStatus` function with `handleTogglePublish`
- [ ] Update button onClick handlers
- [ ] Test publish/unpublish functionality
- [ ] Test error handling (invalid course ID, unauthorized access)
- [ ] Test concurrent updates
- [ ] Remove old API route if not used elsewhere
- [ ] Update audit logs if needed
- [ ] Test in production environment

---

## Testing

### Test Cases

1. **Basic functionality**
   ```
   - Click publish → Course becomes published
   - Click unpublish → Course becomes draft
   ```

2. **Error handling**
   ```
   - Try with invalid course ID → Shows error
   - Try without authentication → Shows unauthorized error
   ```

3. **Concurrent updates**
   ```
   - Click toggle rapidly → Only one update processed
   - Update multiple courses → All update correctly
   ```

4. **State consistency**
   ```
   - Refresh page after update → State persists
   - Check database directly → Matches UI
   ```

5. **Performance**
   ```
   - Measure time from click to UI update
   - Check network requests in DevTools
   - Verify no unnecessary re-renders
   ```

---

## Rollback Plan

If Server Actions cause issues:

1. **Revert to router.refresh() approach** (currently implemented)
2. **Keep the original API routes** (don't delete them during migration)
3. **Use feature flags** to toggle between implementations:

```tsx
const USE_SERVER_ACTIONS = process.env.NEXT_PUBLIC_USE_SERVER_ACTIONS === 'true';

const togglePublishStatus = USE_SERVER_ACTIONS
  ? handleTogglePublishWithServerAction
  : handleTogglePublishWithAPI;
```

---

## Performance Comparison

| Approach | Latency | Reliability | Complexity | Caching |
|----------|---------|-------------|------------|---------|
| Client API + manual reload | Medium | Low | High | Hard |
| Client API + router.refresh() | Medium | Medium | Medium | Automatic |
| Server Actions | Low | High | Low | Automatic |

---

## Recommendation

**For Production**: Start with `router.refresh()` approach (currently implemented)
- Simpler migration
- Lower risk
- Proven pattern

**For Future**: Consider Server Actions migration
- Better long-term solution
- More maintainable
- Better performance

---

## Additional Resources

- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Server Actions Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#good-to-know)
- [Revalidating Data](https://nextjs.org/docs/app/building-your-application/caching#revalidatepath)

---

## Support

If you encounter issues:

1. Check server logs for detailed error messages
2. Check browser console for client-side errors
3. Verify database state directly with SQL
4. Review the comprehensive analysis in `UNPUBLISH_BUG_ANALYSIS.md`
5. Contact the development team

---

**Last Updated**: 2025-12-01
**Status**: Production Ready (router.refresh approach)
**Alternative Available**: Server Actions (recommended for future)
