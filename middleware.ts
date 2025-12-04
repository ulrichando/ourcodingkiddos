import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)",
  ],
};
