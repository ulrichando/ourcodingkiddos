// 1-on-1 Class Pricing Configuration
// Prices are in cents (USD)

export const ONE_ON_ONE_PRICING = {
  // Base rate per session based on duration (in cents)
  rates: {
    30: 4000,   // $40 for 30 minutes
    60: 7500,   // $75 for 60 minutes
    90: 10000,  // $100 for 90 minutes
  },

  // Discount percentages for package deals (based on total sessions)
  packageDiscounts: {
    1: 0,       // No discount for single session
    4: 10,      // 10% off for 4 sessions
    8: 15,      // 15% off for 8 sessions
    12: 20,     // 20% off for 12 sessions
  },
} as const;

export type Duration = keyof typeof ONE_ON_ONE_PRICING.rates;
export type SessionPackage = keyof typeof ONE_ON_ONE_PRICING.packageDiscounts;

export function getBaseRate(duration: number): number {
  const rate = ONE_ON_ONE_PRICING.rates[duration as Duration];
  if (!rate) {
    // Default to 60-minute rate if invalid duration
    return ONE_ON_ONE_PRICING.rates[60];
  }
  return rate;
}

export function getPackageDiscount(sessions: number): number {
  // Find the best matching discount tier
  const tiers = Object.keys(ONE_ON_ONE_PRICING.packageDiscounts)
    .map(Number)
    .sort((a, b) => b - a);

  for (const tier of tiers) {
    if (sessions >= tier) {
      return ONE_ON_ONE_PRICING.packageDiscounts[tier as SessionPackage];
    }
  }
  return 0;
}

export function calculatePrice(duration: number, sessions: number): {
  basePrice: number;
  discount: number;
  discountPercent: number;
  totalPrice: number;
  pricePerSession: number;
} {
  const baseRate = getBaseRate(duration);
  const basePrice = baseRate * sessions;
  const discountPercent = getPackageDiscount(sessions);
  const discount = Math.round(basePrice * (discountPercent / 100));
  const totalPrice = basePrice - discount;
  const pricePerSession = Math.round(totalPrice / sessions);

  return {
    basePrice,
    discount,
    discountPercent,
    totalPrice,
    pricePerSession,
  };
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getPricingTiers() {
  return [
    { sessions: 1, label: "Single Session", description: "Try it out" },
    { sessions: 4, label: "4 Sessions", description: "Weekly for 1 month", badge: "Popular" },
    { sessions: 8, label: "8 Sessions", description: "Twice weekly for 1 month", badge: "Best Value" },
    { sessions: 12, label: "12 Sessions", description: "Weekly for 3 months" },
  ];
}

export function getDurationOptions() {
  return [
    { value: 30, label: "30 minutes", description: "Quick focused session" },
    { value: 60, label: "60 minutes", description: "Standard session", recommended: true },
    { value: 90, label: "90 minutes", description: "Deep dive session" },
  ];
}
