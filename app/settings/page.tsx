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

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
      // Load user preferences
      loadPreferences();
      // Load subscription data
      loadSubscription();
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

              {/* Cancel pending notice */}
              {subscription?.cancelAtPeriodEnd && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Your subscription is set to cancel at the end of the current period.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {accessStatus.hasAccess && subscription?.planType !== "unlimited" && subscription?.planType !== "instructor" && (
                  <Link href="/api/stripe/portal">
                    <Button variant="outline" className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                      Manage Subscription
                    </Button>
                  </Link>
                )}

                {accessStatus.status === "trialing" && (
                  <Link href="/pricing">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Upgrade Now
                    </Button>
                  </Link>
                )}

                {!accessStatus.hasAccess && accessStatus.status !== "none" && (
                  <Link href="/api/stripe/portal">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Update Payment Method
                    </Button>
                  </Link>
                )}

                {accessStatus.status === "none" && (
                  <Link href="/checkout?plan=free-trial">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Start Free Trial
                    </Button>
                  </Link>
                )}
              </div>
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

        <section className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
            <span className="text-lg">🛡️</span>
            Account
          </div>
          <Button
            variant="outline"
            className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 w-fit"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            Log Out
          </Button>
        </section>
      </div>
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
