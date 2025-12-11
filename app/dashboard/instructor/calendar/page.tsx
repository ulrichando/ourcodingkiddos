"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Calendar,
  BookOpen,
  Clock,
  Users,
  FileText,
  ChevronRight,
  Loader2,
  CalendarDays,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import InstructorLayout from "../../../../components/instructor/InstructorLayout";
import ModernInstructorCalendar from "../../../../components/instructor/ModernInstructorCalendar";

type Program = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  language: string;
  ageGroup: string;
  sessionCount: number;
  startDate: string | null;
  endDate: string | null;
  isPublished: boolean;
};

type ClassSession = {
  id: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  enrolledCount: number;
  maxStudents: number | null;
  meetingUrl: string | null;
  programId: string | null;
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  type: string;
  maxPoints: number;
  programId: string | null;
  submissionCount: number;
  totalStudents: number;
};

type ScheduleData = {
  programs: Program[];
  classes: ClassSession[];
  assignments: Assignment[];
};

export default function InstructorSchedulePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    programs: [],
    classes: [],
    assignments: [],
  });
  const [viewMode, setViewMode] = useState<"programs" | "timeline">("programs");

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const res = await fetch("/api/instructor/schedule");
        if (!res.ok) throw new Error("Failed to fetch schedule");
        const data = await res.json();
        setScheduleData(data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, []);

  // Group classes and assignments by program
  const programSchedules = useMemo(() => {
    return scheduleData.programs.map((program) => {
      const programClasses = scheduleData.classes.filter(
        (c) => c.programId === program.id
      );
      const programAssignments = scheduleData.assignments.filter(
        (a) => a.programId === program.id
      );

      return {
        program,
        classes: programClasses,
        assignments: programAssignments,
        totalClasses: programClasses.length,
        totalAssignments: programAssignments.length,
        totalStudents: programClasses.reduce(
          (sum, c) => sum + c.enrolledCount,
          0
        ),
      };
    });
  }, [scheduleData]);

  // Standalone classes and assignments (not linked to programs)
  const standaloneClasses = useMemo(
    () => scheduleData.classes.filter((c) => !c.programId),
    [scheduleData.classes]
  );
  const standaloneAssignments = useMemo(
    () => scheduleData.assignments.filter((a) => !a.programId),
    [scheduleData.assignments]
  );

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Home / Calendar</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              My Teaching Schedule
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View your assigned programs, classes, and assignments
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("programs")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === "programs"
                  ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-4 h-4 inline-block mr-2" />
              By Program
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === "timeline"
                  ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <CalendarDays className="w-4 h-4 inline-block mr-2" />
              Timeline
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {scheduleData.programs.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Programs
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {scheduleData.classes.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Classes
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {scheduleData.assignments.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Assignments
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {programSchedules.reduce((sum, p) => sum + p.totalStudents, 0)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Total Students
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Programs View */}
        {viewMode === "programs" && (
          <div className="space-y-6">
            {programSchedules.length === 0 && standaloneClasses.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No Assignments Yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  You haven't been assigned to any programs yet. Contact your
                  administrator for assignment details.
                </p>
              </div>
            ) : (
              <>
                {/* Program-based assignments */}
                {programSchedules.map((schedule) => (
                  <div
                    key={schedule.program.id}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    {/* Program Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                      <div className="flex items-start gap-4">
                        {schedule.program.thumbnailUrl && (
                          <img
                            src={schedule.program.thumbnailUrl}
                            alt={schedule.program.title}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h2 className="text-xl font-bold mb-2">
                            {schedule.program.title}
                          </h2>
                          <p className="text-purple-100 text-sm mb-3">
                            {schedule.program.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {schedule.program.sessionCount} Sessions
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {schedule.totalStudents} Students
                            </span>
                            {schedule.program.startDate && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(
                                  schedule.program.startDate
                                ).toLocaleDateString()}
                                {schedule.program.endDate &&
                                  ` - ${new Date(
                                    schedule.program.endDate
                                  ).toLocaleDateString()}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Classes Section */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Classes ({schedule.classes.length})
                      </h3>
                      {schedule.classes.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No classes scheduled for this program yet.
                        </p>
                      ) : (
                        <div className="grid gap-3">
                          {schedule.classes.map((classSession) => (
                            <div
                              key={classSession.id}
                              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                  {classSession.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(
                                      classSession.startTime
                                    ).toLocaleString("en-US", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {classSession.enrolledCount}/
                                    {classSession.maxStudents ?? "∞"}
                                  </span>
                                </div>
                              </div>
                              {classSession.meetingUrl && (
                                <Link
                                  href={classSession.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium"
                                >
                                  Join
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Assignments Section */}
                    <div className="p-6">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Assignments ({schedule.assignments.length})
                      </h3>
                      {schedule.assignments.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No assignments created for this program yet.
                        </p>
                      ) : (
                        <div className="grid gap-3">
                          {schedule.assignments.map((assignment) => (
                            <Link
                              key={assignment.id}
                              href={`/dashboard/instructor/assignments/${assignment.id}`}
                              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                  {assignment.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  <span className="capitalize">
                                    {assignment.type.toLowerCase().replace("_", " ")}
                                  </span>
                                  {assignment.dueDate && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      Due{" "}
                                      {new Date(
                                        assignment.dueDate
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                  <span>
                                    {assignment.submissionCount}/
                                    {assignment.totalStudents} submitted
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Standalone Classes/Assignments */}
                {(standaloneClasses.length > 0 ||
                  standaloneAssignments.length > 0) && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-6 text-white">
                      <h2 className="text-xl font-bold">
                        Standalone Classes & Assignments
                      </h2>
                      <p className="text-slate-200 text-sm mt-1">
                        Classes and assignments not linked to a specific program
                      </p>
                    </div>

                    {standaloneClasses.length > 0 && (
                      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                          Classes ({standaloneClasses.length})
                        </h3>
                        <div className="grid gap-3">
                          {standaloneClasses.map((classSession) => (
                            <div
                              key={classSession.id}
                              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                  {classSession.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  <span>
                                    {new Date(
                                      classSession.startTime
                                    ).toLocaleString()}
                                  </span>
                                  <span>
                                    {classSession.enrolledCount}/
                                    {classSession.maxStudents ?? "∞"}
                                  </span>
                                </div>
                              </div>
                              {classSession.meetingUrl && (
                                <Link
                                  href={classSession.meetingUrl}
                                  target="_blank"
                                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                                >
                                  Join
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {standaloneAssignments.length > 0 && (
                      <div className="p-6">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                          Assignments ({standaloneAssignments.length})
                        </h3>
                        <div className="grid gap-3">
                          {standaloneAssignments.map((assignment) => (
                            <Link
                              key={assignment.id}
                              href={`/dashboard/instructor/assignments/${assignment.id}`}
                              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                  {assignment.title}
                                </h4>
                                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {assignment.dueDate &&
                                    `Due ${new Date(
                                      assignment.dueDate
                                    ).toLocaleDateString()}`}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Timeline View - Modern Calendar */}
        {viewMode === "timeline" && (
          <ModernInstructorCalendar sessions={scheduleData.classes} />
        )}
      </div>
    </InstructorLayout>
  );
}
