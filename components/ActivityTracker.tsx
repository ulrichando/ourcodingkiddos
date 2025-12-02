"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

// Ping the activity endpoint every 30 seconds to track online status
const PING_INTERVAL = 30000;

export default function ActivityTracker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    // Initial ping
    const ping = () => {
      fetch("/api/activity", { method: "POST" }).catch(() => {});
    };

    ping();

    // Set up interval
    const interval = setInterval(ping, PING_INTERVAL);

    // Also ping on visibility change (when user comes back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        ping();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session, status]);

  return null; // This component doesn't render anything
}
