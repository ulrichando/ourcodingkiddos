"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Button from "../../../../components/ui/button";
import {  Save,
  Settings as SettingsIcon,
  Mail,
  Clock,
  Users,
  Shield,
  Palette,
  Wrench,
  AlertTriangle,
  Eye,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type Settings = {
  siteName: string;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  maintenanceEndTime: string | null;
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
  // Email notification settings
  emailNewEnrollment: boolean;
  emailPaymentReceived: boolean;
  emailCourseCompletion: boolean;
  emailWeeklyDigest: boolean;
  emailSystemAlerts: boolean;
  // Session defaults
  defaultSessionDuration: number;
  minSessionDuration: number;
  maxSessionDuration: number;
  sessionBufferMinutes: number;
  // Age group definitions
  ageGroupYoung: { min: number; max: number };
  ageGroupMiddle: { min: number; max: number };
  ageGroupTeen: { min: number; max: number };
  // Appearance
  primaryColor: string;
  accentColor: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "maintenance" | "email" | "sessions" | "age" | "appearance">("general");

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
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Settings</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">System Settings</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Settings</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">System Settings</h1>
          </div>
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
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Settings</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">System Settings</h1>
          </div>
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
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Settings</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">System Settings</h1>
        </div>

      {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          {[
            { id: "general", label: "General", icon: SettingsIcon },
            { id: "maintenance", label: "Maintenance", icon: Wrench, highlight: settings?.maintenanceMode },
            { id: "email", label: "Email Notifications", icon: Mail },
            { id: "sessions", label: "Sessions", icon: Clock },
            { id: "age", label: "Age Groups", icon: Users },
            { id: "appearance", label: "Appearance", icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const isHighlighted = 'highlight' in tab && tab.highlight;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isHighlighted ? 'text-yellow-500' : ''}`} />
                {tab.label}
                {isHighlighted && (
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        {/* General Settings Tab */}
        {activeTab === "general" && (
          <>
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
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Feature Toggles
              </h2>

              <div className="space-y-3">
                {[
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
          </>
        )}

        {/* Maintenance Mode Tab */}
        {activeTab === "maintenance" && (
          <div className="space-y-6">
            {/* Status Banner */}
            {settings.maintenanceMode && (
              <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Maintenance Mode is Active</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Non-admin users cannot access the site or log in.</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Maintenance Mode Settings
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enable maintenance mode to temporarily block access to the site. Only admins can access the site during maintenance.
              </p>

              {/* Main Toggle */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Enable Maintenance Mode</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Block all non-admin access to the platform</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={settings.maintenanceMode}
                      onChange={() => toggleSetting("maintenanceMode" as keyof Settings)}
                    />
                    <div className={`relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out ${
                      settings.maintenanceMode ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-slate-200 dark:bg-slate-600"
                    }`}>
                      <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                        settings.maintenanceMode ? "translate-x-7" : "translate-x-0"
                      }`} />
                    </div>
                  </label>
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Custom Maintenance Message
                </label>
                <textarea
                  value={settings.maintenanceMessage || ""}
                  onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value || null })}
                  placeholder="We're currently performing scheduled maintenance to improve your learning experience. Hang tight, young coders!"
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  This message will be displayed to users on the maintenance page.
                </p>
              </div>

              {/* Scheduled End Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Scheduled End Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={settings.maintenanceEndTime ? new Date(settings.maintenanceEndTime).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    maintenanceEndTime: e.target.value ? new Date(e.target.value).toISOString() : null
                  })}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  A countdown timer will be shown on the maintenance page if set.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const endTime = new Date();
                      endTime.setMinutes(endTime.getMinutes() + 30);
                      setSettings({
                        ...settings,
                        maintenanceEndTime: endTime.toISOString()
                      });
                    }}
                    className="px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                  >
                    Set 30 min
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const endTime = new Date();
                      endTime.setHours(endTime.getHours() + 1);
                      setSettings({
                        ...settings,
                        maintenanceEndTime: endTime.toISOString()
                      });
                    }}
                    className="px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                  >
                    Set 1 hour
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const endTime = new Date();
                      endTime.setHours(endTime.getHours() + 2);
                      setSettings({
                        ...settings,
                        maintenanceEndTime: endTime.toISOString()
                      });
                    }}
                    className="px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                  >
                    Set 2 hours
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, maintenanceEndTime: null })}
                    className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  >
                    Clear Time
                  </button>
                </div>
              </div>

              {/* Preview Link */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <a
                  href="/maintenance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                  <Eye className="w-4 h-4" />
                  Preview Maintenance Page
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Email Notifications Tab */}
        {activeTab === "email" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Notification Preferences
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Configure which email notifications are sent to administrators.
            </p>

            <div className="space-y-3">
              {[
                { key: "emailNewEnrollment", label: "New Enrollment", desc: "Notify when a student enrolls in a course" },
                { key: "emailPaymentReceived", label: "Payment Received", desc: "Notify when a payment is successfully processed" },
                { key: "emailCourseCompletion", label: "Course Completion", desc: "Notify when a student completes a course" },
                { key: "emailWeeklyDigest", label: "Weekly Digest", desc: "Send weekly summary of platform activity" },
                { key: "emailSystemAlerts", label: "System Alerts", desc: "Critical system alerts and errors" },
              ].map((setting) => {
                const isEnabled = settings[setting.key as keyof Settings] as boolean ?? false;
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
        )}

        {/* Sessions Tab */}
        {activeTab === "sessions" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Session Duration Settings
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Configure default durations and limits for class sessions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Default Session Duration (minutes)
                </label>
                <input
                  type="number"
                  value={settings.defaultSessionDuration ?? 60}
                  onChange={(e) => updateSetting("defaultSessionDuration", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Minimum Session Duration (minutes)
                </label>
                <input
                  type="number"
                  value={settings.minSessionDuration ?? 30}
                  onChange={(e) => updateSetting("minSessionDuration", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Maximum Session Duration (minutes)
                </label>
                <input
                  type="number"
                  value={settings.maxSessionDuration ?? 120}
                  onChange={(e) => updateSetting("maxSessionDuration", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Buffer Between Sessions (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionBufferMinutes ?? 15}
                  onChange={(e) => updateSetting("sessionBufferMinutes", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Time gap required between consecutive sessions
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Age Groups Tab */}
        {activeTab === "age" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Age Group Definitions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Define age ranges for different student categories.
            </p>

            <div className="space-y-6">
              {/* Young Coders */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Young Coders</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Min Age</label>
                    <input
                      type="number"
                      value={settings.ageGroupYoung?.min ?? 5}
                      onChange={(e) => setSettings({ ...settings, ageGroupYoung: { ...settings.ageGroupYoung, min: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Max Age</label>
                    <input
                      type="number"
                      value={settings.ageGroupYoung?.max ?? 8}
                      onChange={(e) => setSettings({ ...settings, ageGroupYoung: { ...settings.ageGroupYoung, max: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Middle School */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-3">Middle School</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-purple-700 dark:text-purple-300 mb-1">Min Age</label>
                    <input
                      type="number"
                      value={settings.ageGroupMiddle?.min ?? 9}
                      onChange={(e) => setSettings({ ...settings, ageGroupMiddle: { ...settings.ageGroupMiddle, min: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-700 dark:text-purple-300 mb-1">Max Age</label>
                    <input
                      type="number"
                      value={settings.ageGroupMiddle?.max ?? 12}
                      onChange={(e) => setSettings({ ...settings, ageGroupMiddle: { ...settings.ageGroupMiddle, max: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Teens */}
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <h3 className="font-medium text-pink-900 dark:text-pink-100 mb-3">Teens</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-pink-700 dark:text-pink-300 mb-1">Min Age</label>
                    <input
                      type="number"
                      value={settings.ageGroupTeen?.min ?? 13}
                      onChange={(e) => setSettings({ ...settings, ageGroupTeen: { ...settings.ageGroupTeen, min: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 border border-pink-200 dark:border-pink-700 rounded-lg bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-pink-700 dark:text-pink-300 mb-1">Max Age</label>
                    <input
                      type="number"
                      value={settings.ageGroupTeen?.max ?? 18}
                      onChange={(e) => setSettings({ ...settings, ageGroupTeen: { ...settings.ageGroupTeen, max: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 border border-pink-200 dark:border-pink-700 rounded-lg bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance Settings
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Customize the platform's visual appearance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor ?? "#8B5CF6"}
                    onChange={(e) => updateSetting("primaryColor", e.target.value)}
                    className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor ?? "#8B5CF6"}
                    onChange={(e) => updateSetting("primaryColor", e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.accentColor ?? "#EC4899"}
                    onChange={(e) => updateSetting("accentColor", e.target.value)}
                    className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.accentColor ?? "#EC4899"}
                    onChange={(e) => updateSetting("accentColor", e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Preview</h4>
              <div className="flex gap-4">
                <button
                  style={{ background: `linear-gradient(to right, ${settings.primaryColor ?? "#8B5CF6"}, ${settings.accentColor ?? "#EC4899"})` }}
                  className="px-4 py-2 text-white rounded-lg font-medium"
                >
                  Primary Button
                </button>
                <button
                  style={{ borderColor: settings.primaryColor ?? "#8B5CF6", color: settings.primaryColor ?? "#8B5CF6" }}
                  className="px-4 py-2 border-2 rounded-lg font-medium bg-transparent"
                >
                  Outline Button
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
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
