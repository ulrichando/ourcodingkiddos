"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Archive, Trash2, RotateCcw, AlertTriangle, Download, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ParentLayout from "../../../../components/parent/ParentLayout";

export default function ManageStudentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [archivedStudents, setArchivedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    student: any | null;
    action: "archive" | "delete" | "restore";
    confirmText: string;
  }>({ open: false, student: null, action: "archive", confirmText: "" });

  useEffect(() => {
    if (!session?.user?.email) return;
    loadStudents();
  }, [session?.user?.email]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students", { credentials: "include" });
      const data = await res.json();
      // Separate active and archived students
      const active = (data.students || []).filter((s: any) => !s.archivedAt);
      const archived = (data.students || []).filter((s: any) => s.archivedAt);
      setStudents(active);
      setArchivedStudents(archived);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
      setArchivedStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveStudent = async (student: any) => {
    setConfirmDialog({
      open: true,
      student,
      action: "archive",
      confirmText: "",
    });
  };

  const handleDeleteStudent = async (student: any) => {
    setConfirmDialog({
      open: true,
      student,
      action: "delete",
      confirmText: "",
    });
  };

  const handleRestoreStudent = async (student: any) => {
    setConfirmDialog({
      open: true,
      student,
      action: "restore",
      confirmText: "",
    });
  };

  const executeAction = async () => {
    if (!confirmDialog.student) return;

    const { student, action } = confirmDialog;
    const expectedText = student.name || student.username;

    // Require typing name for archive/delete actions
    if ((action === "archive" || action === "delete") && confirmDialog.confirmText !== expectedText) {
      alert(`Please type "${expectedText}" to confirm`);
      return;
    }

    try {
      const res = await fetch(`/api/students/${student.id}`, {
        method: action === "delete" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: action === "restore" ? "restore" : action,
        }),
      });

      if (!res.ok) throw new Error("Action failed");

      // Reload students
      await loadStudents();
      setConfirmDialog({ open: false, student: null, action: "archive", confirmText: "" });

      // Show success message
      const messages = {
        archive: "Student archived successfully. You can restore within 30 days.",
        delete: "Student deleted permanently.",
        restore: "Student restored successfully!",
      };
      alert(messages[action]);
    } catch (error) {
      console.error("Failed to execute action:", error);
      alert("Failed to complete action. Please try again.");
    }
  };

  const downloadProgressReport = async (studentId: string) => {
    alert("Downloading progress report... (Feature coming soon)");
  };

  const activeList = showArchived ? archivedStudents : students;

  return (
    <ParentLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Home / Students</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Manage Students
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Archive or remove students from your account
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showArchived ? "outline" : "default"}
                onClick={() => setShowArchived(false)}
                size="sm"
              >
                Active ({students.length})
              </Button>
              <Button
                variant={showArchived ? "default" : "outline"}
                onClick={() => setShowArchived(true)}
                size="sm"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archived ({archivedStudents.length})
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center text-slate-500 dark:text-slate-400">
              Loading students...
            </CardContent>
          </Card>
        ) : activeList.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-3xl">
                {showArchived ? "📦" : "👤"}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {showArchived ? "No Archived Students" : "No Active Students"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {showArchived
                  ? "Students you archive will appear here for 30 days before permanent deletion."
                  : "Add a student to get started"}
              </p>
              {!showArchived && (
                <Link href="/dashboard/parent/add-student">
                  <Button>Add Student</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Info Banner */}
            {!showArchived && (
              <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-200">
                      <p className="font-semibold mb-1">Archive vs Delete</p>
                      <ul className="space-y-1 text-xs">
                        <li><strong>Archive:</strong> Hides the student but keeps all data. Can be restored within 30 days.</li>
                        <li><strong>Delete:</strong> Permanently removes the student and all their progress. Cannot be undone.</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {showArchived && archivedStudents.length > 0 && (
              <Card className="border-0 shadow-sm bg-amber-50 dark:bg-amber-950/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900 dark:text-amber-200">
                      <p className="font-semibold mb-1">30-Day Grace Period</p>
                      <p className="text-xs">Archived students will be automatically deleted after 30 days. Restore them before then to keep their data.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Student List */}
            {activeList.map((student) => {
              const daysUntilDeletion = student.archivedAt
                ? Math.max(0, 30 - Math.floor((Date.now() - new Date(student.archivedAt).getTime()) / (1000 * 60 * 60 * 24)))
                : null;

              return (
                <Card key={student.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="text-3xl sm:text-4xl flex-shrink-0">{student.avatar || "👤"}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                            {student.name || student.username}
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3">
                            <div>
                              <span className="font-medium">Level:</span> {student.currentLevel || 1}
                            </div>
                            <div>
                              <span className="font-medium">XP:</span> {student.totalXp || 0}
                            </div>
                            <div>
                              <span className="font-medium">Badges:</span> {student.badges?.length || 0}
                            </div>
                            <div>
                              <span className="font-medium">Streak:</span> {student.streakDays || 0} days
                            </div>
                          </div>
                          {daysUntilDeletion !== null && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-medium">
                              <Archive className="w-3 h-3" />
                              {daysUntilDeletion} days until permanent deletion
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                        {!showArchived ? (
                          <>
                            <Link href={`/dashboard/parent/students/${student.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                              >
                                <Pencil className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadProgressReport(student.id)}
                              className="hidden sm:flex"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export Data
                            </Button>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleArchiveStudent(student)}
                            >
                              <Archive className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Archive</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteStudent(student)}
                            >
                              <Trash2 className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleRestoreStudent(student)}
                            >
                              <RotateCcw className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Restore</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteStudent(student)}
                            >
                              <Trash2 className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Delete Now</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmDialog.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-0 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  {confirmDialog.action === "archive" && "Archive Student"}
                  {confirmDialog.action === "delete" && "Delete Student Permanently"}
                  {confirmDialog.action === "restore" && "Restore Student"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  {confirmDialog.action === "archive" && (
                    <>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        This will hide {confirmDialog.student?.name || confirmDialog.student?.username} from your dashboard.
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>All progress data will be preserved</li>
                        <li>You can restore within 30 days</li>
                        <li>After 30 days, data will be permanently deleted</li>
                      </ul>
                    </>
                  )}
                  {confirmDialog.action === "delete" && (
                    <>
                      <p className="font-semibold text-red-600 dark:text-red-400">
                        ⚠️ This action cannot be undone!
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        You will permanently lose:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>{confirmDialog.student?.totalXp || 0} XP earned</li>
                        <li>{confirmDialog.student?.badges?.length || 0} badges</li>
                        <li>All lesson progress and certificates</li>
                        <li>Login credentials and account</li>
                      </ul>
                    </>
                  )}
                  {confirmDialog.action === "restore" && (
                    <>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Restore {confirmDialog.student?.name || confirmDialog.student?.username}?
                      </p>
                      <p>All their progress and data will be restored to your active students.</p>
                    </>
                  )}
                </div>

                {(confirmDialog.action === "archive" || confirmDialog.action === "delete") && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Type <span className="text-purple-600 dark:text-purple-400">{confirmDialog.student?.name || confirmDialog.student?.username}</span> to confirm:
                    </label>
                    <input
                      type="text"
                      value={confirmDialog.confirmText}
                      onChange={(e) => setConfirmDialog({ ...confirmDialog, confirmText: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                      placeholder="Type student name"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDialog({ open: false, student: null, action: "archive", confirmText: "" })}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={executeAction}
                    variant={
                      confirmDialog.action === "delete"
                        ? "destructive"
                        : confirmDialog.action === "restore"
                        ? "success"
                        : "warning"
                    }
                    className="flex-1"
                  >
                    {confirmDialog.action === "archive" && "Archive Student"}
                    {confirmDialog.action === "delete" && "Delete Permanently"}
                    {confirmDialog.action === "restore" && "Restore Student"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
