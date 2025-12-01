import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing - Affordable Coding Classes for Kids | Start Free Trial",
  description: "Simple, transparent pricing for kids coding courses. Start with a free 7-day trial. Monthly plans from $29/month. Family plans available. Live classes included. Cancel anytime.",
  keywords: ["coding classes pricing", "kids coding cost", "affordable programming courses", "coding subscription for kids", "free coding trial"],
  openGraph: {
    title: "Affordable Pricing for Kids Coding Classes",
    description: "Start with a free 7-day trial. Monthly plans from $29. Live classes included. Cancel anytime.",
    url: "https://ourcodingkiddos.com/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Affordable Pricing for Kids Coding Classes",
    description: "Start with a free 7-day trial. Plans from $29/month with live classes included.",
  },
};

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "/7 days",
    features: ["3 sample lessons", "Code playground access", "Basic support"],
    cta: "Start Free",
    popular: false,
    badge: "",
  },
  {
    name: "Monthly",
    price: "$29",
    period: "/per month",
    features: ["Unlimited courses", "Live classes included", "Progress tracking", "Certificates", "Priority support"],
    cta: "Get Started",
    popular: true,
    badge: "MOST POPULAR",
  },
  {
    name: "Family Plan",
    price: "$49",
    period: "/per month",
    features: ["Up to 3 students", "Everything in Monthly", "Family dashboard", "Sibling discounts"],
    cta: "Best Value",
    popular: false,
    badge: "",
  },
];
const planParam = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

const inclusions = [
  "Code playground access on every plan",
  "Live & recorded classes with expert instructors",
  "Progress tracking with XP, badges, and streaks",
  "Certificates upon course completion",
  "Safe, kid-friendly platform with parental controls",
  "Cancel anytime. No long-term commitments.",
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes. You can cancel from your dashboard, and you keep access until the end of your period." },
  { q: "Do you offer sibling discounts?", a: "Yes. The Family Plan includes up to 3 students and sibling discounts." },
  { q: "Are live classes included?", a: "Live classes are included in Monthly and Family plans. Free trial includes sample lessons." },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <section className="pt-20 pb-10 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">Simple Pricing</span>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Invest in Your Child&apos;s Future</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Start with a free trial, upgrade when you&apos;re ready.</p>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-2xl shadow-lg border bg-white dark:bg-slate-800 ${
                plan.popular ? "border-purple-500 shadow-purple-100 dark:shadow-purple-900/20 scale-[1.02]" : "border-slate-200 dark:border-slate-700"
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}
              <div className="p-7 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">{plan.price}</span>
                    <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-emerald-500">✔</span> {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?plan=${planParam(plan.name)}`}
                  className={`w-full inline-flex justify-center items-center rounded-md px-3 py-2 text-sm font-semibold ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="max-w-5xl mx-auto bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 text-center">Every plan includes</h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
            {inclusions.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✔</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-6">FAQs</h3>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.q}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
