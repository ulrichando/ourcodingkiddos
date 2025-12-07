// Validation utilities for user input

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes user input to prevent XSS attacks
 * Escapes HTML entities and removes dangerous patterns
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove javascript: and data: URLs
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Sanitizes HTML content for safe display
 * Less aggressive than sanitizeInput - preserves some HTML but removes dangerous elements
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: URLs
    .replace(/href\s*=\s*["']?\s*javascript:[^"'>]*/gi, 'href="#"')
    // Remove data: URLs from src
    .replace(/src\s*=\s*["']?\s*data:[^"'>]*/gi, 'src=""')
    // Remove iframe, embed, object tags
    .replace(/<(iframe|embed|object)[^>]*>.*?<\/\1>/gi, '')
    .replace(/<(iframe|embed|object)[^>]*\/?>/gi, '');
}

/**
 * Validates user name
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  if (name.length > 100) {
    return { isValid: false, error: "Name must be less than 100 characters" };
  }

  return { isValid: true };
}

/**
 * Rate limiting implementation
 *
 * Development: Uses in-memory Map (sufficient for single-instance)
 * Production: Configure Upstash Redis for distributed rate limiting
 *
 * To upgrade to Redis:
 * 1. Install: npm install @upstash/ratelimit @upstash/redis
 * 2. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in env
 * 3. Use @upstash/ratelimit sliding window algorithm
 */

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup to prevent memory leaks (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    loginAttempts.forEach((value, key) => {
      if (now > value.resetAt) {
        loginAttempts.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export function checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  if (!attempts || now > attempts.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (attempts.count >= maxAttempts) {
    return false;
  }

  attempts.count++;
  return true;
}

export function resetRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}

/**
 * Get remaining attempts for an identifier
 */
export function getRateLimitStatus(identifier: string, maxAttempts = 5): {
  remaining: number;
  resetAt: number | null
} {
  const attempts = loginAttempts.get(identifier);
  if (!attempts) {
    return { remaining: maxAttempts, resetAt: null };
  }
  return {
    remaining: Math.max(0, maxAttempts - attempts.count),
    resetAt: attempts.resetAt
  };
}
