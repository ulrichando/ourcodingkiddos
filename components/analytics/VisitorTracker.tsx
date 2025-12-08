"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Generate a unique visitor ID
function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  let visitorId = localStorage.getItem("ok-visitor-id");
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("ok-visitor-id", visitorId);
  }
  return visitorId;
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    // Send initial heartbeat
    const sendHeartbeat = async () => {
      try {
        await fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId,
            page: pathname,
          }),
        });
      } catch (error) {
        // Silently fail - visitor tracking is not critical
        console.debug("Visitor tracking heartbeat failed:", error);
      }
    };

    // Send heartbeat immediately
    sendHeartbeat();

    // Send heartbeat every 30 seconds
    heartbeatRef.current = setInterval(sendHeartbeat, 30000);

    // Cleanup on unmount
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, [pathname]);

  // Handle page unload
  useEffect(() => {
    const handleUnload = () => {
      const visitorId = getVisitorId();
      if (!visitorId) return;

      // Use sendBeacon for reliable delivery on page unload
      navigator.sendBeacon(
        "/api/visitors",
        JSON.stringify({ visitorId, action: "leave" })
      );
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // This component doesn't render anything
  return null;
}
