"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "../../../../components/ui/button";
import {
  User, Bell, Palette, Save, Check, Loader2,
  ArrowLeft, Sun, Moon, Monitor, Sparkles, Volume2, VolumeX
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function StudentSettingsPage() {
  const { data: session } = useSession();
  const [fullName, setFullName] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [prefStatus, setPrefStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name ?? "");
      loadPreferences();
    }
    const savedTheme = localStorage.getItem("ok-theme") as "light" | "dark" | "system";
    if (savedTheme) setTheme(savedTheme);

    const savedSound = localStorage.getItem("ok-sound-effects");
    if (savedSound !== null) setSoundEffects(savedSound === "true");
  }, [session]);

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/preferences");
      if (response.ok) {
        const data = await response.json();
        setEmailUpdates(data.emailUpdates ?? true);
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
        body: JSON.stringify({ emailUpdates }),
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

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEffects(enabled);
    localStorage.setItem("ok-sound-effects", String(enabled));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/student"
            className="p-2 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700 dark:text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              My Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Customize your learning space!</p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-white/10 rounded-3xl border border-slate-200 dark:border-white/20 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your awesome identity!</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Sparkles className="h-4 w-4 text-yellow-500" /> Your Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="What should we call you?"
              />
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={saveStatus === "saving"}
              variant={saveStatus === "success" ? "success" : "default"}
              className="w-full sm:w-auto"
            >
              {saveStatus === "saving" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : saveStatus === "success" ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Profile
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Theme Section */}
        <div className="bg-white dark:bg-white/10 rounded-3xl border border-slate-200 dark:border-white/20 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Theme</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pick your favorite look!</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`p-4 rounded-2xl border-2 transition ${
                theme === "light"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-500/20"
                  : "border-slate-200 dark:border-white/20 hover:border-purple-300"
              }`}
            >
              <Sun className={`h-6 w-6 mx-auto mb-2 ${theme === "light" ? "text-purple-600" : "text-slate-600 dark:text-slate-400"}`} />
              <span className={`text-sm font-medium ${theme === "light" ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300"}`}>
                Light
              </span>
            </button>

            <button
              onClick={() => handleThemeChange("dark")}
              className={`p-4 rounded-2xl border-2 transition ${
                theme === "dark"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-500/20"
                  : "border-slate-200 dark:border-white/20 hover:border-purple-300"
              }`}
            >
              <Moon className={`h-6 w-6 mx-auto mb-2 ${theme === "dark" ? "text-purple-600 dark:text-purple-400" : "text-slate-600 dark:text-slate-400"}`} />
              <span className={`text-sm font-medium ${theme === "dark" ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300"}`}>
                Dark
              </span>
            </button>

            <button
              onClick={() => handleThemeChange("system")}
              className={`p-4 rounded-2xl border-2 transition ${
                theme === "system"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-500/20"
                  : "border-slate-200 dark:border-white/20 hover:border-purple-300"
              }`}
            >
              <Monitor className={`h-6 w-6 mx-auto mb-2 ${theme === "system" ? "text-purple-600 dark:text-purple-400" : "text-slate-600 dark:text-slate-400"}`} />
              <span className={`text-sm font-medium ${theme === "system" ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300"}`}>
                Auto
              </span>
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-white/10 rounded-3xl border border-slate-200 dark:border-white/20 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Stay in the loop!</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">Email Updates</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Get cool updates about your progress</p>
              </div>
              <button
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`relative w-14 h-8 rounded-full transition ${
                  emailUpdates ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <div className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  emailUpdates ? "translate-x-6" : ""
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {soundEffects ? (
                    <Volume2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-slate-400" />
                  )}
                  <p className="font-semibold text-slate-900 dark:text-white">Sound Effects</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Hear fun sounds when learning</p>
              </div>
              <button
                onClick={() => handleSoundToggle(!soundEffects)}
                className={`relative w-14 h-8 rounded-full transition ${
                  soundEffects ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <div className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  soundEffects ? "translate-x-6" : ""
                }`} />
              </button>
            </div>

            <Button
              onClick={handleSavePreferences}
              disabled={prefStatus === "saving"}
              variant={prefStatus === "success" ? "success" : "default"}
              className="w-full sm:w-auto"
            >
              {prefStatus === "saving" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : prefStatus === "success" ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Preferences
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
