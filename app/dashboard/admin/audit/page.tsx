"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import {
  Shield,
  Search,
  Download,
  User,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Info,
  XCircle,
  AlertCircle,
  Clock,
  FileJson,
  FileText,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

type AuditLog = {
  id: string;
  timestamp: string;
  userId?: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: "success" | "failed";
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  userAgent?: string;
  metadata?: {
    errorCode?: string;
    errorMessage?: string;
  } | null;
};

type SortField = "timestamp" | "user" | "action" | "resource" | "status" | "severity";
type SortDirection = "asc" | "desc";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterResource, setFilterResource] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [quickFilter, setQuickFilter] = useState<string>("all");
  const logsPerPage = 50;

  const loadLogs = async () => {
    try {
      const offset = (page - 1) * logsPerPage;
      const res = await fetch(`/api/admin/audit?limit=${logsPerPage}&offset=${offset}`);

      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      } else {
        console.error("Failed to load audit logs");
      }
    } catch (error) {
      console.error("Error loading audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadLogs();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, page]);

  // Quick filter handler
  const applyQuickFilter = (filter: string) => {
    setQuickFilter(filter);
    const now = new Date();

    switch (filter) {
      case "today":
        setDateFrom(new Date(now.setHours(0, 0, 0, 0)).toISOString().split("T")[0]);
        setDateTo(new Date().toISOString().split("T")[0]);
        break;
      case "7days":
        setDateFrom(new Date(now.setDate(now.getDate() - 7)).toISOString().split("T")[0]);
        setDateTo(new Date().toISOString().split("T")[0]);
        break;
      case "30days":
        setDateFrom(new Date(now.setDate(now.getDate() - 30)).toISOString().split("T")[0]);
        setDateTo(new Date().toISOString().split("T")[0]);
        break;
      case "all":
      default:
        setDateFrom("");
        setDateTo("");
        break;
    }
  };

  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        searchTerm === "" ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);

      const matchesAction = filterAction === "all" || log.action === filterAction;
      const matchesStatus = filterStatus === "all" || log.status === filterStatus;
      const matchesResource = filterResource === "all" || log.resource === filterResource;
      const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;

      // Date range filtering
      let matchesDateRange = true;
      const logDate = new Date(log.timestamp);
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && logDate >= fromDate;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && logDate <= toDate;
      }

      return matchesSearch && matchesAction && matchesStatus && matchesResource && matchesSeverity && matchesDateRange;
    })
    .sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortField) {
        case "timestamp":
          aVal = new Date(a.timestamp).getTime();
          bVal = new Date(b.timestamp).getTime();
          break;
        case "user":
          aVal = a.user.toLowerCase();
          bVal = b.user.toLowerCase();
          break;
        case "action":
          aVal = a.action;
          bVal = b.action;
          break;
        case "resource":
          aVal = a.resource;
          bVal = b.resource;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "severity":
          const severityOrder = { INFO: 1, WARNING: 2, ERROR: 3, CRITICAL: 4 };
          aVal = severityOrder[a.severity];
          bVal = severityOrder[b.severity];
          break;
        default:
          aVal = a.timestamp;
          bVal = b.timestamp;
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const uniqueResources = Array.from(new Set(logs.map((l) => l.resource))).sort();

  const stats = {
    total: total,
    success: logs.filter((l) => l.status === "success").length,
    failed: logs.filter((l) => l.status === "failed").length,
    critical: logs.filter((l) => l.severity === "CRITICAL").length,
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-slate-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-purple-500" />
    ) : (
      <ChevronDown className="w-4 h-4 text-purple-500" />
    );
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Plus className="w-4 h-4" />;
      case "UPDATE":
        return <Edit className="w-4 h-4" />;
      case "DELETE":
        return <Trash2 className="w-4 h-4" />;
      case "VIEW":
        return <Eye className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20";
      case "UPDATE":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "DELETE":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "VIEW":
        return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700";
      case "LOGIN":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20";
      case "LOGOUT":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "INFO":
        return <Info className="w-4 h-4" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4" />;
      case "ERROR":
        return <XCircle className="w-4 h-4" />;
      case "CRITICAL":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "INFO":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "WARNING":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";
      case "ERROR":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "CRITICAL":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700";
    }
  };

  const handleExportCSV = () => {
    const escapeCsvField = (field: string) => {
      if (field.includes(",") || field.includes('"') || field.includes("\n")) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const csv = [
      ["Timestamp", "User", "Action", "Resource", "Details", "IP Address", "Status", "Severity"],
      ...filteredLogs.map((log) => [
        new Date(log.timestamp).toLocaleString(),
        log.user,
        log.action,
        log.resource,
        log.details,
        log.ipAddress,
        log.status,
        log.severity,
      ].map(escapeCsvField)),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / logsPerPage);

  return (
    <AdminLayout>
      <main className="max-w-[1600px] mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / System</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Audit Logs</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Comprehensive tracking of all system activities and security events
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLoading(true);
                loadLogs();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Auto-refresh {autoRefresh ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Events</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{total.toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">All time records</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Success</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.success}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Current page</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Failed</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.failed}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Current page</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Critical Events</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.critical}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Current page</p>
          </div>
        </div>

        {/* Quick Time Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Quick Filter:</span>
          {[
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "7days", label: "Last 7 Days" },
            { value: "30days", label: "Last 30 Days" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => applyQuickFilter(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                quickFilter === filter.value
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by user, details, resource, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setQuickFilter("custom");
                }}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                placeholder="From"
              />
              <span className="text-slate-500 dark:text-slate-400">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setQuickFilter("custom");
                }}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                placeholder="To"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
            >
              <option value="all">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="VIEW">View</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>
            <select
              value={filterResource}
              onChange={(e) => setFilterResource(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
            >
              <option value="all">All Resources</option>
              {uniqueResources.map((resource) => (
                <option key={resource} value={resource}>
                  {resource}
                </option>
              ))}
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
            >
              <option value="all">All Severities</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={handleExportCSV}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={handleExportJSON}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <FileJson className="w-4 h-4" />
              JSON
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th
                    onClick={() => handleSort("timestamp")}
                    className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Timestamp
                      {getSortIcon("timestamp")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("user")}
                    className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      User
                      {getSortIcon("user")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("action")}
                    className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Action
                      {getSortIcon("action")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("resource")}
                    className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Resource
                      {getSortIcon("resource")}
                    </div>
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th
                    onClick={() => handleSort("severity")}
                    className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Severity
                      {getSortIcon("severity")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Loading audit logs...
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      No audit logs found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {log.user}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                            log.action
                          )}`}
                        >
                          {getActionIcon(log.action)}
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                        {log.resource}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-md truncate">
                        {log.details}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                            log.severity
                          )}`}
                        >
                          {getSeverityIcon(log.severity)}
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            log.status === "success"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                          } capitalize`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold">{filteredLogs.length}</span> of{" "}
            <span className="font-semibold">{logs.length}</span> events on page{" "}
            <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
            <span className="text-slate-500 dark:text-slate-500"> ({total.toLocaleString()} total)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {page > 3 && (
                <>
                  <button
                    onClick={() => setPage(1)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    1
                  </button>
                  <span className="text-slate-400">...</span>
                </>
              )}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, page - 2) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {page < totalPages - 2 && (
                <>
                  <span className="text-slate-400">...</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLog(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Audit Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Timestamp</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">User</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{selectedLog.user}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">User ID</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-mono">{selectedLog.userId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">IP Address</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Action</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getActionColor(selectedLog.action)}`}>
                    {getActionIcon(selectedLog.action)}
                    {selectedLog.action}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Resource</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{selectedLog.resource}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedLog.status === "success"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                  } capitalize`}>
                    {selectedLog.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Severity</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedLog.severity)}`}>
                    {getSeverityIcon(selectedLog.severity)}
                    {selectedLog.severity}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Details</p>
                <p className="text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">{selectedLog.details}</p>
              </div>

              {selectedLog.userAgent && (
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">User Agent</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg font-mono break-all">{selectedLog.userAgent}</p>
                </div>
              )}

              {selectedLog.metadata && (
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Additional Metadata</p>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2">
                    {selectedLog.metadata.errorCode && (
                      <div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Error Code: </span>
                        <span className="text-xs text-red-600 dark:text-red-400 font-mono">{selectedLog.metadata.errorCode}</span>
                      </div>
                    )}
                    {selectedLog.metadata.errorMessage && (
                      <div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Error Message: </span>
                        <span className="text-xs text-slate-900 dark:text-slate-100">{selectedLog.metadata.errorMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
