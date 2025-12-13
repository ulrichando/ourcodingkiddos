"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SettingsRedirectContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      // Redirect to login if not authenticated
      router.push("/auth/signin");
      return;
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    // Redirect to appropriate dashboard settings page based on role
    switch (userRole) {
      case "INSTRUCTOR":
        router.push("/dashboard/instructor/settings");
        break;
      case "PARENT":
        router.push("/dashboard/parent/settings");
        break;
      case "STUDENT":
        router.push("/dashboard/student/settings");
        break;
      case "ADMIN":
      case "SUPPORT":
        router.push("/dashboard/admin/settings");
        break;
      default:
        router.push("/dashboard/parent/settings");
        break;
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Redirecting to settings...</p>
      </div>
    </div>
  );
}
