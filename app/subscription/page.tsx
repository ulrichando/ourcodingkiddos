"use client";

import { useState } from "react";
import Button from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

type Plan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free Trial",
    price: "$0",
    period: "/7 days",
    features: ["3 sample lessons", "Code playground access", "Basic support"],
  },
  {
    name: "Monthly",
    price: "$29",
    period: "/per month",
    features: ["Unlimited courses", "Live classes included", "Progress tracking", "Certificates", "Priority support"],
    popular: true,
  },
  {
    name: "Annual",
    price: "$249",
    period: "/per year",
    features: ["Everything in Monthly", "Save 28%", "2 free months", "Priority booking"],
  },
  {
    name: "Family Plan",
    price: "$49",
    period: "/per month",
    features: ["Up to 3 students", "Everything in Monthly", "Family dashboard", "Sibling discounts"],
  },
];

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState<Plan>(plans[1]); // Monthly
  const [status, setStatus] = useState("Active");
  const [info, setInfo] = useState("All courses unlocked; live classes included.");

  const handleSelect = (plan: Plan) => {
    setCurrentPlan(plan);
    setStatus("Active");
    if (plan.name === "Free Trial") {
      setInfo("Sample lessons unlocked; upgrade to access all courses.");
    } else if (plan.name === "Family Plan") {
      setInfo("Up to 3 students unlocked; shared dashboard enabled.");
    } else {
      setInfo("All courses and live classes unlocked.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-slate-600">Choose the best plan for your family</p>
        </div>

        <div className="border-2 border-purple-300 bg-purple-50 rounded-2xl p-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <span className="text-purple-600">👑</span> Current Plan
            <span className="text-purple-600">{currentPlan.name}</span>
            <span className="text-slate-500">({info})</span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{status}</span>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {plans.map((plan) => {
            const isCurrent = currentPlan.name === plan.name;
            return (
              <Card
                key={plan.name}
                className={`overflow-hidden border ${
                  isCurrent ? "border-purple-500 shadow-purple-100 scale-[1.02]" : "border-slate-200"
                }`}
              >
                {plan.popular && (
                  <div className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 text-center">MOST POPULAR</div>
                )}
                <CardContent className="p-5 space-y-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{plan.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-slate-500">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="text-emerald-500">✔</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className={`w-full ${plan.popular ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}`}
                    disabled={isCurrent}
                    onClick={() => handleSelect(plan)}
                  >
                    {isCurrent ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-slate-500">
          All plans include access to the code playground and basic support. Cancel anytime. No long-term commitments.
        </p>
      </div>
    </main>
  );
}
