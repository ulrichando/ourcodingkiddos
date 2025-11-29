"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  Gift,
  Lock,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
  Building2,
  Clock,
} from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Badge from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Plan = {
  id: string;
  name: string;
  price: number;
  period: string;
  maxStudents: number;
  popular?: boolean;
};

const plans: Plan[] = [
  { id: "free-trial", name: "Free Trial", price: 0, period: "7 days", maxStudents: 1 },
  { id: "monthly", name: "Monthly Plan", price: 29, period: "month", maxStudents: 1, popular: true },
  { id: "family-plan", name: "Family Plan", price: 49, period: "month", maxStudents: 3 },
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState("monthly");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "bank">("card");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [checkingPromo, setCheckingPromo] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("plan");
    if (fromUrl) setSelected(fromUrl);
  }, [searchParams]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ck_coupons");
      if (saved) setCoupons(JSON.parse(saved));
    } catch {
      setCoupons([]);
    }
  }, []);

  const plan = useMemo(() => plans.find((p) => p.id === selected) || plans[1], [selected]);

  const handlePromo = async () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    setCheckingPromo(true);
    try {
      const match = coupons.find((c) => c.code === code && c.isActive !== false);
      if (!match) {
        setPromoApplied(false);
        setDiscount(0);
        return;
      }
      const now = new Date();
      if (match.validFrom && new Date(match.validFrom) > now) {
        setPromoApplied(false);
        setDiscount(0);
        return;
      }
      if (match.validUntil && new Date(match.validUntil) < now) {
        setPromoApplied(false);
        setDiscount(0);
        return;
      }
      if (match.maxUses && match.currentUses >= match.maxUses) {
        setPromoApplied(false);
        setDiscount(0);
        return;
      }
      const amount =
        match.discountType === "percentage"
          ? plan.price * (Number(match.discountValue || 0) / 100)
          : Number(match.discountValue || 0) / 100;
      setPromoApplied(true);
      setDiscount(amount);

      // increment local usage
      const updated = coupons.map((c) =>
        c.code === code ? { ...c, currentUses: Number(c.currentUses || 0) + 1 } : c
      );
      setCoupons(updated);
      try {
        localStorage.setItem("ck_coupons", JSON.stringify(updated));
      } catch {
        /* ignore */
      }
    } finally {
      setCheckingPromo(false);
    }
  };

  const finalPrice = Math.max(0, plan.price - discount);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/pricing" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Back to Plans
          </Link>
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-600">
            <div className="inline-flex items-center gap-1 text-green-600">
              <Shield className="h-3.5 w-3.5" />
              100% Secure
            </div>
            <div className="inline-flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              SSL Encrypted
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-purple-600">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">✓</div>
            <span className="font-medium">Choose Plan</span>
          </div>
          <div className="w-12 h-0.5 bg-purple-600" />
          <div className="flex items-center gap-2 text-purple-600">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">2</div>
            <span className="font-medium">Payment</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">3</div>
            <span>Complete</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr,0.85fr] gap-8">
          {/* Left column: Payment method & card details */}
          <div className="space-y-6">
            {/* Payment method */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Payment Method
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "card", label: "Credit Card", icon: <CreditCard className="h-5 w-5 text-slate-600" /> },
                  { id: "paypal", label: "PayPal", icon: <div className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded flex items-center justify-center">P</div> },
                  { id: "bank", label: "Bank", icon: <Building2 className="h-5 w-5 text-slate-600" /> },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id as any)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                      paymentMethod === opt.id ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {opt.icon}
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card details */}
            {paymentMethod === "card" && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Card Details
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-700">Cardholder Name</label>
                  <Input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-700">Card Number</label>
                  <div className="relative">
                    <Input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="pl-11 h-11 tracking-widest"
                    />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-[9px] font-bold flex items-center justify-center">VISA</div>
                      <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-700">Expiry Date</label>
                    <Input
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-700">Security Code (CVV)</label>
                    <div className="relative">
                      <Input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        className="h-11"
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Promo */}
                <div className="space-y-2">
                  <label className="text-sm text-slate-700 flex items-center gap-2">
                    <Gift className="h-4 w-4 text-purple-500" />
                    Have a promo code?
                  </label>
                  <div className="grid grid-cols-[1fr,120px] gap-2">
                    <Input
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="Enter code"
                      disabled={promoApplied}
                      className="h-11"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11"
                      onClick={handlePromo}
                      disabled={promoApplied || !promo || checkingPromo}
                    >
                      {promoApplied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : checkingPromo ? "Checking..." : "Apply"}
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Promo applied! You save ${discount.toFixed(2)}
                    </p>
                  )}
                </div>

                <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
                  {plan.id === "free-trial" ? "Start Free Trial" : `Pay $${finalPrice.toFixed(2)}`}
                </Button>
                <p className="text-xs text-center text-slate-500">
                  🔒 Your payment is secured with 256-bit SSL encryption
                </p>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-3 text-center">
                <div className="w-14 h-14 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center mx-auto text-xl">P</div>
                <p className="text-slate-600">You'll be redirected to PayPal to complete payment.</p>
                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">Continue with PayPal</Button>
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-3 text-center">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-slate-600">Connect your bank account for direct payment.</p>
                <Button className="w-full h-12 bg-slate-900 hover:bg-slate-950 text-white">Connect Bank</Button>
              </div>
            )}
          </div>

          {/* Right column: Summary */}
          <div className="space-y-4 lg:sticky lg:top-20 self-start">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6">
                <Badge className="bg-white/20 text-white border-0 mb-2">
                  {plan.id === "free-trial" ? "🎉 Free Trial" : "✨ Selected Plan"}
                </Badge>
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-white/80">/{plan.period}</span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-semibold text-slate-800">Order Summary</h3>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{plan.name}</span>
                  <span className="font-medium">${plan.price.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Promo Discount</span>
                    <span>- ${discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Due Today</span>
                  <span className="text-purple-600">{plan.id === "free-trial" ? "$0.00" : `$${finalPrice.toFixed(2)}`}</span>
                </div>
                {plan.id === "free-trial" && (
                  <div className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    After 7 days, you'll be charged $29/month unless you cancel.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                What's Included
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {[
                  { icon: Zap, text: "Unlimited course access" },
                  { icon: Users, text: `${plan.maxStudents} student account${plan.maxStudents > 1 ? "s" : ""}` },
                  { icon: Sparkles, text: "Live instructor classes" },
                  { icon: Star, text: "Certificates & badges" },
                  { icon: Shield, text: "Safe environment" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-purple-500" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic mb-3">
                "My daughter went from watching videos to creating her own apps. Worth every penny!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div>
                  <p className="font-semibold text-sm">Sarah M.</p>
                  <p className="text-xs text-slate-500">Parent • Premium Member</p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-slate-600">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Shield className="h-5 w-5" />
                30-Day Money Back Guarantee
              </div>
              <p className="mt-1">Not satisfied? Get a full refund, no questions asked.</p>
            </div>
          </div>
        </div>

        {/* Footer badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
          <div className="inline-flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            Secure Payment
          </div>
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Instant Access
          </div>
          <div className="inline-flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            30-Day Guarantee
          </div>
        </div>
      </div>
    </main>
  );
}
