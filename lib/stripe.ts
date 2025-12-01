import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const STRIPE_PRICE_IDS = {
  'free-trial': process.env.STRIPE_FREE_TRIAL_PRICE_ID || '',
  'monthly': process.env.STRIPE_MONTHLY_PRICE_ID || '',
  'family-plan': process.env.STRIPE_FAMILY_PRICE_ID || '',
} as const;

export type PlanId = keyof typeof STRIPE_PRICE_IDS;

export const getPlanDetails = (planId: PlanId) => {
  const plans = {
    'free-trial': {
      name: 'Free Trial',
      price: 0,
      priceInCents: 0,
      period: '7 days',
      maxStudents: 1,
      features: [
        '3 sample lessons',
        'Code playground access',
        'Basic support',
      ],
    },
    'monthly': {
      name: 'Monthly Plan',
      price: 29,
      priceInCents: 2900,
      period: 'month',
      maxStudents: 1,
      popular: true,
      features: [
        'Unlimited courses',
        'Live classes included',
        'Progress tracking',
        'Certificates',
        'Priority support',
      ],
    },
    'family-plan': {
      name: 'Family Plan',
      price: 49,
      priceInCents: 4900,
      period: 'month',
      maxStudents: 3,
      features: [
        'Up to 3 students',
        'Everything in Monthly',
        'Family dashboard',
        'Sibling discounts',
      ],
    },
  };

  return plans[planId];
};
