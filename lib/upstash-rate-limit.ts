import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "./logger";

/**
 * Upstash Redis-based rate limiting for production
 * Falls back to in-memory rate limiting if Redis is not configured
 */

// In-memory rate limit store for fallback (simple Map-based implementation)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

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

/**
 * In-memory rate limiting fallback when Redis is unavailable
 * NOT suitable for production with multiple instances - use Redis instead
 */
function checkMemoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number; limit: number } {
  const now = Date.now();
  const key = identifier;
  const record = memoryStore.get(key);

  // Clean expired entries periodically
  if (memoryStore.size > 10000) {
    memoryStore.forEach((v, k) => {
      if (v.resetAt < now) memoryStore.delete(k);
    });
  }

  if (!record || record.resetAt < now) {
    // New window
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, reset: now + windowMs, limit };
  }

  if (record.count >= limit) {
    // Rate limited
    return { success: false, remaining: 0, reset: record.resetAt, limit };
  }

  // Increment count
  record.count++;
  return { success: true, remaining: limit - record.count, reset: record.resetAt, limit };
}

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
    // Fallback to in-memory rate limiting: 5 attempts per 15 minutes
    return checkMemoryRateLimit(`login:${identifier}`, 5, 15 * 60 * 1000);
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
    logger.db.error("Redis rate limit error", error);
    // Fallback to memory on Redis error
    return checkMemoryRateLimit(`login:${identifier}`, 5, 15 * 60 * 1000);
  }
}

/**
 * Check rate limit for API requests
 * @param identifier - Usually the user ID or IP address
 */
export async function checkApiRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!apiRateLimiter) {
    // Fallback to in-memory: 100 requests per minute
    return checkMemoryRateLimit(`api:${identifier}`, 100, 60 * 1000);
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
    logger.db.error("Redis rate limit error", error);
    return checkMemoryRateLimit(`api:${identifier}`, 100, 60 * 1000);
  }
}

/**
 * Check rate limit for contact form submissions
 * @param identifier - Usually the IP address
 */
export async function checkContactRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!contactFormRateLimiter) {
    // Fallback to in-memory: 3 submissions per minute
    return checkMemoryRateLimit(`contact:${identifier}`, 3, 60 * 1000);
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
    logger.db.error("Redis rate limit error", error);
    return checkMemoryRateLimit(`contact:${identifier}`, 3, 60 * 1000);
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
    logger.db.error("Failed to reset rate limit", error);
  }
}

/**
 * Check if Upstash Redis is configured
 */
export function isRedisConfigured(): boolean {
  return isUpstashConfigured;
}
