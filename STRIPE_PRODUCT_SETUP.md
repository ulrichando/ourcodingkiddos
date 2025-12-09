# 🚀 Stripe Product Setup Guide

This guide will walk you through creating the three subscription products needed for Coding Kiddos.

---

## 📋 What You'll Create

1. **Free Trial** - 7-day free trial (converts to monthly)
2. **Monthly Plan** - $29/month subscription
3. **Family Plan** - $49/month for up to 3 students

---

## 🔐 Step 1: Access Your Stripe Dashboard

1. Go to **https://dashboard.stripe.com**
2. Log in with your Stripe account
3. Make sure you're in **Test Mode** (toggle in the top right) for initial testing
   - You can switch to **Live Mode** later for real payments

---

## 📦 Step 2: Create Product #1 - Free Trial

### 2.1 Navigate to Products

1. In the left sidebar, click **"Products"** (or **"Product catalog"**)
2. Click the **"+ Add product"** button (top right)

### 2.2 Fill in Product Details

**Product Information:**
- **Name:** `Free Trial - Coding Kiddos`
- **Description:** `7-day free trial with full access to all courses and features`
- **Image:** (Optional) Upload your logo or product image

**Pricing Information:**
- **Pricing model:** Select `Standard pricing`
- **Price:** Enter `0.00`
- **Billing period:** Select `Monthly`
- **Currency:** `USD (United States Dollar)`

**Advanced Options (Click "Show more pricing options"):**
- **Trial period:** Check ✅ `Add a trial`
  - Enter `7` days
- **Usage type:** `Licensed` (default)

### 2.3 Save the Product

1. Click **"Add product"** button at the top right
2. You'll be redirected to the product page
3. **IMPORTANT:** Copy the **Price ID** - it looks like `price_1ABC123xyz...`
   - You'll find it under the "Pricing" section
   - It starts with `price_`

### 2.4 Save the Price ID

Open your `.env.local` file and add:
```bash
STRIPE_FREE_TRIAL_PRICE_ID="price_YOUR_PRICE_ID_HERE"
```

---

## 💳 Step 3: Create Product #2 - Monthly Plan

### 3.1 Add Another Product

1. Go back to **Products** page
2. Click **"+ Add product"** again

### 3.2 Fill in Product Details

**Product Information:**
- **Name:** `Monthly Plan - Coding Kiddos`
- **Description:** `Monthly subscription with full access to all courses, live classes, and features`
- **Image:** (Optional) Upload your logo

**Pricing Information:**
- **Pricing model:** `Standard pricing`
- **Price:** Enter `29.00`
- **Billing period:** `Monthly`
- **Currency:** `USD`

**Advanced Options:**
- **Trial period:** Leave unchecked ⬜ (no trial for this plan)
- **Usage type:** `Licensed`

### 3.3 Save and Copy Price ID

1. Click **"Add product"**
2. Copy the **Price ID** (starts with `price_`)

### 3.4 Save the Price ID

Add to `.env.local`:
```bash
STRIPE_MONTHLY_PRICE_ID="price_YOUR_PRICE_ID_HERE"
```

---

## 👨‍👩‍👧‍👦 Step 4: Create Product #3 - Family Plan

### 4.1 Add Another Product

1. Go to **Products** page
2. Click **"+ Add product"**

### 4.2 Fill in Product Details

**Product Information:**
- **Name:** `Family Plan - Coding Kiddos`
- **Description:** `Monthly family subscription for up to 3 students with full access to all features`
- **Image:** (Optional) Upload your logo

**Pricing Information:**
- **Pricing model:** `Standard pricing`
- **Price:** Enter `49.00`
- **Billing period:** `Monthly`
- **Currency:** `USD`

**Advanced Options:**
- **Trial period:** Leave unchecked ⬜
- **Usage type:** `Licensed`

### 4.3 Save and Copy Price ID

1. Click **"Add product"**
2. Copy the **Price ID**

### 4.4 Save the Price ID

