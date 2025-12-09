"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";

// Storage key for cross-tab synchronization
const ACTIVITY_STORAGE_KEY = "lastActivityTime";
const LOGOUT_STORAGE_KEY = "forceLogout";

// Inactivity timeout in milliseconds
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
const WARNING_BEFORE_LOGOUT = 2 * 60 * 1000; // Show warning 2 minutes before logout

type InactivityOptions = {
  timeout?: number; // Inactivity timeout in ms (default: 30 minutes)
  warningTime?: number; // Warning before logout in ms (default: 2 minutes)
  onWarning?: () => void; // Callback when warning should be shown
  onLogout?: () => void; // Callback before logout
  enabled?: boolean; // Enable/disable the hook (default: true)
};

export function useInactivityLogout(options: InactivityOptions = {}) {
  const {
    timeout = INACTIVITY_TIMEOUT,
    warningTime = WARNING_BEFORE_LOGOUT,
    onWarning,
    onLogout,
    enabled = true,
  } = options;

  const { status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef<boolean>(false);
  const isLoggingOutRef = useRef<boolean>(false);

  // Use refs for callbacks to avoid dependency changes
  const onWarningRef = useRef(onWarning);
  const onLogoutRef = useRef(onLogout);

  // Update refs when callbacks change
  useEffect(() => {
    onWarningRef.current = onWarning;
    onLogoutRef.current = onLogout;
  }, [onWarning, onLogout]);

  // Get last activity time from storage (for cross-tab sync)
  const getLastActivity = useCallback(() => {
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      return stored ? parseInt(stored, 10) : Date.now();
    } catch {
      return Date.now();
    }
  }, []);

  // Set last activity time in storage
  const setLastActivity = useCallback((time: number) => {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, time.toString());
    } catch {
      // Storage not available
    }
  }, []);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
  }, []);

  // Perform logout
  const performLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      // Signal other tabs to logout
      localStorage.setItem(LOGOUT_STORAGE_KEY, Date.now().toString());
      onLogoutRef.current?.();
      await signOut({ callbackUrl: "/auth/login?reason=inactivity" });
    } catch (error) {
      console.error("Logout error:", error);
      isLoggingOutRef.current = false;
    }
  }, []);

  // Reset the inactivity timer
  const resetTimer = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    warningShownRef.current = false;
    clearTimers();

    // Only set timers if user is authenticated and enabled
    if (status !== "authenticated" || !enabled) return;

    // Set warning timer
    const warningDelay = timeout - warningTime;
    if (warningDelay > 0) {
      warningRef.current = setTimeout(() => {
        if (!warningShownRef.current) {
          warningShownRef.current = true;
          onWarningRef.current?.();
        }
      }, warningDelay);
    }

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      performLogout();
    }, timeout);
  }, [status, enabled, timeout, warningTime, clearTimers, setLastActivity, performLogout]);

  // Check if should be logged out based on stored activity time
  const checkStoredActivity = useCallback(() => {
    const lastActivity = getLastActivity();
    const elapsed = Date.now() - lastActivity;

    if (elapsed >= timeout) {
      performLogout();
      return true;
    }

    // If past warning time, show warning
    if (elapsed >= timeout - warningTime && !warningShownRef.current) {
      warningShownRef.current = true;
      onWarningRef.current?.();
    }

    return false;
  }, [getLastActivity, timeout, warningTime, performLogout]);

  // Main effect for setting up listeners
  useEffect(() => {
    if (!enabled || status !== "authenticated") {
      clearTimers();
      return;
    }

    // Check stored activity on mount
    if (checkStoredActivity()) return;

    // Events that indicate user activity
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "wheel",
    ];

    // Throttle activity detection
    let lastThrottle = 0;
    const throttleMs = 1000;

    const throttledHandler = () => {
      const now = Date.now();
      if (now - lastThrottle >= throttleMs) {
        lastThrottle = now;
        resetTimer();
      }
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, throttledHandler, { passive: true });
    });

    // Handle visibility changes (tab switch back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Check if we should have logged out while tab was hidden
        if (!checkStoredActivity()) {
          // Recalculate timers based on actual elapsed time
          const lastActivity = getLastActivity();
          const elapsed = Date.now() - lastActivity;
          const remaining = timeout - elapsed;

          clearTimers();

          if (remaining <= 0) {
            performLogout();
          } else if (remaining <= warningTime) {
            // In warning period
            if (!warningShownRef.current) {
              warningShownRef.current = true;
              onWarningRef.current?.();
            }
            timeoutRef.current = setTimeout(performLogout, remaining);
          } else {
            // Reset timers with adjusted times
            warningRef.current = setTimeout(() => {
              if (!warningShownRef.current) {
                warningShownRef.current = true;
                onWarningRef.current?.();
              }
            }, remaining - warningTime);
            timeoutRef.current = setTimeout(performLogout, remaining);
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Listen for storage events (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOGOUT_STORAGE_KEY && e.newValue) {
        // Another tab triggered logout
        performLogout();
      } else if (e.key === ACTIVITY_STORAGE_KEY && e.newValue) {
        // Another tab had activity - reset our timers
        const activityTime = parseInt(e.newValue, 10);
        if (!isNaN(activityTime)) {
          warningShownRef.current = false;
          clearTimers();

          const elapsed = Date.now() - activityTime;
          const remaining = timeout - elapsed;

          if (remaining > warningTime) {
            warningRef.current = setTimeout(() => {
              if (!warningShownRef.current) {
                warningShownRef.current = true;
                onWarningRef.current?.();
              }
            }, remaining - warningTime);
          }

          if (remaining > 0) {
            timeoutRef.current = setTimeout(performLogout, remaining);
          }
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, throttledHandler);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
      clearTimers();
    };
  }, [enabled, status, timeout, warningTime, resetTimer, clearTimers, checkStoredActivity, getLastActivity, performLogout]);

  // Return time remaining until logout (for UI display)
  const getTimeRemaining = useCallback(() => {
    const lastActivity = getLastActivity();
    const elapsed = Date.now() - lastActivity;
    return Math.max(0, timeout - elapsed);
  }, [timeout, getLastActivity]);

  return {
    resetTimer,
    getTimeRemaining,
    isActive: status === "authenticated",
  };
}

export default useInactivityLogout;
