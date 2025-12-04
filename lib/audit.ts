import prisma from "./prisma";
import type { AuditAction, AuditSeverity } from "../generated/prisma-client";

type AuditLogInput = {
  userId?: string;
  userEmail: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  status?: "success" | "failed";
  severity?: AuditSeverity;
  metadata?: Record<string, any>;
};

/**
 * Create an audit log entry
 * Use this to track user actions throughout the application
 */
export async function createAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        userEmail: input.userEmail,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId,
        details: input.details,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
        status: input.status || "success",
        severity: input.severity || "INFO",
        metadata: input.metadata || null,
      },
    });
  } catch (error) {
    // Log to console but don't throw - audit logging shouldn't break the app
    console.error("[AuditLog] Failed to create audit log:", error);
  }
}

/**
 * Helper to extract IP address from request headers
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Helper to get user agent from request headers
 */
export function getUserAgent(headers: Headers): string {
  return headers.get("user-agent") || "unknown";
}

/**
 * Log a successful login
 */
export async function logLogin(
  userEmail: string,
  userId?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    action: "LOGIN",
    resource: "Session",
    details: `User logged in successfully`,
    ipAddress,
    userAgent,
    severity: "INFO",
  });
}

/**
 * Log a failed login attempt
 */
export async function logFailedLogin(
  userEmail: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await createAuditLog({
    userEmail,
    action: "LOGIN",
    resource: "Session",
    details: `Login failed: ${reason}`,
    ipAddress,
    userAgent,
    status: "failed",
    severity: "WARNING",
    metadata: { reason },
  });
}

/**
 * Log a logout
 */
export async function logLogout(
  userEmail: string,
  userId?: string,
  ipAddress?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    action: "LOGOUT",
    resource: "Session",
    details: `User logged out`,
    ipAddress,
    severity: "INFO",
  });
}

/**
 * Log a resource creation
 */
export async function logCreate(
  userEmail: string,
  resource: string,
  resourceId: string,
  details: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    action: "CREATE",
    resource,
    resourceId,
    details,
    severity: "INFO",
    metadata,
  });
}

/**
 * Log a resource update
 */
export async function logUpdate(
  userEmail: string,
  resource: string,
  resourceId: string,
  details: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    action: "UPDATE",
    resource,
    resourceId,
    details,
    severity: "INFO",
    metadata,
  });
}

/**
 * Log a resource deletion
 */
export async function logDelete(
  userEmail: string,
  resource: string,
  resourceId: string,
  details: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    action: "DELETE",
    resource,
    resourceId,
    details,
    severity: "WARNING",
    metadata,
  });
}

/**
 * Log a data export
 */
export async function logExport(
  userEmail: string,
  resource: string,
  details: string,
  userId?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    action: "EXPORT",
    resource,
    details,
    severity: "INFO",
  });
}

/**
 * Log a resource view (for sensitive data access)
 */
export async function logView(
  userEmail: string,
  resource: string,
  resourceId: string,
  details: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    action: "VIEW",
    resource,
    resourceId,
    details,
    severity: "INFO",
    metadata,
  });
}

/**
 * Log a security event (failed attempts, suspicious activity)
 */
export async function logSecurityEvent(
  userEmail: string,
  details: string,
  severity: AuditSeverity = "WARNING",
  ipAddress?: string,
  userAgent?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await createAuditLog({
    userEmail,
    action: "VIEW", // Using VIEW as a generic action for security events
    resource: "Security",
    details,
    ipAddress,
    userAgent,
    status: "failed",
    severity,
    metadata,
  });
}

/**
 * Log a critical security event (brute force, unauthorized access attempts)
 */
export async function logCriticalSecurityEvent(
  userEmail: string,
  details: string,
  ipAddress?: string,
  userAgent?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await createAuditLog({
    userEmail,
    action: "VIEW",
    resource: "Security",
    details,
    ipAddress,
    userAgent,
    status: "failed",
    severity: "CRITICAL",
    metadata,
  });
}