Add to `.env.local`:
```bash
STRIPE_FAMILY_PRICE_ID="price_YOUR_PRICE_ID_HERE"
```

---

## ✅ Step 5: Verify Your `.env.local` File

Your `.env.local` should now have all three Price IDs:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51I7SEKH3Se4fhYoC...
STRIPE_SECRET_KEY=sk_live_51I7SEKH3Se4fhYoC...

# Stripe Price IDs
STRIPE_FREE_TRIAL_PRICE_ID="price_1234567890abcdef"
STRIPE_MONTHLY_PRICE_ID="price_0987654321fedcba"
STRIPE_FAMILY_PRICE_ID="price_abcdef1234567890"
```

**⚠️ IMPORTANT:** Make sure each Price ID is wrapped in quotes!

---

## 🔄 Step 6: Restart Your Dev Server

After updating `.env.local`, restart your development server:

```bash
# Press Ctrl+C to stop the current server
# Then restart it:
npm run dev
```

---

## 🧪 Step 7: Test the Integration

### 7.1 Test in Browser

1. Go to **http://localhost:3000/dashboard/parent**
2. Login as a parent (or create a new parent account)
3. You should see the **"Start Free Trial"** button
4. Click it to go to checkout
5. Use the Stripe test card:
   ```
   Card: 4242 4242 4242 4242
   Expiry: 12/25
   CVC: 123
   ZIP: 12345
   ```

### 7.2 Verify in Stripe Dashboard

After testing:
1. Go to your Stripe Dashboard
2. Click **"Customers"** in the left sidebar
3. You should see your test customer
4. Click on the customer to view their subscription details

---

## 🎯 Quick Reference: Where to Find Price IDs

After creating a product:

1. Go to **Products** in Stripe Dashboard
2. Click on the product name
3. Scroll down to the **"Pricing"** section
4. You'll see the Price ID like: `price_1ABC123xyz...`
5. Click the **copy icon** next to it

**Visual Hint:** The Price ID is displayed right under the price amount with a small copy button next to it.

---

## 🔧 Common Issues & Solutions

### Issue: "Invalid plan ID" error

**Solution:**
- Check that all three Price IDs are in `.env.local`
- Make sure they're wrapped in quotes
- Verify you copied the entire Price ID (starts with `price_`)
- Restart your dev server after updating `.env.local`

### Issue: "No such price" error

**Solution:**
- Make sure you're using the correct mode (Test/Live)
- Your `.env.local` Price IDs should match the mode:
  - Test mode Price IDs work with test API keys
  - Live mode Price IDs work with live API keys

### Issue: Checkout redirects but fails

**Solution:**
- Check that your `STRIPE_SECRET_KEY` is set correctly
- Verify the Price ID exists in your Stripe Dashboard
- Check browser console for errors

---

## 🌐 Going Live (Production)

When you're ready to accept real payments:

1. **Switch to Live Mode** in Stripe Dashboard (toggle top right)
2. **Create the same 3 products** but in Live Mode
3. **Get new Price IDs** (live mode has different IDs)
4. **Update `.env.local`** with live Price IDs
5. **Use Live API Keys**:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

---

## 📚 Additional Resources

- **Stripe Documentation:** https://stripe.com/docs/products-prices/overview
- **Stripe Test Cards:** https://stripe.com/docs/testing
- **Webhook Setup:** See `STRIPE_SETUP_GUIDE.md` for webhook configuration

---

## ✅ Checklist

Before testing, make sure you have:

- [ ] Created Free Trial product in Stripe
- [ ] Created Monthly Plan product in Stripe
- [ ] Created Family Plan product in Stripe
- [ ] Copied all three Price IDs
- [ ] Added all Price IDs to `.env.local`
- [ ] Wrapped Price IDs in quotes
- [ ] Restarted dev server
- [ ] Stripe API keys are set in `.env.local`

---

**Need help?** If you encounter issues, check:
1. Browser console for errors
2. Terminal/server logs for backend errors
3. Stripe Dashboard logs for API errors

**You're all set! 🎉** Now you can test the checkout flow with the test card numbers.
