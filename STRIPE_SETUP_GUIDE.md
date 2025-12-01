# Stripe Integration Setup Guide

Your Stripe integration is fully configured! Follow these steps to complete the setup.

## ✅ What's Already Done

- ✅ Stripe packages installed (`stripe` and `@stripe/stripe-js`)
- ✅ API routes created for checkout and webhooks
- ✅ Database schema updated with Subscription model
- ✅ Checkout page integrated with Stripe
- ✅ Success page created
- ✅ Your Stripe Live keys are configured in `.env.local`

## 🔑 Your Stripe Keys (Already Configured)

Your `.env.local` file has been configured with:
- **Publishable Key**: `pk_live_51I7SEKH3Se4fhYoC...` (Safe for client-side use)
- **Secret Key**: `sk_live_51I7SEKH3Se4fhYoC...` (Server-side only)

## 📦 Next Steps: Create Stripe Products

You need to create three products in your Stripe Dashboard and add their Price IDs to your environment variables.

### Step 1: Access Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Navigate to **Products** → **Add Product**

### Step 2: Create Products

Create these three products:

#### Product 1: Free Trial (7-Day Trial)
- **Name**: Free Trial
- **Description**: 7-day free trial, then $29/month
- **Price**: $0.00 (with 7-day trial)
- **Billing**: Recurring - Monthly
- **Trial Period**: 7 days
- **After Trial**: Converts to $29/month

**After creating, copy the Price ID** (starts with `price_...`)

#### Product 2: Monthly Plan
- **Name**: Monthly Plan
- **Description**: Full access for 1 student
- **Price**: $29.00
- **Billing**: Recurring - Monthly
- **Features**:
  - Unlimited courses
  - Live classes included
  - Progress tracking
  - Certificates
  - Priority support

**After creating, copy the Price ID** (starts with `price_...`)

#### Product 3: Family Plan
- **Name**: Family Plan
- **Description**: Full access for up to 3 students
- **Price**: $49.00
- **Billing**: Recurring - Monthly
- **Features**:
  - Up to 3 students
  - Everything in Monthly
  - Family dashboard
  - Sibling discounts

**After creating, copy the Price ID** (starts with `price_...`)

### Step 3: Add Price IDs to Environment

After creating all three products, add the Price IDs to your `.env.local` file:

```bash
# Stripe Price IDs
STRIPE_FREE_TRIAL_PRICE_ID="price_xxxxxxxxxxxxx"
STRIPE_MONTHLY_PRICE_ID="price_xxxxxxxxxxxxx"
STRIPE_FAMILY_PRICE_ID="price_xxxxxxxxxxxxx"
```

### Step 4: Configure Webhook

1. Go to **Developers** → **Webhooks** in your Stripe Dashboard
2. Click **Add endpoint**
3. **Endpoint URL**: `https://yourcodingkiddos.com/api/stripe/webhook`
   - For testing locally: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) or a service like [ngrok](https://ngrok.com/)
4. **Events to listen to**:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Click **Add endpoint**
6. **Copy the Signing Secret** (starts with `whsec_...`)
7. Add it to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
```

## 🧪 Testing the Integration

### Local Testing with Stripe CLI

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to local dev server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Use test mode for development:
- Switch to test mode in Stripe Dashboard
- Use test card: `4242 4242 4242 4242`
- Any future expiration date
- Any 3-digit CVC

### Test Card Numbers

- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

## 📋 Checkout Flow

When a user clicks "Pay" on the checkout page:

1. **Frontend** (`/checkout`):
   - User selects a plan
   - Clicks "Pay" button
   - Frontend calls `/api/stripe/checkout`

2. **Backend** (`/api/stripe/checkout`):
   - Creates/retrieves Stripe customer
   - Creates Stripe Checkout Session
   - Returns redirect URL

3. **Stripe Hosted Checkout**:
   - User enters payment details on Stripe's secure page
   - Stripe processes payment

4. **Webhook** (`/api/stripe/webhook`):
   - Stripe sends events to your webhook
   - Subscription is created/updated in database
   - User gains access to content

5. **Success** (`/checkout/success`):
   - User is redirected back to your site
   - Success page displays confirmation

## 🔐 Security Notes

- ✅ Your Secret Key is **only** used server-side
- ✅ Webhook signature verification is enabled
- ✅ Publishable Key is safe for client-side use
- ✅ All payment processing happens on Stripe's servers
- ✅ Your site never handles raw card data

## 🚀 Going Live

Before launching to production:

1. **Switch to Live Mode** in Stripe Dashboard
2. **Test thoroughly** in Test Mode first
3. **Verify webhook endpoint** is accessible from the internet
4. **Enable 3D Secure** for additional security (recommended)
5. **Set up email receipts** in Stripe settings
6. **Configure tax collection** if applicable
7. **Review payout settings**

## 📊 Monitoring

Monitor your Stripe integration:
- **Dashboard**: https://dashboard.stripe.com
- **Payments**: Track successful/failed payments
- **Subscriptions**: Monitor active subscriptions
- **Webhooks**: Check webhook delivery logs
- **Logs**: View detailed API request logs

## 🆘 Troubleshooting

### Webhook Not Receiving Events
- Verify endpoint URL is correct and publicly accessible
- Check webhook signing secret matches `.env.local`
- View webhook logs in Stripe Dashboard

### Checkout Session Not Creating
- Check Stripe Secret Key in `.env.local`
- Verify Price IDs are correct
- Check server logs for errors

### Payment Succeeds But No Subscription
- Check webhook is configured and receiving events
- Verify webhook secret is correct
- Check webhook handler logs

## 📚 Resources

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Testing Stripe](https://stripe.com/docs/testing)
- [Webhooks Guide](https://stripe.com/docs/webhooks)

---

## ✨ You're All Set!

Once you've:
1. Created the three products in Stripe
2. Added the Price IDs to `.env.local`
3. Configured the webhook endpoint

Your checkout will be fully functional! 🎉

**Need help?** Check the [Stripe Docs](https://stripe.com/docs) or reach out to Stripe Support.
