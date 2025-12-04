"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  Users,
  BookOpen,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  FileSpreadsheet,
} from "lucide-react";

type BulkOperationType = "import_users" | "bulk_enroll" | "bulk_status" | "bulk_delete";

type OperationResult = {
  success: number;
  failed: number;
  errors: string[];
};

export default function BulkOperationsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeOperation, setActiveOperation] = useState<BulkOperationType>("import_users");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<OperationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Import users state
  const [csvData, setCsvData] = useState<string>("");
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Bulk enroll state
  const [selectedCourse, setSelectedCourse] = useState("");
  const [userIds, setUserIds] = useState<string>("");

  // Bulk status state
  const [statusAction, setStatusAction] = useState<"promote_instructor" | "demote_student" | "delete">("promote_instructor");
  const [targetUserIds, setTargetUserIds] = useState<string>("");

  const operations = [
    {
      id: "import_users" as const,
      label: "Import Users",
      icon: Upload,
      description: "Bulk import users from CSV file",
    },
    {
      id: "bulk_enroll" as const,
      label: "Bulk Enroll",
      icon: BookOpen,
      description: "Enroll multiple students in a course",
    },
    {
      id: "bulk_status" as const,
      label: "Update Status",
      icon: RefreshCw,
      description: "Activate or deactivate multiple users",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvData(text);

      // Parse CSV for preview
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length > 0) {
        const headers = lines[0].split(",").map((h) => h.trim());
        const rows = lines.slice(1, 6).map((line) => {
          const values = line.split(",").map((v) => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((h, i) => {
            row[h] = values[i] || "";
          });
          return row;
        });
        setPreviewData(rows);
      }
    };
    reader.readAsText(file);
  };

  const handleImportUsers = async () => {
    if (!csvData) return;
    setProcessing(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/bulk/import-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData }),
      });
      const data = await res.json();
      setResult({
        success: data.imported || 0,
        failed: data.failed || 0,
        errors: data.errors || [],
      });
    } catch (error) {
      setResult({
        success: 0,
        failed: 0,
        errors: ["Network error occurred"],
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkEnroll = async () => {
    if (!selectedCourse || !userIds.trim()) return;
    setProcessing(true);
    setResult(null);

    const ids = userIds.split(/[,\n]/).map((id) => id.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/admin/bulk/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selectedCourse, userIds: ids }),
      });
      const data = await res.json();
      setResult({
        success: data.enrolled || 0,
        failed: data.failed || 0,
        errors: data.errors || [],
      });
    } catch (error) {
      setResult({
        success: 0,
        failed: 0,
        errors: ["Network error occurred"],
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkStatus = async () => {
    if (!targetUserIds.trim()) return;
    setProcessing(true);
    setResult(null);

    const ids = targetUserIds.split(/[,\n]/).map((id) => id.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/admin/bulk/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: ids, action: statusAction }),
      });
      const data = await res.json();
      setResult({
        success: data.updated || 0,
        failed: data.failed || 0,
        errors: data.errors || [],
      });
    } catch (error) {
      setResult({
        success: 0,
        failed: 0,
        errors: ["Network error occurred"],
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "name,email,password,role,phone\nJohn Doe,john@example.com,password123,STUDENT,\nJane Smith,jane@example.com,password123,PARENT,555-1234";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    switch (activeOperation) {
      case "import_users":
        handleImportUsers();
        break;
      case "bulk_enroll":
        handleBulkEnroll();
        break;
      case "bulk_status":
        handleBulkStatus();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Bulk Operations
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Operation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          {operations.map((op) => {
            const Icon = op.icon;
            return (
              <button
                key={op.id}
                onClick={() => {
                  setActiveOperation(op.id);
                  setResult(null);
                }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                  activeOperation === op.id
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {op.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Import Users */}
          {activeOperation === "import_users" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload a CSV file to import multiple users at once. Required columns: name, email, password, role (STUDENT/PARENT/INSTRUCTOR/ADMIN).
              </p>

              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                <Download className="w-4 h-4" />
                Download CSV Template
              </button>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition"
              >
                <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Click to upload CSV or drag and drop
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {previewData.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Preview (first 5 rows):
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700">
                          {Object.keys(previewData[0]).map((key) => (
                            <th
                              key={key}
                              className="px-3 py-2 text-left text-slate-700 dark:text-slate-300"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, i) => (
                          <tr key={i} className="border-t border-slate-200 dark:border-slate-600">
                            {Object.values(row).map((val, j) => (
                              <td
                                key={j}
                                className="px-3 py-2 text-slate-600 dark:text-slate-400"
                              >
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bulk Enroll */}
          {activeOperation === "bulk_enroll" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enroll multiple students in a course at once. Enter user IDs or emails separated by commas or new lines.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="">Select a course...</option>
                  {/* Courses would be loaded dynamically */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  User IDs or Emails
                </label>
                <textarea
                  value={userIds}
                  onChange={(e) => setUserIds(e.target.value)}
                  placeholder="user1@example.com, user2@example.com&#10;or one per line"
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>
            </div>
          )}

          {/* Bulk Status */}
          {activeOperation === "bulk_status" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Update roles or delete multiple user accounts at once.
              </p>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={statusAction === "promote_instructor"}
                    onChange={() => setStatusAction("promote_instructor")}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Promote to Instructor
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={statusAction === "demote_student"}
                    onChange={() => setStatusAction("demote_student")}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Demote to Student
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={statusAction === "delete"}
                    onChange={() => setStatusAction("delete")}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-sm text-red-600 dark:text-red-400">
                    Delete Users
                  </span>
                </label>
              </div>

              {statusAction === "delete" && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Warning: Deleting users is permanent and cannot be undone. All associated data will be removed.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  User IDs or Emails
                </label>
                <textarea
                  value={targetUserIds}
                  onChange={(e) => setTargetUserIds(e.target.value)}
                  placeholder="user1@example.com, user2@example.com&#10;or one per line"
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">{result.success} successful</span>
                </div>
                {result.failed > 0 && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">{result.failed} failed</span>
                  </div>
                )}
              </div>
              {result.errors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Errors:
                  </p>
                  <ul className="text-sm text-red-600 dark:text-red-400 space-y-1 max-h-32 overflow-y-auto">
                    {result.errors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={processing}
            className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {processing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Execute"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
