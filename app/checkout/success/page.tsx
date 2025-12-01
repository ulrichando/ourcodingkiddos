"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/pricing");
      return;
    }

    // Simulate loading for better UX
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [sessionId, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">Processing your subscription...</p>
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
