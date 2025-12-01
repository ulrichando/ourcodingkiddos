# Admin Subscription Bypass

## Overview

Admin accounts bypass all subscription restrictions and have unlimited access to all features and content in the platform. This document explains how this works and where it's implemented.

## Key Principle

**Admin users should NEVER be restricted by subscription status, trial expirations, or payment requirements.**

## Implementation

### 1. API Endpoint: `/api/subscriptions`

The subscription API endpoint ([app/api/subscriptions/route.ts](../app/api/subscriptions/route.ts)) returns unlimited access for admin users:

```typescript
if (userRole === "ADMIN") {
  return NextResponse.json({
    subscription: {
      id: "admin-unlimited",
      planType: "unlimited",
      status: "active",
      // ... unlimited access details
    },
  });
}
```

### 2. Helper Utilities: `lib/subscription.ts`

Reusable helper functions for checking subscription access:

- `bypassesSubscription(session)` - Returns true if user is admin
- `hasSubscriptionAccess(session, subscription)` - Checks if user has access (admins always return true)
- `getSubscriptionLabel(session, subscription)` - Returns "Admin Access" for admins

### 3. Frontend Implementation

#### Parent Dashboard (`app/dashboard/parent/page.tsx`)

- Admin users see "Admin Access" instead of plan type
- Trial expiration warnings are hidden for admins
- Upgrade prompts are hidden for admins
- Subscription status shows "Unlimited" for admins

```typescript
const isAdmin = (session?.user as any)?.role === "ADMIN";
const trialExpired = !isAdmin && /* trial check logic */;
```

## User Roles

Admin role is stored in the database and session:

- Database: `User.role` field (value: `"ADMIN"`)
- Session: `session.user.role` (populated in [lib/auth.ts](../lib/auth.ts))

## When Adding Subscription Checks

When implementing new features that might require subscription checks, always ensure admins bypass these restrictions:

```typescript
// ✅ CORRECT
if (session.user.role === "ADMIN" || hasActiveSubscription) {
  // Allow access
}

// ❌ INCORRECT
if (hasActiveSubscription) {
  // Allow access
}
```

## Usage Examples

### In API Routes

```typescript
import { bypassesSubscription } from "@/lib/subscription";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // Check if user bypasses subscription
  if (!bypassesSubscription(session) && !hasActiveSubscription(session)) {
    return NextResponse.json({ error: "Subscription required" }, { status: 403 });
  }

  // Proceed with request
}
```

### In Client Components

```typescript
import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  // Hide subscription warnings for admins
  if (!isAdmin && trialExpired) {
    return <UpgradePrompt />;
  }

  return <Content />;
}
```

## Testing

To test admin bypass behavior:

1. Create an admin user in the database
2. Login as admin
3. Verify:
   - No subscription warnings appear
   - All courses and content are accessible
   - Dashboard shows "Admin Access" and "Unlimited"
   - No upgrade prompts are visible

## Files Modified

- `app/api/subscriptions/route.ts` - Created subscription API with admin bypass
- `app/dashboard/parent/page.tsx` - Updated to hide subscription UI for admins
- `lib/subscription.ts` - Created helper utilities for subscription checks
- `lib/auth.ts` - Already includes role in session

## Future Considerations

When adding new features that depend on subscriptions:

1. Always check if user is admin first
2. Use the helper functions from `lib/subscription.ts`
3. Document any new subscription checks in this file
4. Test with both admin and non-admin accounts

## Support

If you encounter issues with admin bypass not working:

1. Check that `session.user.role` is set to `"ADMIN"` in the session
2. Verify the database has `role: "ADMIN"` for the user
3. Ensure all subscription checks use the bypass logic
4. Check browser console for any errors
