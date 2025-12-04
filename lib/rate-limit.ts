/**
 * Simple client-side rate limiting utility
 * For production, consider server-side rate limiting with Redis or similar
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = { maxRequests: 3, windowMs: 60000 }
): { allowed: boolean; remainingRequests: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    rateLimitMap.delete(key);
  }

  const currentEntry = rateLimitMap.get(key);

  if (!currentEntry) {
    // First request
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remainingRequests: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  if (currentEntry.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remainingRequests: 0,
      resetIn: currentEntry.resetTime - now,
    };
  }

  // Increment count
  currentEntry.count++;
  rateLimitMap.set(key, currentEntry);

  return {
    allowed: true,
    remainingRequests: config.maxRequests - currentEntry.count,
    resetIn: currentEntry.resetTime - now,
  };
}

export function formatTimeRemaining(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
}
