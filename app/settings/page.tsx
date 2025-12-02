"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Button from "../../components/ui/button";

interface SubscriptionData {
  planType: string;
  status: string;
  currentPeriodEnd?: string;
  trialEndsAt?: string;
  cancelAtPeriodEnd?: boolean;
}

interface AccessStatus {
  hasAccess: boolean;
  status: "active" | "trialing" | "expired" | "past_due" | "canceled" | "unpaid" | "none";
  daysRemaining: number | null;
  message: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [classReminders, setClassReminders] = useState(true);
  const [progressReports, setProgressReports] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [prefStatus, setPrefStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [prefMessage, setPrefMessage] = useState("");
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [accessStatus, setAccessStatus] = useState<AccessStatus | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelStatus, setCancelStatus] = useState<"idle" | "canceling" | "success" | "error">("idle");
  const [cancelMessage, setCancelMessage] = useState("");
  const [resumeStatus, setResumeStatus] = useState<"idle" | "resuming" | "success" | "error">("idle");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "deleting" | "error">("idle");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
      // Load user preferences
      loadPreferences();
      // Load subscription data
      loadSubscription();
      // Load payment methods
      loadPaymentMethods();
    }
  }, [session]);

  const loadSubscription = async () => {
    setLoadingSubscription(true);
    try {
      const response = await fetch("/api/subscriptions", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription || null);
        setAccessStatus(data.accessStatus || null);
      }
    } catch (error) {
      console.error("Failed to load subscription:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/preferences");
      if (response.ok) {
        const data = await response.json();
        setEmailUpdates(data.preferences.emailUpdates);
        setClassReminders(data.preferences.classReminders);
        setProgressReports(data.preferences.progressReports);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  };

  const loadPaymentMethods = async () => {
    setLoadingPaymentMethods(true);
    try {
      const response = await fetch("/api/payment-methods");
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error("Failed to load payment methods:", error);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const getCardBrandIcon = (brand: string) => {
    const brands: Record<string, string> = {
      visa: "💳 Visa",
      mastercard: "💳 Mastercard",
      amex: "💳 Amex",
      discover: "💳 Discover",
      diners: "💳 Diners",
      jcb: "💳 JCB",
      unionpay: "💳 UnionPay",
    };
    return brands[brand.toLowerCase()] || `💳 ${brand}`;
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-slate-600 dark:text-slate-400">Loading...</div>;
  }

  if (!session?.user) {
    return <div className="min-h-screen flex items-center justify-center text-slate-600 dark:text-slate-400">Please log in to view settings.</div>;
  }

  const handleSaveProfile = async () => {
    setSaveStatus("saving");
    setSaveMessage("");
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email }),
      });

      if (response.ok) {
        setSaveStatus("success");
        setSaveMessage("Profile updated successfully!");
        setTimeout(() => {
          setSaveStatus("idle");
          setSaveMessage("");
        }, 3000);
      } else {
        setSaveStatus("error");
        setSaveMessage("Failed to update profile. Please try again.");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage("An error occurred. Please try again.");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleSavePreferences = async () => {
    setPrefStatus("saving");
    setPrefMessage("");
    try {
      const response = await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailUpdates,
          classReminders,
          progressReports,
        }),
      });

      if (response.ok) {
        setPrefStatus("success");
        setPrefMessage("Preferences saved successfully!");
        setTimeout(() => {
          setPrefStatus("idle");
          setPrefMessage("");
        }, 3000);
      } else {
        setPrefStatus("error");
        setPrefMessage("Failed to save preferences. Please try again.");
        setTimeout(() => setPrefStatus("idle"), 3000);
      }
    } catch (error) {
      setPrefStatus("error");
      setPrefMessage("An error occurred. Please try again.");
      setTimeout(() => setPrefStatus("idle"), 3000);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelStatus("canceling");
    setCancelMessage("");
    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setCancelStatus("success");
        setCancelMessage("Your subscription has been set to cancel at the end of the current billing period.");
        setShowCancelModal(false);
        // Reload subscription data to reflect the change
        loadSubscription();
        setTimeout(() => {
          setCancelStatus("idle");
          setCancelMessage("");
        }, 5000);
      } else {
        const data = await response.json();
        setCancelStatus("error");
        setCancelMessage(data.error || "Failed to cancel subscription. Please try again.");
        setTimeout(() => setCancelStatus("idle"), 3000);
      }
    } catch (error) {
      setCancelStatus("error");
      setCancelMessage("An error occurred. Please try again.");
      setTimeout(() => setCancelStatus("idle"), 3000);
    }
  };

  const handleResumeSubscription = async () => {
    setResumeStatus("resuming");
    setCancelMessage("");
    try {
      const response = await fetch("/api/subscriptions/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setResumeStatus("success");
        setCancelMessage("Your subscription has been resumed!");
        loadSubscription();
        setTimeout(() => {
          setResumeStatus("idle");
          setCancelMessage("");
        }, 3000);
      } else {
        const data = await response.json();
        setResumeStatus("error");
        setCancelMessage(data.error || "Failed to resume subscription. Please try again.");
        setTimeout(() => setResumeStatus("idle"), 3000);
      }
    } catch (error) {
      setResumeStatus("error");
      setCancelMessage("An error occurred. Please try again.");
      setTimeout(() => setResumeStatus("idle"), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      return;
    }

    setDeleteStatus("deleting");
    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Sign out and redirect to home page after account deletion
        signOut({ callbackUrl: "/" });
      } else {
        const data = await response.json();
        setDeleteStatus("error");
        alert(data.error || "Failed to delete account. Please try again.");
        setTimeout(() => setDeleteStatus("idle"), 3000);
      }
    } catch (error) {
      setDeleteStatus("error");
      alert("An error occurred. Please try again.");
      setTimeout(() => setDeleteStatus("idle"), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
        </div>

        <section className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
            <span className="text-lg">👤</span>
            Profile Information
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="bg-slate-900 dark:bg-purple-600 text-white w-fit px-4"
                onClick={handleSaveProfile}
                disabled={saveStatus === "saving"}
              >
                {saveStatus === "saving" ? "Saving..." : "Save Changes"}
              </Button>
              {saveMessage && (
                <span className={`text-sm ${saveStatus === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Appearance settings removed; use the header toggle next to the bell */}

        <section className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
            <span className="text-lg">🔔</span>
            Notifications
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Choose what updates you receive</p>

          <div className="space-y-4">
            <ToggleRow
              label="Email Updates"
              description="News and feature announcements"
              checked={emailUpdates}
              onChange={setEmailUpdates}
            />
            <ToggleRow
              label="Class Reminders"
              description="Get reminded before scheduled classes"
              checked={classReminders}
              onChange={setClassReminders}
            />
            <ToggleRow
              label="Progress Reports"
              description="Weekly summaries of student progress"
              checked={progressReports}
              onChange={setProgressReports}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="w-fit px-4 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              onClick={handleSavePreferences}
              disabled={prefStatus === "saving"}
            >
              {prefStatus === "saving" ? "Saving..." : "Save Preferences"}
            </Button>
            {prefMessage && (
              <span className={`text-sm ${prefStatus === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {prefMessage}
              </span>
            )}
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
            <span className="text-lg">💳</span>
            Subscription
          </div>

          {loadingSubscription ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48" />
            </div>
          ) : accessStatus ? (
            <div className="space-y-4">
              {/* Subscription Status */}
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  accessStatus.status === "active" || accessStatus.status === "trialing"
                    ? "bg-green-500"
                    : accessStatus.status === "past_due" || accessStatus.status === "unpaid"
                      ? "bg-red-500"
                      : "bg-amber-500"
                }`} />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {accessStatus.status === "trialing"
                      ? "Free Trial"
                      : subscription?.planType === "MONTHLY" || subscription?.planType === "monthly"
                        ? "Premium Monthly"
                        : subscription?.planType === "ANNUAL" || subscription?.planType === "annual"
                          ? "Premium Annual"
                          : subscription?.planType === "FAMILY" || subscription?.planType === "family"
                            ? "Premium Family"
                            : subscription?.planType === "unlimited"
                              ? "Admin Access"
                              : subscription?.planType === "instructor"
                                ? "Instructor Access"
                                : "No Plan"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {accessStatus.message}
                  </p>
                </div>
              </div>

              {/* Days Remaining */}
              {accessStatus.daysRemaining !== null && accessStatus.hasAccess && (
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">{accessStatus.daysRemaining}</span> days remaining
                    {subscription?.currentPeriodEnd && (
                      <span className="text-slate-500 dark:text-slate-400">
                        {" "}(renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()})
                      </span>
                    )}
                    {subscription?.trialEndsAt && accessStatus.status === "trialing" && (
                      <span className="text-slate-500 dark:text-slate-400">
                        {" "}(trial ends {new Date(subscription.trialEndsAt).toLocaleDateString()})
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Cancel pending notice with Resume button */}
              {subscription?.cancelAtPeriodEnd && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      Your subscription is set to cancel at the end of the current period.
                    </p>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white w-fit"
                      onClick={handleResumeSubscription}
                      disabled={resumeStatus === "resuming"}
                    >
                      {resumeStatus === "resuming" ? "Resuming..." : "Resume Subscription"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Upgrade button - show for trial users or active subscribers who can upgrade */}
                {accessStatus.hasAccess && subscription?.planType !== "unlimited" && subscription?.planType !== "instructor" && (
                  <Link href="/pricing">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      {accessStatus.status === "trialing" ? "Upgrade Now" : "Change Plan"}
                    </Button>
                  </Link>
                )}

                {/* Cancel button - show for active/trialing users (not for canceled or admin/instructor) */}
                {accessStatus.hasAccess &&
                 !subscription?.cancelAtPeriodEnd &&
                 subscription?.planType !== "unlimited" &&
                 subscription?.planType !== "instructor" && (
                  <Button
                    variant="outline"
                    className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Subscription
                  </Button>
                )}

                {/* Update Payment - show for past_due or unpaid */}
                {!accessStatus.hasAccess && (accessStatus.status === "past_due" || accessStatus.status === "unpaid") && (
                  <Link href="/api/stripe/portal">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Update Payment Method
                    </Button>
                  </Link>
                )}

                {/* Resubscribe - show for expired or canceled */}
                {!accessStatus.hasAccess && (accessStatus.status === "expired" || accessStatus.status === "canceled") && (
                  <Link href="/pricing">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Resubscribe
                    </Button>
                  </Link>
                )}

                {/* Start trial - show for users with no subscription */}
                {accessStatus.status === "none" && (
                  <Link href="/checkout?plan=free-trial">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Start Free Trial
                    </Button>
                  </Link>
                )}
              </div>

              {/* Cancel status message */}
              {cancelMessage && (
                <div className={`p-3 rounded-lg ${
                  cancelStatus === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                }`}>
                  <p className="text-sm">{cancelMessage}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-600 dark:text-slate-400">No subscription information available.</p>
              <Link href="/pricing">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  View Plans
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Payment Methods Section */}
        <section className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
            <span className="text-lg">💳</span>
            Payment Methods
          </div>

          {loadingPaymentMethods ? (
            <div className="animate-pulse space-y-3">
              <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((card) => (
                <div
                  key={card.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    card.isDefault
                      ? "border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {card.brand.toLowerCase() === "visa" && "💳"}
                      {card.brand.toLowerCase() === "mastercard" && "💳"}
                      {card.brand.toLowerCase() === "amex" && "💳"}
                      {!["visa", "mastercard", "amex"].includes(card.brand.toLowerCase()) && "💳"}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} •••• {card.last4}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Expires {card.expMonth.toString().padStart(2, "0")}/{card.expYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.isDefault && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <Link href="/api/stripe/portal">
                <Button variant="outline" className="w-full mt-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                  Manage Payment Methods
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">No payment methods on file</p>
              {accessStatus?.hasAccess && (
                <Link href="/api/stripe/portal">
                  <Button variant="outline" className="dark:border-slate-600 dark:text-slate-200">
                    Add Payment Method
                  </Button>
                </Link>
              )}
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
            <span className="text-lg">🛡️</span>
            Account
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 w-fit"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              Log Out
            </Button>
            <Button
              variant="outline"
              className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 w-fit"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Deleting your account will permanently remove all your data and cannot be undone.
          </p>
        </section>
      </div>

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Cancel Subscription?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to cancel your subscription? You will:
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✕</span>
                  <span>Lose access to all premium courses and live classes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✕</span>
                  <span>No longer be able to book 1-on-1 sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Keep access until the end of your current billing period</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 dark:border-slate-600 dark:text-slate-200"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelStatus === "canceling"}
              >
                Keep Subscription
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleCancelSubscription}
                disabled={cancelStatus === "canceling"}
              >
                {cancelStatus === "canceling" ? "Canceling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmText("");
              setDeleteStatus("idle");
            }}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="text-2xl">🗑️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Delete Account?
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  This action is permanent
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to permanently delete your account? This will:
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✕</span>
                  <span>Cancel any active subscriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✕</span>
                  <span>Delete all your progress and certificates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✕</span>
                  <span>Remove all student profiles linked to this account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✕</span>
                  <span>Permanently erase all your data</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Type <span className="font-bold text-red-600 dark:text-red-400">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-600"
              />
            </div>

            {deleteStatus === "error" && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Failed to delete account. Please try again or contact support.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 dark:border-slate-600 dark:text-slate-200"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                  setDeleteStatus("idle");
                }}
                disabled={deleteStatus === "deleting"}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || deleteStatus === "deleting"}
              >
                {deleteStatus === "deleting" ? "Deleting..." : "Delete Forever"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full border transition ${
          checked
            ? "bg-slate-900 dark:bg-purple-600 border-slate-900 dark:border-purple-600"
            : "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
        }`}
      >
        <span
          className={`block w-5 h-5 bg-white dark:bg-slate-200 rounded-full shadow transform transition ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
