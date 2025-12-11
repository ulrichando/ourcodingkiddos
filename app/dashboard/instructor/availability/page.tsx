"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Clock, Calendar, Loader2, ToggleLeft, ToggleRight, Repeat, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import InstructorLayout from "../../../../components/instructor/InstructorLayout";

type AvailabilitySlot = {
  id: string;
  dayOfWeek: number | null;
  specificDate: string | null;
  isRecurring: boolean;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TIME_OPTIONS = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"recurring" | "specific">("recurring");

  // Calendar state for viewing specific dates
  const [viewMonth, setViewMonth] = useState(new Date());

  // New slot form state
  const [isRecurring, setIsRecurring] = useState(true);
  const [newDay, setNewDay] = useState(1); // Monday
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("17:00");

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const res = await fetch("/api/instructor/availability");
      const data = await res.json();
      if (data.availability) {
        setAvailability(data.availability);
      }
    } catch (err) {
      console.error("Failed to load availability:", err);
      setError("Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  const addSlot = async () => {
    if (newStartTime >= newEndTime) {
      setError("End time must be after start time");
      return;
    }

    if (!isRecurring && !newDate) {
      setError("Please select a date");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/instructor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isRecurring,
          dayOfWeek: isRecurring ? newDay : undefined,
          specificDate: !isRecurring ? newDate : undefined,
          startTime: newStartTime,
          endTime: newEndTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add availability");
        return;
      }

      setAvailability([...availability, data.availability]);
      setShowAddForm(false);
      resetForm();
    } catch (err) {
      setError("Failed to add availability");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setIsRecurring(true);
    setNewDay(1);
    setNewDate("");
    setNewStartTime("09:00");
    setNewEndTime("17:00");
    setError(null);
  };

  const toggleSlot = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/instructor/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });

      if (res.ok) {
        setAvailability(
          availability.map((slot) =>
            slot.id === id ? { ...slot, isActive: !currentActive } : slot
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle availability:", err);
    }
  };

  const deleteSlot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this availability slot?")) return;

    try {
      const res = await fetch(`/api/instructor/availability?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAvailability(availability.filter((slot) => slot.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete availability:", err);
    }
  };

  // Split availability into recurring and specific
  const recurringSlots = availability.filter((s) => s.isRecurring);
  const specificSlots = availability.filter((s) => !s.isRecurring);

  // Group recurring by day
  const groupedRecurring = DAYS_OF_WEEK.map((day, index) => ({
    day,
    dayIndex: index,
    slots: recurringSlots.filter((slot) => slot.dayOfWeek === index),
  }));

  // Group specific by month
  const getMonthKey = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const currentMonthKey = `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthSlots = specificSlots.filter(
    (s) => s.specificDate && getMonthKey(s.specificDate) === currentMonthKey
  );

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];
    // Add padding for days before the first of the month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Check if a date has availability
  const getDateSlots = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return specificSlots.filter((s) => s.specificDate?.startsWith(dateStr));
  };

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Home / Availability</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Set Your Availability
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Define when you&apos;re available for 1-on-1 classes
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white self-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Time Slot
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Add New Slot Form */}
        {showAddForm && (
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                Add New Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecurring(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                    isRecurring
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                  Weekly Recurring
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecurring(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                    !isRecurring
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Specific Date
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {isRecurring ? (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Day of Week
                    </label>
                    <select
                      value={newDay}
                      onChange={(e) => setNewDay(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {DAYS_OF_WEEK.map((day, index) => (
                        <option key={day} value={index}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Start Time
                  </label>
                  <select
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    End Time
                  </label>
                  <select
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRecurring
                  ? "This slot will repeat every week on the selected day."
                  : "This slot is for a single specific date only."}
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={addSlot}
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("recurring")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
              activeTab === "recurring"
                ? "border-purple-600 text-purple-600 dark:text-purple-400"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Repeat className="w-4 h-4 inline mr-2" />
            Weekly Schedule ({recurringSlots.length})
          </button>
          <button
            onClick={() => setActiveTab("specific")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
              activeTab === "specific"
                ? "border-purple-600 text-purple-600 dark:text-purple-400"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <CalendarDays className="w-4 h-4 inline mr-2" />
            Specific Dates ({specificSlots.length})
          </button>
        </div>

        {/* Recurring Weekly Schedule */}
        {activeTab === "recurring" && (
          <div className="grid gap-4">
            {groupedRecurring.map(({ day, dayIndex, slots }) => (
              <Card key={day} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-28 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {day}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      {slots.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                          No availability set
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {slots.map((slot) => (
                            <div
                              key={slot.id}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                                slot.isActive
                                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60"
                              }`}
                            >
                              <Clock className={`w-4 h-4 ${slot.isActive ? "text-green-600 dark:text-green-400" : "text-slate-400"}`} />
                              <span className={`text-sm font-medium ${slot.isActive ? "text-green-800 dark:text-green-300" : "text-slate-500 dark:text-slate-400"}`}>
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </span>
                              <button
                                onClick={() => toggleSlot(slot.id, slot.isActive)}
                                className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition"
                                title={slot.isActive ? "Disable" : "Enable"}
                              >
                                {slot.isActive ? (
                                  <ToggleRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-slate-400" />
                                )}
                              </button>
                              <button
                                onClick={() => deleteSlot(slot.id)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500 dark:text-red-400 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Specific Dates Calendar View */}
        {activeTab === "specific" && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1))}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </h2>
                <button
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1))}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-2">
                    {d}
                  </div>
                ))}
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="h-20" />;
                  }
                  const slots = getDateSlots(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <div
                      key={date.toISOString()}
                      className={`h-20 p-1 border rounded-lg ${
                        isToday
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : isPast
                          ? "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 opacity-50"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {date.getDate()}
                      </div>
                      {slots.length > 0 && (
                        <div className="space-y-0.5">
                          {slots.slice(0, 2).map((slot) => (
                            <div
                              key={slot.id}
                              className={`text-[10px] px-1 py-0.5 rounded truncate ${
                                slot.isActive
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                              }`}
                            >
                              {formatTime(slot.startTime)}
                            </div>
                          ))}
                          {slots.length > 2 && (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              +{slots.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* List of slots for current month */}
              {currentMonthSlots.length > 0 ? (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Slots in {MONTHS[viewMonth.getMonth()]}
                  </h3>
                  <div className="space-y-2">
                    {currentMonthSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          slot.isActive
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CalendarDays className={`w-4 h-4 ${slot.isActive ? "text-green-600 dark:text-green-400" : "text-slate-400"}`} />
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {slot.specificDate && formatDate(slot.specificDate)}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleSlot(slot.id, slot.isActive)}
                            className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition"
                          >
                            {slot.isActive ? (
                              <ToggleRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteSlot(slot.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500 dark:text-red-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No specific date availability set for {MONTHS[viewMonth.getMonth()]}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Help Text */}
        <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  How Availability Works
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• <strong>Weekly Recurring:</strong> Set regular weekly availability (e.g., every Monday 9AM-5PM)</li>
                  <li>• <strong>Specific Dates:</strong> Add one-time availability for specific dates (e.g., Dec 25th 2PM-4PM)</li>
                  <li>• Parents will see your availability when requesting 1-on-1 classes</li>
                  <li>• You can toggle slots on/off without deleting them</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </InstructorLayout>
  );
}
