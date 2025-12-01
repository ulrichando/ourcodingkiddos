import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that should always be accessible
  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/maintenance",
  ];

  // API paths should not be blocked by maintenance mode
  const isApiPath = pathname.startsWith("/api");

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isPublicPath || isApiPath) {
    return NextResponse.next();
  }

  // Get the user's session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check maintenance mode only for authenticated users
  if (token) {
    const isAdmin = token.role === "ADMIN";

    // Admins can always access everything
    if (isAdmin) {
      return NextResponse.next();
    }

    // For non-admin users, check maintenance mode via environment variable
    // Note: Middleware runs in Edge Runtime and cannot use PrismaClient
    // To enable maintenance mode, set MAINTENANCE_MODE=true in .env
    const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

    if (maintenanceMode && !pathname.startsWith("/maintenance")) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)",
  ],
};
