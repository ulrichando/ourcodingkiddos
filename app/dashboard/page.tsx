"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }

    // Redirect based on user role
    const role = (session?.user as any)?.role?.toUpperCase();

    switch (role) {
      case "ADMIN":
        router.replace("/dashboard/admin");
        break;
      case "INSTRUCTOR":
        router.replace("/dashboard/instructor");
        break;
      case "PARENT":
        router.replace("/dashboard/parent");
        break;
      case "STUDENT":
        router.replace("/dashboard/student");
        break;
      default:
        // Default to parent dashboard if role is unknown
        router.replace("/dashboard/parent");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
