"use client";

import { signOut } from "next-auth/react";

/**
 * Comprehensive logout function that:
 * 1. Clears all local storage
 * 2. Clears all session storage
 * 3. Clears any cached data
 * 4. Signs out via NextAuth
 * 5. Redirects to login page
 */
export async function logout() {
  try {
    // Clear all local storage
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();

      // Clear any specific cached keys that might persist
      const keysToRemove = [
        "theme",
        "user",
        "session",
        "notifications",
        "sidebar",
        "preferences",
      ];
      keysToRemove.forEach((key) => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (e) {
          // Ignore errors for specific keys
        }
      });

      // Clear any IndexedDB data if present
      if (window.indexedDB) {
        try {
          const databases = await window.indexedDB.databases?.();
          if (databases) {
            databases.forEach((db) => {
              if (db.name) {
                window.indexedDB.deleteDatabase(db.name);
              }
            });
          }
        } catch (e) {
          // IndexedDB might not support databases() method
        }
      }

      // Clear cookies (client-accessible ones)
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        // Don't clear auth cookies as NextAuth handles those
        if (!name.includes("next-auth") && !name.includes("__Secure")) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });
    }

    // Sign out via NextAuth with redirect
    await signOut({
      callbackUrl: "/auth/login",
      redirect: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    // Force redirect even if signOut fails
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
}

/**
 * Logout without redirect (useful for programmatic logout)
 */
export async function logoutNoRedirect() {
  try {
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }

    await signOut({
      redirect: false,
    });

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}
