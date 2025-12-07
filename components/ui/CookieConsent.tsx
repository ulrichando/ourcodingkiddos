"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Settings, Check } from "lucide-react";
import Button from "./button";

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
};

const COOKIE_NAME = "cookie-consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

// Helper functions to work with cookies
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") return;
  // Add Secure flag for HTTPS, use SameSite=Lax for cross-site compatibility
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
}

// Get consent from localStorage (more reliable) or cookies (backup)
function getStoredConsent(): string | null {
  if (typeof window === "undefined") return null;

  // Try localStorage first (more reliable, not affected by ITP/ad blockers)
  try {
    const localValue = localStorage.getItem(COOKIE_NAME);
    if (localValue) return localValue;
  } catch {
    // localStorage might not be available
  }

  // Fallback to cookie
  return getCookie(COOKIE_NAME);
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to avoid hydration issues
    setMounted(true);

    // Check if user has already made a choice (localStorage first, then cookies)
    const consent = getStoredConsent();

    if (!consent) {
      // Small delay to avoid layout shift on page load
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const savedPrefs = JSON.parse(consent);
        // Validate the parsed object has required properties
        if (savedPrefs && typeof savedPrefs.necessary === "boolean") {
          setPreferences(savedPrefs);
          // Don't show banner - user already consented

          // Sync storage: ensure both localStorage and cookie are set
          // This helps if one was cleared but the other wasn't
          try {
            localStorage.setItem(COOKIE_NAME, consent);
          } catch {
            // localStorage might not be available
          }
          setCookie(COOKIE_NAME, consent, COOKIE_MAX_AGE);
        } else {
          // Invalid data, show banner
          setShowBanner(true);
        }
      } catch {
        // Invalid JSON, show banner
        setShowBanner(true);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const prefsJson = JSON.stringify(prefs);

    // Save to localStorage FIRST (more reliable, not affected by ITP/ad blockers)
    try {
      localStorage.setItem(COOKIE_NAME, prefsJson);
      localStorage.setItem("cookie-consent-date", new Date().toISOString());
    } catch {
      // localStorage might not be available
    }

    // Also save to cookie as backup (for server-side access)
    setCookie(COOKIE_NAME, prefsJson, COOKIE_MAX_AGE);

    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);

    // Dispatch event so other parts of app can react
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: prefs }));
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const acceptSelected = () => {
    savePreferences(preferences);
  };

  const rejectAll = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted || !showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {!showSettings ? (
            // Main Banner View
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      We value your privacy
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                      By clicking &quot;Accept All&quot;, you consent to our use of cookies.{" "}
                      <Link href="/cookies" className="text-purple-600 dark:text-purple-400 hover:underline">
                        Learn more
                      </Link>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={acceptAll}>
                      <Check className="w-4 h-4" />
                      Accept All
                    </Button>
                    <Button variant="outline" onClick={rejectAll}>
                      Reject All
                    </Button>
                    <Button variant="ghost" onClick={() => setShowSettings(true)}>
                      <Settings className="w-4 h-4" />
                      Customize
                    </Button>
                  </div>
                </div>
                <button
                  onClick={rejectAll}
                  className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
          ) : (
            // Settings View
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Necessary Cookies - Always On */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Necessary Cookies</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Essential for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-purple-600 rounded-full cursor-not-allowed opacity-70">
                      <div className="absolute top-[2px] right-[2px] bg-white rounded-full h-5 w-5 transition-all"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Analytics Cookies</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Marketing Cookies</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Used to deliver personalized advertisements relevant to you.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Preference Cookies */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Preference Cookies</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Remember your settings and preferences for a better experience.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.preferences}
                      onChange={(e) => setPreferences(prev => ({ ...prev, preferences: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <Button onClick={acceptSelected}>
                  Save Preferences
                </Button>
                <Button variant="outline" onClick={acceptAll}>
                  Accept All
                </Button>
                <Link href="/cookies" className="text-sm text-purple-600 dark:text-purple-400 hover:underline self-center ml-auto">
                  Cookie Policy
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Export a hook to check cookie consent status
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    // Use the unified getter (localStorage first, then cookies)
    const stored = getStoredConsent();
    if (stored) {
      try {
        setConsent(JSON.parse(stored));
      } catch {
        setConsent(null);
      }
    }

    const handleUpdate = (e: CustomEvent<CookiePreferences>) => {
      setConsent(e.detail);
    };

    window.addEventListener("cookie-consent-updated", handleUpdate as EventListener);
    return () => window.removeEventListener("cookie-consent-updated", handleUpdate as EventListener);
  }, []);

  return consent;
}
