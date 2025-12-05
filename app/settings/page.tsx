"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "../../components/ui/button";
import { logout } from "../../lib/logout";

const AVATARS = ["🦊", "🐼", "🦁", "🐯", "🦄", "🐲", "🦖", "🐸", "🦋", "🐝", "🚀", "🤖"];

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "deleting" | "error">("idle");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Student-specific settings
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [avatarStatus, setAvatarStatus] = useState<"idle" | "saved">("idle");

  const userRole = (session?.user as any)?.role?.toUpperCase() ?? "PARENT";
  const isStudent = userRole === "STUDENT";

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
      loadPreferences();
    }

    // Load student-specific settings from localStorage
    const savedAvatar = localStorage.getItem("studentAvatar");
    if (savedAvatar) setSelectedAvatar(savedAvatar);

    const savedTheme = localStorage.getItem("ok-theme") as "light" | "dark" | "system";
    if (savedTheme) setTheme(savedTheme);
  }, [session]);

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/preferences");
      if (response.ok) {
        const data = await response.json();
        setEmailUpdates(data.preferences?.emailUpdates ?? false);
        setClassReminders(data.preferences?.classReminders ?? true);
        setProgressReports(data.preferences?.progressReports ?? true);
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
        body: JSON.stringify({ name: fullName, email: isStudent ? undefined : email }),
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
        await logout();
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

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    localStorage.setItem("studentAvatar", avatar);
    setAvatarStatus("saved");
    setTimeout(() => setAvatarStatus("idle"), 2000);
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("ok-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
        </div>

        {/* Avatar Selection - For Students */}
        {isStudent && (
          <section className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
                <span className="text-lg">🎭</span>
                Choose Your Avatar
              </div>
              {avatarStatus === "saved" && (
                <span className="text-sm text-green-600 dark:text-green-400">Saved!</span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Pick a fun character to represent you!</p>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`text-2xl sm:text-3xl p-2 sm:p-3 rounded-xl transition-all hover:scale-110 ${
                    selectedAvatar === avatar
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg ring-2 ring-purple-300 dark:ring-purple-600"
                      : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Theme Selection - For Students */}
        {isStudent && (
          <section className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
              <span className="text-lg">🎨</span>
              Theme
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Choose your favorite look!</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                  theme === "light"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                }`}
              >
                <span className="text-2xl">☀️</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Light</span>
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                  theme === "dark"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                }`}
              >
                <span className="text-2xl">🌙</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark</span>
              </button>
              <button
                onClick={() => handleThemeChange("system")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                  theme === "system"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                }`}
              >
                <span className="text-2xl">🔄</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto</span>
              </button>
            </div>
          </section>
        )}

        {/* Profile Information */}
        <section className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
            <span className="text-lg">👤</span>
            Profile Information
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {isStudent ? "Your Name" : "Full Name"}
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
              />
            </div>
            {!isStudent && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                />
              </div>
            )}
            {isStudent && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ask your parent if you need to change your email address.
              </p>
            )}
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

        {/* Notifications */}
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
              description={isStudent ? "Weekly updates on your learning progress" : "Weekly summaries of student progress"}
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

        {/* Account Section */}
        <section className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
            <span className="text-lg">🛡️</span>
            Account
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 w-fit"
              onClick={() => logout()}
            >
              Log Out
            </Button>
            {/* Hide delete account for students - only parents can manage accounts */}
            {!isStudent && (
              <Button
                variant="outline"
                className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 w-fit"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            )}
          </div>
          {isStudent ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need to make changes to your account? Ask your parent for help!
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deleting your account will permanently remove all your data and cannot be undone.
            </p>
          )}
        </section>
      </div>

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
