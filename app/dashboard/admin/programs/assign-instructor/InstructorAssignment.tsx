"use client";

import { useEffect, useState } from "react";
import Button from "../../../../../components/ui/button";
import {
  Book, User, Loader2, CheckCircle2, AlertCircle, Search,
  Users, Filter, Grid, List,
  Zap, Award, Clock, X
} from "lucide-react";

type Program = {
  id: string;
  title: string;
  description: string | null;
  enrollmentCount: number;
  currentInstructor: {
    email: string;
    name: string;
  } | null;
};

type Instructor = {
  id: string;
  name: string | null;
  email: string;
};

type ViewMode = "grid" | "list";
type FilterMode = "all" | "assigned" | "unassigned" | "enrolled";

export default function InstructorAssignment() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedAssignments, setSelectedAssignments] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(new Set());
  const [bulkInstructor, setBulkInstructor] = useState<string>("");
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [programsRes, instructorsRes] = await Promise.all([
        fetch("/api/admin/programs"),
        fetch("/api/instructors"),
      ]);

      if (programsRes.ok && instructorsRes.ok) {
        const programsData = await programsRes.json();
        const instructorsData = await instructorsRes.json();

        setPrograms(programsData.programs || []);
        setInstructors(instructorsData.instructors || []);

        // Initialize selected assignments with current instructors
        const initialAssignments: Record<string, string> = {};
        (programsData.programs || []).forEach((p: Program) => {
          if (p.currentInstructor) {
            initialAssignments[p.id] = p.currentInstructor.email;
          }
        });
        setSelectedAssignments(initialAssignments);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setErrorMessage("Failed to load programs and instructors");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async (programId: string, instructorEmail: string) => {
    setSaving(programId);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/programs/assign-instructor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId, instructorEmail }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(`✓ Instructor assigned to ${data.programTitle}`);
        setSelectedAssignments((prev) => ({ ...prev, [programId]: instructorEmail }));
        await loadData();

        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const error = await res.json();
        setErrorMessage(error.error || "Failed to assign instructor");
      }
    } catch (error) {
      console.error("Failed to assign instructor:", error);
      setErrorMessage("Failed to assign instructor");
    } finally {
      setSaving(null);
    }
  };

  const handleUnassign = async (programId: string, programTitle: string) => {
    setSaving(programId);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/programs/unassign-instructor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId }),
      });

      if (res.ok) {
        setSuccessMessage(`✓ Instructor unassigned from ${programTitle}`);
        setSelectedAssignments((prev) => ({ ...prev, [programId]: "" }));
        await loadData();

        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const error = await res.json();
        setErrorMessage(error.error || "Failed to unassign instructor");
      }
    } catch (error) {
      console.error("Failed to unassign instructor:", error);
      setErrorMessage("Failed to unassign instructor");
    } finally {
      setSaving(null);
    }
  };

  const handleBulkAssignment = async () => {
    if (!bulkInstructor || selectedPrograms.size === 0) return;

    const programIds = Array.from(selectedPrograms);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const results = await Promise.all(
        programIds.map(programId =>
          fetch("/api/admin/programs/assign-instructor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ programId, instructorEmail: bulkInstructor }),
          })
        )
      );

      const successful = results.filter(r => r.ok).length;
      setSuccessMessage(`✓ Successfully assigned instructor to ${successful} program${successful !== 1 ? 's' : ''}`);
      setSelectedPrograms(new Set());
      setBulkInstructor("");
      setShowBulkActions(false);
      await loadData();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed bulk assignment:", error);
      setErrorMessage("Failed to complete bulk assignment");
    }
  };

  const toggleProgramSelection = (programId: string) => {
    setSelectedPrograms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(programId)) {
        newSet.delete(programId);
      } else {
        newSet.add(programId);
      }
      return newSet;
    });
  };

  const filteredPrograms = programs
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (filterMode === "assigned") return p.currentInstructor !== null;
      if (filterMode === "unassigned") return p.currentInstructor === null;
      if (filterMode === "enrolled") return p.enrollmentCount > 0;
      return true;
    });

  // Analytics
  const totalPrograms = programs.length;
  const assignedPrograms = programs.filter(p => p.currentInstructor).length;
  const totalEnrollments = programs.reduce((sum, p) => sum + p.enrollmentCount, 0);
  const activeInstructors = new Set(programs.map(p => p.currentInstructor?.email).filter(Boolean)).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading programs and instructors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Matching admin page style */}
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Programs</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Assign Instructors</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage instructor assignments to programs and track enrollment status
        </p>
      </div>

      {/* Analytics Cards */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Programs</p>
              <div className="bg-purple-500 p-2 rounded-lg">
                <Book className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalPrograms}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Assigned</p>
              <div className="bg-emerald-500 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {assignedPrograms}/{totalPrograms}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Students</p>
              <div className="bg-blue-500 p-2 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalEnrollments}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Instructors</p>
              <div className="bg-amber-500 p-2 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{activeInstructors}</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm font-medium text-red-800 dark:text-red-200">{errorMessage}</p>
        </div>
      )}

      {/* Toolbar - Responsive */}
      <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter and View Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Dropdown */}
          <div className="relative flex-1 min-w-[140px] sm:flex-initial">
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as FilterMode)}
              className="w-full appearance-none pl-3 pr-9 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="all">All Programs</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
              <option value="enrolled">With Students</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* View Mode Toggle - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Bulk Actions Toggle */}
          <Button
            onClick={() => setShowBulkActions(!showBulkActions)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-sm"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Bulk Actions</span>
            <span className="sm:hidden">Bulk</span>
          </Button>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Bulk Assignment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Select multiple programs and assign an instructor at once</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {selectedPrograms.size} program{selectedPrograms.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={bulkInstructor}
                onChange={(e) => setBulkInstructor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={selectedPrograms.size === 0}
              >
                <option value="">Select instructor...</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.email}>
                    {instructor.name || instructor.email}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBulkAssignment}
                disabled={!bulkInstructor || selectedPrograms.size === 0}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
              >
                Assign to Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Programs List/Grid - Responsive */}
      <div className={`grid gap-3 md:gap-4 ${viewMode === "grid" ? "sm:grid-cols-2" : "grid-cols-1"}`}>
        {filteredPrograms.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center sm:col-span-2">
            <Book className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">No programs found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredPrograms.map((program) => (
            <div
              key={program.id}
              className={`bg-white dark:bg-slate-800 rounded-xl border transition-all duration-200 ${
                selectedPrograms.has(program.id)
                  ? "border-purple-500 ring-2 ring-purple-500 bg-purple-50/30 dark:bg-purple-950/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700"
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col gap-3 md:gap-4">
                  {/* Program Header */}
                  <div className="flex items-start gap-3">
                    {showBulkActions && (
                      <input
                        type="checkbox"
                        checked={selectedPrograms.has(program.id)}
                        onChange={() => toggleProgramSelection(program.id)}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 flex-shrink-0"
                      />
                    )}

                    <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <Book className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base md:text-lg mb-1 line-clamp-2">
                        {program.title}
                      </h3>
                      {program.description && (
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2 md:mb-3">
                          {program.description}
                        </p>
                      )}

                      {/* Metrics */}
                      <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                          <span className="text-[11px] md:text-xs font-medium text-slate-700 dark:text-slate-300">
                            {program.enrollmentCount} student{program.enrollmentCount !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {program.currentInstructor ? (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <User className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-[11px] md:text-xs font-medium text-emerald-700 dark:text-emerald-300 truncate max-w-[150px]">
                              {program.currentInstructor.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-600 dark:text-amber-400" />
                            <span className="text-[11px] md:text-xs font-medium text-amber-700 dark:text-amber-300">
                              Unassigned
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Assignment Controls */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 md:pt-3 border-t border-slate-100 dark:border-slate-800">
                    <select
                      value={selectedAssignments[program.id] || ""}
                      onChange={(e) => {
                        const instructorEmail = e.target.value;
                        if (instructorEmail) {
                          setSelectedAssignments((prev) => ({
                            ...prev,
                            [program.id]: instructorEmail,
                          }));
                        }
                      }}
                      className="flex-1 px-3 py-2 md:py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={saving === program.id}
                    >
                      <option value="">Select instructor...</option>
                      {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.email}>
                          {instructor.name || instructor.email}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() =>
                        handleAssignment(program.id, selectedAssignments[program.id])
                      }
                      disabled={
                        !selectedAssignments[program.id] ||
                        saving === program.id ||
                        selectedAssignments[program.id] === program.currentInstructor?.email
                      }
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                      {saving === program.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        "Assign"
                      )}
                    </button>

                    {program.currentInstructor && (
                      <button
                        onClick={() => handleUnassign(program.id, program.title)}
                        disabled={saving === program.id}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2"
                        title="Unassign instructor"
                      >
                        {saving === program.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Unassign</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {filteredPrograms.length > 0 && (
        <div className="text-center pt-3 md:pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs md:text-sm text-slate-500">
            Showing {filteredPrograms.length} of {totalPrograms} programs
            {filterMode !== "all" && ` (filtered by: ${filterMode})`}
          </p>
        </div>
      )}
    </div>
  );
}
