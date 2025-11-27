"use client";

import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, Filter, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/button";

const classTypes = ["All Types", "1:1 Sessions", "Group Classes", "Workshops", "Camps"];
const languages = ["All Languages", "HTML", "CSS", "JavaScript", "Python", "Roblox"];

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 10, 26)); // Matches screenshot example
  const [weekStart, setWeekStart] = useState(new Date(2025, 10, 23));
  const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 86400000);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const formatDay = (date: Date, opts: Intl.DateTimeFormatOptions) =>
    date.toLocaleDateString("en-US", opts);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Schedule</h1>
          <p className="text-slate-600">Book classes and manage your schedule</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                  <span>November 2025</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setWeekStart(addDays(weekStart, -7))}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setWeekStart(addDays(weekStart, 7))}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                    const date = new Date(2025, 10, day);
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium ${
                          isSelected ? "bg-purple-500 text-white" : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Filter className="w-4 h-4" />
                  Filters
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Class Type</p>
                  <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                    {classTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Language</p>
                  <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                    {languages.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-slate-800 mb-2">My Bookings</p>
                <p className="text-sm text-slate-500">No upcoming classes</p>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setWeekStart(addDays(weekStart, -7))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex gap-2">
                    {weekDays.map((day) => {
                      const active = isSameDay(day, selectedDate);
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={`flex flex-col items-center px-3 py-2 rounded-xl min-w-[60px] text-sm font-semibold ${
                            active ? "bg-purple-500 text-white" : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span className="opacity-70">{formatDay(day, { weekday: "short" })}</span>
                          <span className="text-lg">{formatDay(day, { day: "numeric" })}</span>
                        </button>
                      );
                    })}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setWeekStart(addDays(weekStart, 7))}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                {formatDay(selectedDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </h2>
              <Card className="border-2 border-dashed border-slate-200">
                <CardContent className="p-12 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="font-semibold text-slate-800">No classes on this day</p>
                  <p className="text-sm text-slate-500">Try selecting a different date or adjusting your filters</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
