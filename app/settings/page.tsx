"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "../../components/ui/button";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [classReminders, setClassReminders] = useState(true);
  const [progressReports, setProgressReports] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
      const storedTheme = localStorage.getItem("ok-theme");
      if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }
  }, [session]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-slate-600">Loading...</div>;
  }

  if (!session?.user) {
    return <div className="min-h-screen flex items-center justify-center text-slate-600">Please log in to view settings.</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">Manage your account and preferences</p>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <span className="text-lg">👤</span>
            Profile Information
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <Button
              className="bg-slate-900 text-white w-fit px-4"
              onClick={async () => {
                await fetch("/api/profile", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: fullName, email }),
                });
              }}
            >
              Save Changes
            </Button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <span className="text-lg">🌓</span>
            Appearance
          </div>
          <p className="text-slate-600 text-sm">Switch between light and dark themes.</p>
          <div className="flex items-center gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => {
                setTheme("light");
                localStorage.setItem("ok-theme", "light");
                document.documentElement.classList.remove("dark");
              }}
            >
              Light Mode
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => {
                setTheme("dark");
                localStorage.setItem("ok-theme", "dark");
                document.documentElement.classList.add("dark");
              }}
            >
              Dark Mode
            </Button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <span className="text-lg">🔔</span>
            Notifications
          </div>
          <p className="text-slate-600 text-sm">Choose what updates you receive</p>

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

          <Button variant="outline" className="w-fit px-4">
            Save Preferences
          </Button>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <span className="text-lg">🛡️</span>
            Account
          </div>
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 w-fit"
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
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full border transition ${
          checked ? "bg-slate-900 border-slate-900" : "bg-slate-200 border-slate-300"
        }`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full shadow transform transition ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
