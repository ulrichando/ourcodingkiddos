"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import ParentLayout from "../../../../components/parent/ParentLayout";
import { User, Bell, Shield, Palette, Save, Check, Loader2 } from "lucide-react";
import { logout } from "../../../../lib/logout";

export default function ParentSettingsPage() {
  const { data: session, status } = useSession();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [classReminders, setClassReminders] = useState(true);
  const [progressReports, setProgressReports] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [prefStatus, setPrefStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "deleting" | "error">("idle");

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
      loadPreferences();
    }
    const savedTheme = localStorage.getItem("ok-theme") as "light" | "dark" | "system";
    if (savedTheme) setTheme(savedTheme);
  }, [session]);

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/preferences");
      if (response.ok) {
        const data = await response.json();
        setEmailUpdates(data.emailUpdates ?? false);
        setClassReminders(data.classReminders ?? true);
        setProgressReports(data.progressReports ?? true);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  };

  const handleSaveProfile = async () => {
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName }),
      });
      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  };

  const handleSavePreferences = async () => {
    setPrefStatus("saving");
    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailUpdates, classReminders, progressReports }),
      });
      if (response.ok) {
        setPrefStatus("success");
        setTimeout(() => setPrefStatus("idle"), 2000);
      } else {
        setPrefStatus("error");
      }
    } catch {
      setPrefStatus("error");
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("ok-theme", newTheme);
    if (newTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleteStatus("deleting");
    try {
      const response = await fetch("/api/user/delete", { method: "DELETE" });
      if (response.ok) {
        logout();
      } else {
        setDeleteStatus("error");
      }
    } catch {
      setDeleteStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <ParentLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-violet-500" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>
            <Button onClick={handleSaveProfile} disabled={saveStatus === "saving"}>
              {saveStatus === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : saveStatus === "success" ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saveStatus === "success" ? "Saved!" : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-violet-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "emailUpdates", label: "Email Updates", desc: "Receive news and announcements", value: emailUpdates, setter: setEmailUpdates },
              { id: "classReminders", label: "Class Reminders", desc: "Get notified before scheduled classes", value: classReminders, setter: setClassReminders },
              { id: "progressReports", label: "Progress Reports", desc: "Weekly updates on your child's progress", value: progressReports, setter: setProgressReports },
            ].map((pref) => (
              <div key={pref.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{pref.label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{pref.desc}</p>
                </div>
                <button
                  onClick={() => pref.setter(!pref.value)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${pref.value ? "bg-violet-500" : "bg-slate-300 dark:bg-slate-600"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${pref.value ? "translate-x-5" : ""}`} />
                </button>
              </div>
            ))}
            <Button onClick={handleSavePreferences} disabled={prefStatus === "saving"}>
              {prefStatus === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : prefStatus === "success" ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {prefStatus === "success" ? "Saved!" : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="w-5 h-5 text-violet-500" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                    theme === t
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-0 shadow-sm border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-red-600 dark:text-red-400">
              <Shield className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Deleting your account will permanently remove all your data, including student profiles and progress.
            </p>
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-red-600">Delete Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  This action cannot be undone. Type <strong>DELETE</strong> to confirm.
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== "DELETE" || deleteStatus === "deleting"}
                    className="flex-1"
                  >
                    {deleteStatus === "deleting" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
