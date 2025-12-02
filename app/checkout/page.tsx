"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Check,
  Shield,
  Star,
  Zap,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

type Plan = {
  id: string;
  name: string;
  price: number;
  period: string;
  maxStudents: number;
  popular?: boolean;
  features: string[];
  paymentLink: string;
};

const plans: Plan[] = [
  {
    id: "free-trial",
    name: "Free Trial",
    price: 0,
    period: "7 days",
    maxStudents: 1,
    features: [
      "Full course access for 7 days",
      "1 student account",
      "Live instructor classes",
      "Progress tracking",
      "No credit card required",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_FREE_TRIAL_LINK || "",
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 29,
    period: "month",
    maxStudents: 1,
    popular: true,
    features: [
      "Unlimited course access",
      "1 student account",
      "Live instructor classes",
      "Certificates & badges",
      "Priority support",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_LINK || "",
  },
  {
    id: "family-plan",
    name: "Family Plan",
    price: 49,
    period: "month",
    maxStudents: 3,
    features: [
      "Unlimited course access",
      "Up to 3 student accounts",
      "Live instructor classes",
      "Family dashboard",
      "Priority support",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_FAMILY_LINK || "",
  },
];

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [selectedPlanId, setSelectedPlanId] = useState("monthly");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("plan");
    if (fromUrl && plans.find((p) => p.id === fromUrl)) {
      setSelectedPlanId(fromUrl);
    }
  }, [searchParams]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[1];

  const handleCheckout = () => {
    if (status === "loading") return;

    if (!session) {
      window.location.href = "/auth/login?callbackUrl=/checkout?plan=" + selectedPlanId;
      return;
    }

    setLoading(true);

    // Redirect directly to Stripe Payment Link
    if (selectedPlan.paymentLink) {
      // Add prefilled email if available
      const url = new URL(selectedPlan.paymentLink);
      if (session.user?.email) {
        url.searchParams.set("prefilled_email", session.user.email);
      }
      window.location.href = url.toString();
    } else {
      setLoading(false);
      alert("Payment link not configured. Please contact support.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Plans
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Complete Your Subscription
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            You&apos;ll be redirected to Stripe for secure payment
          </p>
        </div>

        {/* Plan Selection */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                selectedPlanId === plan.id
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg"
                  : "border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                  Most Popular
                </Badge>
              )}
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {plan.name}
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ${plan.price}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  /{plan.period}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {plan.maxStudents} student{plan.maxStudents > 1 ? "s" : ""}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Plan Details */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Plan Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <Badge className="bg-white/20 text-white border-0 mb-2">
              {selectedPlan.id === "free-trial" ? "7-Day Free Trial" : "Selected Plan"}
            </Badge>
            <h2 className="text-2xl font-bold">{selectedPlan.name}</h2>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-bold">${selectedPlan.price}</span>
              <span className="text-white/80">/{selectedPlan.period}</span>
            </div>
          </div>

          {/* Features */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                What&apos;s Included
              </h3>
              <ul className="space-y-2">
                {selectedPlan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-700 dark:text-slate-300"
                  >
                    <Check className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedPlan.id === "free-trial" && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> After your 7-day free trial, you&apos;ll be charged
                $29/month unless you cancel. You can cancel anytime.
              </div>
            )}

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={loading || status === "loading"}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  {selectedPlan.id === "free-trial"
                    ? "Start Free Trial"
                    : `Subscribe - $${selectedPlan.price}/month`}
                </>
              )}
            </Button>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Secure Payment
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Instant Access
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-500" />
                Cancel Anytime
              </div>
            </div>
          </div>
        </div>

        {/* Powered by Stripe */}
        <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          <p>Payments securely processed by Stripe</p>
        </div>
      </div>
    </main>
  );
}
