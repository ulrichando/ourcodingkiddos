"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MessagesRedirectContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      // Redirect to login if not authenticated
      router.push("/auth/signin");
      return;
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    // Preserve query parameters
    const queryString = searchParams.toString();
    const queryParam = queryString ? `?${queryString}` : "";

    // Redirect to appropriate dashboard messages page based on role
    switch (userRole) {
      case "INSTRUCTOR":
        router.push(`/dashboard/instructor/messages${queryParam}`);
        break;
      case "PARENT":
        router.push(`/dashboard/parent/messages${queryParam}`);
        break;
      case "STUDENT":
        router.push(`/dashboard/parent/messages${queryParam}`); // Students use parent dashboard
        break;
      case "ADMIN":
      case "SUPPORT":
        router.push(`/dashboard/support/messages${queryParam}`);
        break;
      default:
        router.push(`/dashboard/parent/messages${queryParam}`);
        break;
    }
  }, [session, status, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Redirecting to messages...</p>
      </div>
    </div>
  );
}
