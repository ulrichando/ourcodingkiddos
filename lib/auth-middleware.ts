import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export type UserRole = "ADMIN" | "INSTRUCTOR" | "PARENT" | "STUDENT" | "SUPPORT";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}

export interface AuthResult {
  success: true;
  user: AuthenticatedUser;
}

export interface AuthError {
  success: false;
  response: NextResponse;
}

/**
 * Validates that the current session has one of the allowed roles
 * Returns the authenticated user or an error response
 */
export async function requireAuth(
  allowedRoles?: UserRole[]
): Promise<AuthResult | AuthError> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      ),
    };
  }

  const user = session.user as AuthenticatedUser;
  const role = user.role?.toUpperCase() as UserRole;

  if (!role) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Unauthorized - Invalid user role" },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  return {
    success: true,
    user: { ...user, role },
  };
}

/**
 * Shorthand for requiring admin role
 */
export async function requireAdmin(): Promise<AuthResult | AuthError> {
  return requireAuth(["ADMIN"]);
}

/**
 * Shorthand for requiring instructor role
 */
export async function requireInstructor(): Promise<AuthResult | AuthError> {
  return requireAuth(["INSTRUCTOR", "ADMIN"]);
}

/**
 * Shorthand for requiring support role
 */
export async function requireSupport(): Promise<AuthResult | AuthError> {
  return requireAuth(["SUPPORT", "ADMIN"]);
}

/**
 * Shorthand for requiring parent role
 */
export async function requireParent(): Promise<AuthResult | AuthError> {
  return requireAuth(["PARENT", "ADMIN"]);
}

/**
 * Shorthand for requiring student role
 */
export async function requireStudent(): Promise<AuthResult | AuthError> {
  return requireAuth(["STUDENT", "PARENT", "ADMIN"]);
}
