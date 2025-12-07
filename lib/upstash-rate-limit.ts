import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Upstash Redis-based rate limiting for production
 * Falls back to allowing requests if Redis is not configured
 */

// Check if Upstash is configured
const isUpstashConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

// Initialize Redis client only if configured
const redis = isUpstashConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Create rate limiters for different use cases
const loginRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 minutes
      analytics: true,
      prefix: "ratelimit:login",
    })
  : null;

const apiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
      analytics: true,
      prefix: "ratelimit:api",
    })
  : null;

const contactFormRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 submissions per minute
      analytics: true,
      prefix: "ratelimit:contact",
    })
  : null;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

/**
 * Check rate limit for login attempts
 * @param identifier - Usually the email or IP address
 */
export async function checkLoginRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!loginRateLimiter) {
    // Fallback: allow if Redis not configured
    return { success: true, remaining: 5, reset: Date.now() + 900000, limit: 5 };
  }

  try {
    const result = await loginRateLimiter.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    };
  } catch (error) {
    console.error("[RateLimit] Redis error:", error);
    // Allow on error to prevent lockout
    return { success: true, remaining: 5, reset: Date.now() + 900000, limit: 5 };
  }
}

/**
 * Check rate limit for API requests
 * @param identifier - Usually the user ID or IP address
 */
export async function checkApiRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!apiRateLimiter) {
    return { success: true, remaining: 100, reset: Date.now() + 60000, limit: 100 };
  }

  try {
    const result = await apiRateLimiter.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    };
  } catch (error) {
    console.error("[RateLimit] Redis error:", error);
    return { success: true, remaining: 100, reset: Date.now() + 60000, limit: 100 };
  }
}

/**
 * Check rate limit for contact form submissions
 * @param identifier - Usually the IP address
 */
export async function checkContactRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!contactFormRateLimiter) {
    return { success: true, remaining: 3, reset: Date.now() + 60000, limit: 3 };
  }

  try {
    const result = await contactFormRateLimiter.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    };
  } catch (error) {
    console.error("[RateLimit] Redis error:", error);
    return { success: true, remaining: 3, reset: Date.now() + 60000, limit: 3 };
  }
}

/**
 * Reset rate limit for an identifier (e.g., after successful login)
 */
export async function resetLoginRateLimit(identifier: string): Promise<void> {
  if (!redis) return;

  try {
    // Delete all keys for this identifier
    const keys = await redis.keys(`ratelimit:login:${identifier}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("[RateLimit] Failed to reset:", error);
  }
}

/**
 * Check if Upstash Redis is configured
 */
export function isRedisConfigured(): boolean {
  return isUpstashConfigured;
}
