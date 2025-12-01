"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Video, Users, CalendarDays } from "lucide-react";
import Button from "../../../../components/ui/button";

export default function CreateClassPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sessionType, setSessionType] = useState("GROUP");
  const [language, setLanguage] = useState("HTML");
  const [ageGroup, setAgeGroup] = useState("AGES_11_14");
  const [startTime, setStartTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [maxStudents, setMaxStudents] = useState(10);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      description,
      sessionType,
      language,
      ageGroup,
      startTime: new Date(startTime).toISOString(),
      durationMinutes,
      maxStudents,
      meetingUrl,
    };

    const res = await fetch("/api/instructor/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || res.statusText || "Failed to create class");
      setLoading(false);
      return;
    }

    router.push("/dashboard/instructor");
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create a New Class</h1>
          <p className="text-slate-600 dark:text-slate-400">Set up the session details and meeting link.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 dark:placeholder:text-slate-400"
              placeholder="e.g., JavaScript Quests"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 dark:placeholder:text-slate-400"
              placeholder="What will students learn in this class?"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Session Type</label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="GROUP">Group</option>
                <option value="ONE_ON_ONE">1:1</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="CAMP">Camp</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
                <option value="JAVASCRIPT">JavaScript</option>
                <option value="PYTHON">Python</option>
                <option value="ROBLOX">Roblox</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="AGES_7_10">Ages 7-10</option>
                <option value="AGES_11_14">Ages 11-14</option>
                <option value="AGES_15_18">Ages 15-18</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                Start Time <CalendarDays className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                Duration (minutes) <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </label>
              <input
                type="number"
                min={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                Max Students <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </label>
              <input
                type="number"
                min={1}
                value={maxStudents}
                onChange={(e) => setMaxStudents(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                Meeting Link <Video className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </label>
              <input
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Leave blank to auto-generate a Google Meet link.</p>
            </div>
          </div>

          {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
              {loading ? "Creating..." : "Create Class"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/instructor")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
