import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Cache maintenance mode status to reduce DB hits
let maintenanceCache: { status: boolean; timestamp: number } | null = null;
const CACHE_TTL = 10000; // 10 seconds

async function checkMaintenanceMode(baseUrl: string): Promise<boolean> {
  // Return cached value if still valid
  if (maintenanceCache && Date.now() - maintenanceCache.timestamp < CACHE_TTL) {
    return maintenanceCache.status;
  }

  try {
    const response = await fetch(`${baseUrl}/api/maintenance/status`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      maintenanceCache = {
        status: data.maintenanceMode ?? false,
        timestamp: Date.now()
      };
      return maintenanceCache.status;
    }
  } catch (error) {
    console.error("Maintenance check failed:", error);
  }

  return false;
}

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    // Paths that should be accessible during maintenance
    const maintenanceExemptPaths = [
      "/maintenance",
      "/auth/login",
      "/api/",
      "/_next/",
      "/favicon.ico",
    ];

    // Check if current path is exempt from maintenance mode
    const isExemptPath = maintenanceExemptPaths.some(
      (exemptPath) => path === exemptPath || path.startsWith(exemptPath)
    );

    // Check maintenance mode for non-admin users on non-exempt paths
    if (!isExemptPath && role !== "ADMIN") {
      const baseUrl = req.nextUrl.origin;
      const isMaintenanceMode = await checkMaintenanceMode(baseUrl);

      if (isMaintenanceMode) {
        return NextResponse.redirect(new URL("/maintenance", req.url));
      }
    }

    // Admin routes - only ADMIN role
    if (path.startsWith("/dashboard/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url));
      }
    }

    // Instructor routes - only INSTRUCTOR or ADMIN
    if (path.startsWith("/dashboard/instructor")) {
      if (role !== "INSTRUCTOR" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url));
      }
    }

    // Parent routes - only PARENT or ADMIN
    if (path.startsWith("/dashboard/parent")) {
      if (role !== "PARENT" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url));
      }
    }

    // Student routes - only STUDENT, PARENT, or ADMIN
    if (path.startsWith("/dashboard/student")) {
      if (role !== "STUDENT" && role !== "PARENT" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url));
      }
    }

    // Messages, notifications, settings - any authenticated user
    if (path.startsWith("/messages") || path.startsWith("/notifications") || path.startsWith("/settings")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Certificates - any authenticated user
    if (path.startsWith("/certificates") && !path.startsWith("/certificates/verify")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public routes - always allow
        const publicRoutes = [
          "/",
          "/auth/login",
          "/auth/register",
          "/auth/student-login",
          "/auth/forgot-password",
          "/auth/reset-password",
          "/courses",
          "/programs",
          "/curriculum",
          "/blog",
          "/showcase",
          "/contact",
          "/about",
          "/faq",
          "/privacy",
          "/terms",
          "/cookies",
          "/playground",
          "/schedule",
          "/certificates/verify",
          "/maintenance",
        ];

        // Check if it's a public route or public route prefix
        if (publicRoutes.some(route => path === route || path.startsWith(route + "/"))) {
          return true;
        }

        // Course detail pages are public
        if (path.match(/^\/courses\/[^/]+$/)) {
          return true;
        }

        // API routes handle their own auth
        if (path.startsWith("/api/")) {
          return true;
        }

        // Static files
        if (path.startsWith("/_next/") || path.includes(".")) {
          return true;
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth handles its own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with extensions (public folder assets)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)",
  ],
};
