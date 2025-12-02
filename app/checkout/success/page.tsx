"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import Button from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    planType?: string;
    daysRemaining?: number;
  } | null>(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/pricing");
      return;
    }

    // Verify the session and create subscription if needed
    async function verifySession() {
      try {
        const response = await fetch("/api/stripe/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Verification failed:", data.error);
          setError(data.error || "Failed to verify subscription");
        } else {
          // Extract subscription info for display
          if (data.subscription) {
            const endDate = data.subscription.endDate || data.subscription.trialEndsAt;
            const daysRemaining = endDate
              ? Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;
            setSubscriptionInfo({
              planType: data.subscription.planType,
              daysRemaining: daysRemaining || undefined,
            });
          }
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Failed to verify subscription. Please contact support.");
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [sessionId, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">Activating your subscription...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-full p-6 shadow-xl inline-block">
            <AlertCircle className="w-20 h-20 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Subscription Activation Issue
          </h1>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Don&apos;t worry - your payment was processed. Please try refreshing the page or contact support if the issue persists.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700 text-white">
              Try Again
            </Button>
            <Link href="/dashboard/parent">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
        {/* Success Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="relative bg-white dark:bg-slate-800 rounded-full p-6 shadow-xl">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Welcome to Our Coding Kiddos!
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Your subscription is now active
          </p>
          {subscriptionInfo?.planType === "FREE_TRIAL" && subscriptionInfo.daysRemaining && (
            <p className="text-lg text-purple-600 dark:text-purple-400 font-medium">
              You have {subscriptionInfo.daysRemaining} days of free trial access!
            </p>
          )}
        </div>

        {/* What's Next */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-left space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold">What's Next?</h2>
          </div>

          <ul className="space-y-4">
            {[
              {
                title: "Explore Courses",
                description: "Browse our full catalog of coding courses for all skill levels",
                link: "/courses",
              },
              {
                title: "Join Live Classes",
                description: "Schedule your first live session with our expert instructors",
                link: "/schedule",
              },
              {
                title: "Try the Playground",
                description: "Start coding right away in our interactive code playground",
                link: "/playground",
              },
              {
                title: "Complete Your Profile",
                description: "Set up your dashboard and customize your learning experience",
                link: "/dashboard",
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <Link href={item.link} className="group">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                  </Link>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 px-8">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" className="h-12 px-8">
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Email Confirmation */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          📧 A confirmation email has been sent to your inbox with your receipt and subscription details.
        </p>
      </div>
    </main>
  );
}
