"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Button from "../../../../components/ui/button";
import { Save, Settings as SettingsIcon } from "lucide-react";

type Settings = {
  siteName: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  defaultXpPerLesson: number;
  xpPerLevel: number;
  maxStudentsPerParent: number;
  sessionDurationMinutes: number;
  enableNotifications: boolean;
  enableMessaging: boolean;
  enableCertificates: boolean;
  enableBadges: boolean;
  stripeEnabled: boolean;
  demoMode: boolean;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings);
        } else {
          setError(`Failed to load settings: ${res.status} ${res.statusText}`);
        }
      } catch (err: any) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">System Settings</h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">No settings found.</p>
        </div>
      </AdminLayout>
    );
  }

  const toggleSetting = (key: keyof Settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const updateSetting = (key: keyof Settings, value: string | number) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">System Settings</h1>
        </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        {/* General Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            General Settings
          </h2>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSetting("siteName", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Default XP per Lesson
                </label>
                <input
                  type="number"
                  value={settings.defaultXpPerLesson}
                  onChange={(e) => updateSetting("defaultXpPerLesson", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  XP per Level
                </label>
                <input
                  type="number"
                  value={settings.xpPerLevel}
                  onChange={(e) => updateSetting("xpPerLevel", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Max Students per Parent
                </label>
                <input
                  type="number"
                  value={settings.maxStudentsPerParent}
                  onChange={(e) => updateSetting("maxStudentsPerParent", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Session Duration (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionDurationMinutes}
                  onChange={(e) => updateSetting("sessionDurationMinutes", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Feature Toggles</h2>

          <div className="space-y-3">
            {[
              { key: "maintenanceMode", label: "Maintenance Mode", desc: "Disable access to the platform for non-admins" },
              { key: "allowRegistration", label: "Allow Registration", desc: "Enable new user signups" },
              { key: "requireEmailVerification", label: "Require Email Verification", desc: "Users must verify email before accessing platform" },
              { key: "enableNotifications", label: "Enable Notifications", desc: "Allow platform notifications" },
              { key: "enableMessaging", label: "Enable Messaging", desc: "Allow user-to-user messaging" },
              { key: "enableCertificates", label: "Enable Certificates", desc: "Issue certificates for course completion" },
              { key: "enableBadges", label: "Enable Badges", desc: "Award badges for achievements" },
              { key: "stripeEnabled", label: "Stripe Payments", desc: "Enable Stripe payment processing" },
              { key: "demoMode", label: "Demo Mode", desc: "Show demo data for testing" },
            ].map((setting) => {
              const isEnabled = settings[setting.key as keyof Settings] as boolean;
              return (
                <div key={setting.key} className="flex items-center justify-between py-3 border-b last:border-b-0 border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{setting.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{setting.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isEnabled}
                      onChange={() => toggleSetting(setting.key as keyof Settings)}
                    />
                    <div className={`relative w-11 h-6 rounded-full transition-all duration-300 ease-in-out ${
                      isEnabled ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-200 dark:bg-slate-600"
                    }`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                        isEnabled ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
          {success && (
            <p className="mt-3 text-sm text-green-600 dark:text-green-400">Settings saved successfully!</p>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
