"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Clock, Video, Users, CalendarDays, Link2, Loader2, CheckCircle2, Repeat, UserCircle } from "lucide-react";
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

  // Recurring class state
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState("WEEKLY");
  const [numberOfWeeks, setNumberOfWeeks] = useState(4);

  // Google Meet state
  const [hasGoogleAccount, setHasGoogleAccount] = useState(false);
  const [checkingGoogle, setCheckingGoogle] = useState(true);
  const [generatingMeet, setGeneratingMeet] = useState(false);
  const [meetGenerated, setMeetGenerated] = useState(false);

  // Auto-set maxStudents to 1 for 1:1 sessions
  useEffect(() => {
    if (sessionType === "ONE_ON_ONE") {
      setMaxStudents(1);
    }
  }, [sessionType]);

  // Calculate preview dates for recurring classes
  const previewDates = useMemo(() => {
    if (!startTime || !isRecurring) return [];

    const dates: Date[] = [];
    const baseDate = new Date(startTime);

    for (let i = 0; i < numberOfWeeks; i++) {
      const newDate = new Date(baseDate);
      if (recurrencePattern === "WEEKLY") {
        newDate.setDate(baseDate.getDate() + (i * 7));
      } else if (recurrencePattern === "BIWEEKLY") {
        newDate.setDate(baseDate.getDate() + (i * 14));
      } else if (recurrencePattern === "MONTHLY") {
        newDate.setMonth(baseDate.getMonth() + i);
      }
      dates.push(newDate);
    }

    return dates;
  }, [startTime, isRecurring, recurrencePattern, numberOfWeeks]);

  // Check if Google account is connected on mount
  useEffect(() => {
    async function checkGoogleAccount() {
      try {
        const res = await fetch("/api/instructor/google-meet");
        if (res.ok) {
          const data = await res.json();
          setHasGoogleAccount(data.hasGoogleAccount);
        }
      } catch (e) {
        console.error("Failed to check Google account:", e);
      } finally {
        setCheckingGoogle(false);
      }
    }
    checkGoogleAccount();
  }, []);

  // Generate Google Meet link
  async function handleGenerateMeet() {
    if (!title || !startTime || !durationMinutes) {
      setError("Please fill in title, start time, and duration first");
      return;
    }

    setGeneratingMeet(true);
    setError(null);

    try {
      const res = await fetch("/api/instructor/google-meet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          startTime: new Date(startTime).toISOString(),
          durationMinutes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsGoogleAuth) {
          setHasGoogleAccount(false);
          setError(data.message || "Please connect your Google account");
        } else {
          setError(data.error || "Failed to generate Meet link");
        }
        return;
      }

      setMeetingUrl(data.meetLink);
      setMeetGenerated(true);
    } catch (e: any) {
      setError(e.message || "Failed to generate Meet link");
    } finally {
      setGeneratingMeet(false);
    }
  }

  // Connect Google Account
  function handleConnectGoogle() {
    // Trigger Google OAuth sign-in
    signIn("google", { callbackUrl: window.location.href });
  }

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
      isRecurring,
      recurrencePattern: isRecurring ? recurrencePattern : null,
      numberOfWeeks: isRecurring ? numberOfWeeks : 1,
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
                <option value="ONE_ON_ONE">1:1 Private</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="CAMP">Camp</option>
              </select>
              {sessionType === "ONE_ON_ONE" && (
                <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
                  <UserCircle className="h-3 w-3" /> Private 1-on-1 session (max 1 student)
                </p>
              )}
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

          <div className="grid md:grid-cols-2 gap-4">
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
                disabled={sessionType === "ONE_ON_ONE"}
              />
            </div>
          </div>

          {/* Recurring Schedule Section */}
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Repeat className="h-4 w-4 text-blue-500" />
                Schedule for Multiple Weeks
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {isRecurring && (
              <div className="space-y-4 pt-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Repeat</label>
                    <select
                      value={recurrencePattern}
                      onChange={(e) => setRecurrencePattern(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="WEEKLY">Weekly</option>
                      <option value="BIWEEKLY">Every 2 Weeks</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Number of Sessions</label>
                    <select
                      value={numberOfWeeks}
                      onChange={(e) => setNumberOfWeeks(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                        <option key={n} value={n}>{n} sessions</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preview of scheduled dates */}
                {previewDates.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Scheduled Dates Preview:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {previewDates.map((date, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 text-sm border border-slate-200 dark:border-slate-600"
                        >
                          <CalendarDays className="h-4 w-4 text-blue-500" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {previewDates.length} classes will be created at {startTime ? new Date(startTime).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "the selected time"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isRecurring && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enable this to schedule the same class for multiple weeks in advance.
              </p>
            )}
          </div>

          {/* Google Meet Section */}
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Video className="h-4 w-4 text-red-500" />
              Google Meet Link
            </label>

            {checkingGoogle ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking Google account...
              </div>
            ) : !hasGoogleAccount ? (
              <div className="space-y-3">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Connect your Google account to automatically generate Meet links, or paste your own meeting link below.
                </p>
                <Button
                  type="button"
                  onClick={handleConnectGoogle}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Connect Google Account
                </Button>
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
                  <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">or paste link manually</span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
                </div>
                <input
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://meet.google.com/... or https://zoom.us/..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You can paste any meeting link (Google Meet, Zoom, etc.) to use for this class.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    value={meetingUrl}
                    onChange={(e) => {
                      setMeetingUrl(e.target.value);
                      setMeetGenerated(false);
                    }}
                    placeholder="https://meet.google.com/..."
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateMeet}
                    disabled={generatingMeet || !title || !startTime}
                    className="bg-red-500 hover:bg-red-600 text-white whitespace-nowrap"
                  >
                    {generatingMeet ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : meetGenerated ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Generated!
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4 mr-2" />
                        Generate Meet Link
                      </>
                    )}
                  </Button>
                </div>
                {meetGenerated && meetingUrl && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Meet link created! Calendar event added to your Google Calendar.
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click &quot;Generate Meet Link&quot; to create a Google Meet and add it to your calendar, or enter a custom link.
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
              {loading ? "Creating..." : isRecurring ? `Create ${numberOfWeeks} Classes` : "Create Class"}
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
