import Link from "next/link";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "/7 days",
    features: ["3 sample lessons", "Code playground access", "Basic support"],
    cta: "Select Plan",
    popular: false,
  },
  {
    name: "Monthly",
    price: "$29",
    period: "/per month",
    features: ["Unlimited courses", "Live classes included", "Progress tracking", "Certificates", "Priority support"],
    cta: "Current Plan",
    popular: true,
  },
  {
    name: "Annual",
    price: "$249",
    period: "/per year",
    features: ["Everything in Monthly", "Save 28%", "2 free months", "Priority booking"],
    cta: "Select Plan",
    popular: false,
  },
  {
    name: "Family Plan",
    price: "$49",
    period: "/per month",
    features: ["Up to 3 students", "Everything in Monthly", "Family dashboard", "Sibling discounts"],
    cta: "Select Plan",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <h1 className="text-4xl font-bold">Subscription Plans</h1>
          <p className="text-slate-600">Choose the best plan for your family</p>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-700">Current Plan</p>
              <p className="text-lg font-semibold text-slate-900">Monthly</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">Active</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl shadow-sm border ${plan.popular ? "border-purple-400 shadow-purple-100 scale-[1.02]" : "border-slate-200"}`}
              >
                {plan.popular && (
                  <div className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-br-lg rounded-tl-2xl">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{plan.name}</p>
                    <p className="text-slate-500 text-sm">{plan.period}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="text-emerald-500">✔</span> {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/login"
                    className={`w-full inline-flex justify-center items-center rounded-md px-3 py-2 text-sm font-semibold ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "border border-slate-200 text-slate-800 bg-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
