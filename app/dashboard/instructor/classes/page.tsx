"use client";

import { useState, useEffect, useMemo } from "react";
import InstructorLayout from "../../../../components/instructor/InstructorLayout";
import Link from "next/link";
import {  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  BookOpen,
  UserCheck,
  AlertTriangle,
  Bell,
  List,
  Grid,
  Search,
  X,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type ClassSession = {
  id: string;
  title: string;
  description?: string;
  language: string;
  ageGroup: string;
  sessionType: string;
  startTime: string;
  durationMinutes: number;
  maxStudents: number | null;
  enrolledCount: number;
  meetingUrl?: string;
  instructorEmail: string;
  programId?: string | null;
  programSlug?: string | null;
  thumbnailUrl?: string | null;
};

type Program = {
  id: string;
  title: string;
  slug: string;
  language: string;
  ageGroup: string;
  thumbnailUrl?: string;
};

export default function InstructorClassesPage() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"programs" | "calendar">("programs");
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [checkingAttendance, setCheckingAttendance] = useState<string | null>(null);
  const [attendanceResult, setAttendanceResult] = useState<{
    classId: string;
    online: number;
    offline: number;
    offlineStudents: string[];
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [classesRes, programsRes] = await Promise.all([
        fetch("/api/instructor/classes"),
        fetch("/api/programs")
      ]);

      if (classesRes.ok) {
        const data = await classesRes.json();
        setClasses(data.sessions || []);
      }

      if (programsRes.ok) {
        const data = await programsRes.json();
        setPrograms(data.programs || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Check attendance for a class
  const checkAttendance = async (classId: string, notifyParents = false) => {
    setCheckingAttendance(classId);
    setAttendanceResult(null);
    try {
      const res = await fetch(`/api/instructor/attendance?classId=${classId}`);
      if (!res.ok) throw new Error("Failed to check attendance");
      const data = await res.json();

      setAttendanceResult({
        classId,
        online: data.summary.online,
        offline: data.summary.offline,
        offlineStudents: data.attendance.filter((a: any) => !a.online).map((a: any) => a.studentName),
      });

      if (data.summary.offline > 0) {
        await fetch("/api/instructor/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId, notifyParents }),
        });
      }
    } catch (error) {
      console.error("Error checking attendance:", error);
    } finally {
      setCheckingAttendance(null);
    }
  };

  // Filter classes based on time range and search query
  const filteredClasses = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const query = searchQuery.toLowerCase().trim();

    return classes.filter((cls) => {
      const classDate = new Date(cls.startTime);

      // Time filter
      let passesTimeFilter = false;
      if (timeFilter === "all") {
        passesTimeFilter = classDate >= startOfToday;
      } else if (timeFilter === "week") {
        const weekFromNow = new Date(currentDate);
        weekFromNow.setDate(currentDate.getDate() + 7);
        passesTimeFilter = classDate >= currentDate && classDate < weekFromNow;
      } else if (timeFilter === "month") {
        const monthFromNow = new Date(currentDate);
        monthFromNow.setMonth(currentDate.getMonth() + 1);
        passesTimeFilter = classDate >= currentDate && classDate < monthFromNow;
      }

      if (!passesTimeFilter) return false;

      // Search filter
      if (query) {
        const program = programs.find(p => p.id === cls.programId);
        return (
          cls.title.toLowerCase().includes(query) ||
          cls.description?.toLowerCase().includes(query) ||
          cls.language.toLowerCase().includes(query) ||
          cls.sessionType.toLowerCase().includes(query) ||
          program?.title.toLowerCase().includes(query)
        );
      }

      return true;
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [classes, timeFilter, currentDate, searchQuery, programs]);

  // Group classes by program
  const classesByProgram = useMemo(() => {
    const grouped: Record<string, { program: Program | null; classes: ClassSession[] }> = {};

    filteredClasses.forEach((cls) => {
      const programId = cls.programId || "standalone";
      if (!grouped[programId]) {
        const program = programs.find(p => p.id === cls.programId);
        grouped[programId] = {
          program: program || null,
          classes: []
        };
      }
      grouped[programId].classes.push(cls);
    });

    return grouped;
  }, [filteredClasses, programs]);

  // Group classes by date (for calendar view)
  const classesByDate = useMemo(() => {
    const groups: Record<string, ClassSession[]> = {};
    filteredClasses.forEach((cls) => {
      const date = new Date(cls.startTime).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(cls);
    });
    return groups;
  }, [filteredClasses]);

  // Navigate time periods
  const navigateTime = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (timeFilter === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (timeFilter === "month") {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  const getDateRangeText = () => {
    if (timeFilter === "all") return "All Upcoming";

    const end = new Date(currentDate);
    if (timeFilter === "week") {
      end.setDate(currentDate.getDate() + 6);
    } else if (timeFilter === "month") {
      end.setMonth(currentDate.getMonth() + 1);
      end.setDate(end.getDate() - 1);
    }

    return `${currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const renderClassCard = (classSession: ClassSession, showDate = true) => {
    const isToday = new Date(classSession.startTime).toDateString() === new Date().toDateString();
    const startTime = new Date(classSession.startTime);

    return (
      <div key={classSession.id} className="space-y-2">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 hover:shadow-lg transition">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Time Badge */}
            <div className="w-20 flex-shrink-0">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-3 text-center text-white">
                {showDate && (
                  <div className="text-xs font-medium">
                    {startTime.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </div>
                )}
                <div className={`${showDate ? "text-xs mt-1" : "text-xs font-medium"}`}>
                  {startTime.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                </div>
                <div className="text-xs opacity-90 mt-1">
                  {classSession.durationMinutes}min
                </div>
              </div>
            </div>

            {/* Class Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                  {classSession.title}
                </h3>
                {isToday && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                    Today
                  </span>
                )}
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 capitalize">
                  {classSession.sessionType.toLowerCase().replace("_", " ")}
                </span>
              </div>
              {classSession.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">
                  {classSession.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {classSession.language}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {classSession.enrolledCount}/{classSession.maxStudents ?? "∞"} students
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => checkAttendance(classSession.id, true)}
                disabled={checkingAttendance === classSession.id}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:hover:bg-amber-300 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                title="Check attendance"
              >
                {checkingAttendance === classSession.id ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Attendance</span>
                  </>
                )}
              </button>
              {classSession.meetingUrl && (
                <Link
                  href={classSession.meetingUrl}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">Join</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Result */}
        {attendanceResult && attendanceResult.classId === classSession.id && (
          <div className={`p-3 rounded-lg text-sm ${
            attendanceResult.offline > 0
              ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
              : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          }`}>
            <div className="flex items-center gap-2">
              {attendanceResult.offline > 0 ? (
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
              <span className={attendanceResult.offline > 0 ? "text-amber-800 dark:text-amber-300" : "text-green-800 dark:text-green-300"}>
                {attendanceResult.online} online, {attendanceResult.offline} offline
              </span>
            </div>
            {attendanceResult.offline > 0 && (
              <div className="mt-2 text-amber-700 dark:text-amber-400">
                <div className="flex items-center gap-1 mb-1">
                  <Bell className="h-3 w-3" />
                  <span className="text-xs">Parents notified about:</span>
                </div>
                <span className="text-xs">{attendanceResult.offlineStudents.join(", ")}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <InstructorLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Home / Classes</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">My Classes</h1>
            <p className="text-slate-600 dark:text-slate-400">View and manage your classes by program or schedule</p>
          </div>
          <Link
            href="/dashboard/instructor/create-class"
            className="inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
          >
            <Plus className="h-4 w-4" /> Create Class
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {filteredClasses.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {timeFilter === "all" ? "Total Classes" : timeFilter === "week" ? "This Week" : "This Month"}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {Object.keys(classesByProgram).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Programs</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {filteredClasses.filter(cls => {
                  const classDate = new Date(cls.startTime);
                  return classDate.toDateString() === new Date().toDateString();
                }).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Today</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search classes by name, program, language, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                title="Clear search"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Found {filteredClasses.length} {filteredClasses.length === 1 ? "class" : "classes"} matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Filters & View Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Left: View Mode & Time Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("programs")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    viewMode === "programs"
                      ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                  By Program
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    viewMode === "calendar"
                      ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <List className="h-4 w-4" />
                  By Date
                </button>
              </div>

              {/* Time Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Time:</span>
                <div className="flex gap-2">
                  {["all", "week", "month"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setTimeFilter(filter as any);
                        if (filter !== "all") resetToToday();
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        timeFilter === filter
                          ? "bg-purple-500 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {filter === "all" ? "All" : filter === "week" ? "Week" : "Month"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Date Navigation */}
            {timeFilter !== "all" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateTime("prev")}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  title="Previous"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  onClick={resetToToday}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                  Today
                </button>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[180px] text-center">
                  {getDateRangeText()}
                </span>
                <button
                  onClick={() => navigateTime("next")}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  title="Next"
                >
                  <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Classes Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Loading classes...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-12 text-center">
            <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No classes scheduled
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {timeFilter === "all"
                ? "You don't have any upcoming classes yet."
                : `No classes scheduled for this ${timeFilter}.`}
            </p>
            <Link
              href="/dashboard/instructor/create-class"
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <Plus className="h-4 w-4" /> Create Your First Class
            </Link>
          </div>
        ) : viewMode === "programs" ? (
          /* Program View */
          <div className="space-y-6">
            {Object.entries(classesByProgram).map(([programId, { program, classes: programClasses }]) => (
              <div key={programId} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                {/* Program Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                  <div className="flex items-center gap-4">
                    {program?.thumbnailUrl && (
                      <img
                        src={program.thumbnailUrl}
                        alt={program.title}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-white/20"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white">
                        {program?.title || "Standalone Classes"}
                      </h2>
                      {program && (
                        <p className="text-white/90 text-sm mt-1">
                          {program.language} • {program.ageGroup?.replace("AGES_", "Ages ").replace("_", "-")}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{programClasses.length}</div>
                      <div className="text-white/90 text-sm">Classes</div>
                    </div>
                  </div>
                </div>

                {/* Classes List */}
                <div className="p-6 space-y-3">
                  {programClasses.map((cls) => renderClassCard(cls, true))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Calendar View */
          <div className="space-y-8">
            {Object.entries(classesByDate).map(([date, dayClasses]) => (
              <div key={date} className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  {date}
                </h2>
                <div className="space-y-3">
                  {dayClasses.map((cls) => renderClassCard(cls, false))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
