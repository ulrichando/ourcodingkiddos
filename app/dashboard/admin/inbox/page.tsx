"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Button from "../../../../components/ui/button";
import {  Mail,
  MailOpen,
  Reply,
  Archive,
  Trash2,
  Loader2,
  Search,
  ChevronLeft,
  Send,
  Clock,
  User,
  CheckCircle,
  X,
  Paperclip,
  RefreshCw,
  Edit3,
  Bell,
  BellOff,
} from "lucide-react";
import { sanitizeEmailHtml } from "@/lib/sanitize";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type ReceivedEmail = {
  id: string;
  resendEmailId: string;
  from: string;
  fromName?: string;
  to: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
  snippet?: string;
  attachments?: { filename: string; contentType: string; size: number }[];
  status: string;
  category: string;
  priority: string;
  assignedToEmail?: string;
  assignedToName?: string;
  userId?: string;
  receivedAt: string;
  replies: {
    id: string;
    fromEmail: string;
    fromName?: string;
    subject: string;
    htmlBody: string;
    createdAt: string;
  }[];
};

const statusColors: Record<string, string> = {
  UNREAD: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  READ: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  REPLIED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
  SPAM: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const categoryColors: Record<string, string> = {
  GENERAL: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  SUPPORT: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  BILLING: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ENROLLMENT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  FEEDBACK: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  PARTNERSHIP: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  SPAM: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const priorityColors: Record<string, string> = {
  LOW: "text-slate-500",
  MEDIUM: "text-blue-600",
  HIGH: "text-orange-600",
  URGENT: "text-red-600",
};

export default function AdminInboxPage() {
  const [emails, setEmails] = useState<ReceivedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  // Selected email state
  const [selectedEmail, setSelectedEmail] = useState<ReceivedEmail | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Reply state
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);

  // Compose state
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [composeFrom, setComposeFrom] = useState("support@ourcodingkiddos.com");
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [senderAddresses, setSenderAddresses] = useState<{ value: string; label: string; displayName: string }[]>([]);

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const previousUnreadCount = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play notification sound using Web Audio API
  const playNotificationSound = useCallback(() => {
    if (!notificationsEnabled) return;

    try {
      // Create audio context on demand (browser requirement)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Pleasant notification tone (two-tone chime)
      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
      oscillator.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.1); // C#6

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    } catch (error) {
      console.log("Could not play notification sound:", error);
    }
  }, [notificationsEnabled]);

  // Check for new emails periodically
  const checkForNewEmails = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/emails?status=UNREAD&limit=1");
      const data = await res.json();
      const currentUnreadCount = data.statusCounts?.UNREAD || 0;

      // Play sound if unread count increased (new email arrived)
      if (previousUnreadCount.current !== null && currentUnreadCount > previousUnreadCount.current) {
        playNotificationSound();

        // Also show browser notification if permitted
        if (Notification.permission === "granted") {
          new Notification("New Email", {
            body: `You have ${currentUnreadCount} unread email${currentUnreadCount > 1 ? "s" : ""}`,
            icon: "/icon.svg",
          });
        }
      }

      previousUnreadCount.current = currentUnreadCount;
    } catch (error) {
      console.error("Failed to check for new emails:", error);
    }
  }, [playNotificationSound]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Set up polling for new emails (every 30 seconds)
  useEffect(() => {
    // Initial check
    checkForNewEmails();

    // Poll every 30 seconds
    const pollInterval = setInterval(checkForNewEmails, 30000);

    return () => clearInterval(pollInterval);
  }, [checkForNewEmails]);

  useEffect(() => {
    loadEmails();
    loadSenderAddresses();
  }, [statusFilter, categoryFilter, search]);

  const loadSenderAddresses = async () => {
    try {
      const res = await fetch("/api/admin/emails/compose");
      const data = await res.json();
      if (data.addresses) {
        setSenderAddresses(data.addresses);
      }
    } catch (error) {
      console.error("Failed to load sender addresses:", error);
    }
  };

  const loadEmails = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (search) params.append("search", search);

      const res = await fetch(`/api/admin/emails?${params.toString()}`);
      const data = await res.json();

      if (data.emails) {
        setEmails(data.emails);
        setStatusCounts(data.statusCounts || {});
      }
    } catch (error) {
      console.error("Failed to load emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmailDetails = async (id: string) => {
    try {
      setLoadingEmail(true);
      const res = await fetch(`/api/admin/emails/${id}`);
      const data = await res.json();

      if (data.id) {
        setSelectedEmail(data);
        setReplySubject(`Re: ${data.subject}`);
        // Refresh list to update read status
        loadEmails();
      }
    } catch (error) {
      console.error("Failed to load email:", error);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/emails/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (selectedEmail?.id === id) {
        setSelectedEmail({ ...selectedEmail, status });
      }
      loadEmails();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleUpdateCategory = async (id: string, category: string) => {
    try {
      await fetch(`/api/admin/emails/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      if (selectedEmail?.id === id) {
        setSelectedEmail({ ...selectedEmail, category });
      }
      loadEmails();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this email?")) return;

    try {
      await fetch(`/api/admin/emails/${id}`, {
        method: "DELETE",
      });

      if (selectedEmail?.id === id) {
        setSelectedEmail(null);
      }
      loadEmails();
    } catch (error) {
      console.error("Failed to delete email:", error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedEmail || !replyBody.trim()) return;

    try {
      setSending(true);

      // Create HTML email body with branding
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #8B5CF6, #EC4899); border-radius: 12px; line-height: 50px; color: white; font-weight: bold; font-size: 20px;">CK</div>
          </div>
          <div style="line-height: 1.6; color: #333;">
            ${replyBody.replace(/\n/g, "<br>")}
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #64748b; font-size: 14px;">
            Best regards,<br>
            <strong>Coding Kiddos Support Team</strong>
          </p>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            &copy; ${new Date().getFullYear()} Coding Kiddos. All rights reserved.
          </p>
        </div>
      `;

      const res = await fetch(`/api/admin/emails/${selectedEmail.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: replySubject,
          htmlBody,
          textBody: replyBody,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Reply sent successfully!");
        setShowReplyForm(false);
        setReplyBody("");
        loadEmailDetails(selectedEmail.id);
      } else {
        alert(`Failed to send: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleSendCompose = async () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) return;

    try {
      setSending(true);

      // Create HTML email body with branding
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #8B5CF6, #EC4899); border-radius: 12px; line-height: 50px; color: white; font-weight: bold; font-size: 20px;">CK</div>
          </div>
          <div style="line-height: 1.6; color: #333;">
            ${composeBody.replace(/\n/g, "<br>")}
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #64748b; font-size: 14px;">
            Best regards,<br>
            <strong>Coding Kiddos Team</strong>
          </p>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            &copy; ${new Date().getFullYear()} Coding Kiddos. All rights reserved.
          </p>
        </div>
      `;

      const res = await fetch("/api/admin/emails/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          htmlBody,
          textBody: composeBody,
          fromAddress: composeFrom,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Email sent successfully!");
        setShowComposeForm(false);
        setComposeTo("");
        setComposeSubject("");
        setComposeBody("");
      } else {
        alert(`Failed to send: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const unreadCount = statusCounts["UNREAD"] || 0;
  const inProgressCount = statusCounts["IN_PROGRESS"] || 0;
  const repliedCount = statusCounts["REPLIED"] || 0;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-8rem)] flex flex-col">
        {/* Breadcrumb Header */}
        <div className="flex-shrink-0 pb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Inbox</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Email Inbox</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage and respond to incoming emails
          </p>
        </div>

      <div className="flex flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Email List Panel */}
        <div className={`${selectedEmail ? "hidden md:flex" : "flex"} flex-col w-full md:w-1/2 lg:w-2/5 border-r border-slate-200 dark:border-slate-700`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Messages</h2>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => setShowComposeForm(true)}>
                  <Edit3 className="w-4 h-4" />
                  Compose
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  title={notificationsEnabled ? "Disable notification sounds" : "Enable notification sounds"}
                >
                  {notificationsEnabled ? (
                    <Bell className="w-4 h-4 text-green-600" />
                  ) : (
                    <BellOff className="w-4 h-4 text-slate-400" />
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={loadEmails}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-600">{unreadCount}</span>
                <span className="text-slate-500">unread</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-yellow-600">{inProgressCount}</span>
                <span className="text-slate-500">pending</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">{repliedCount}</span>
                <span className="text-slate-500">replied</span>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
              >
                <option value="all">All Status</option>
                <option value="UNREAD">Unread</option>
                <option value="READ">Read</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REPLIED">Replied</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="GENERAL">General</option>
                <option value="SUPPORT">Support</option>
                <option value="BILLING">Billing</option>
                <option value="ENROLLMENT">Enrollment</option>
                <option value="FEEDBACK">Feedback</option>
                <option value="PARTNERSHIP">Partnership</option>
              </select>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Mail className="w-12 h-12 mb-4 opacity-50" />
                <p>No emails found</p>
              </div>
            ) : (
              emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => loadEmailDetails(email.id)}
                  className={`p-4 border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    selectedEmail?.id === email.id ? "bg-purple-50 dark:bg-purple-900/20" : ""
                  } ${email.status === "UNREAD" ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${email.status === "UNREAD" ? "bg-blue-500" : "bg-transparent"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium text-sm truncate ${email.status === "UNREAD" ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                          {email.fromName || email.from}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[email.category]}`}>
                          {email.category}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${email.status === "UNREAD" ? "font-semibold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                        {email.subject}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                        {email.snippet || "(No preview)"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${statusColors[email.status]}`}>
                          {email.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(email.receivedAt).toLocaleDateString()}
                        </span>
                        {email.replies && email.replies.length > 0 && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Reply className="w-3 h-3" />
                            {email.replies.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Email Detail Panel */}
        <div className={`${selectedEmail ? "flex" : "hidden md:flex"} flex-col flex-1 bg-white dark:bg-slate-900`}>
          {loadingEmail ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : selectedEmail ? (
            <>
              {/* Email Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4 md:hidden">
                  <Button size="sm" variant="outline" onClick={() => setSelectedEmail(null)}>
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {selectedEmail.subject}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{selectedEmail.fromName || selectedEmail.from}</span>
                      <span>&lt;{selectedEmail.from}&gt;</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>To: {selectedEmail.to}</span>
                      <span>|</span>
                      <span>{new Date(selectedEmail.receivedAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedEmail.category}
                      onChange={(e) => handleUpdateCategory(selectedEmail.id, e.target.value)}
                      className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                    >
                      <option value="GENERAL">General</option>
                      <option value="SUPPORT">Support</option>
                      <option value="BILLING">Billing</option>
                      <option value="ENROLLMENT">Enrollment</option>
                      <option value="FEEDBACK">Feedback</option>
                      <option value="PARTNERSHIP">Partnership</option>
                      <option value="SPAM">Spam</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button size="sm" onClick={() => setShowReplyForm(true)}>
                    <Reply className="w-4 h-4" />
                    Reply
                  </Button>
                  {selectedEmail.status !== "ARCHIVED" && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedEmail.id, "ARCHIVED")}>
                      <Archive className="w-4 h-4" />
                      Archive
                    </Button>
                  )}
                  {selectedEmail.status === "UNREAD" && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedEmail.id, "IN_PROGRESS")}>
                      <Clock className="w-4 h-4" />
                      Mark In Progress
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(selectedEmail.id)}>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>

                {/* Attachments */}
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Paperclip className="w-4 h-4" />
                      {selectedEmail.attachments.length} Attachment(s)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmail.attachments.map((att, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                          {att.filename}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Email Body */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedEmail.htmlBody ? (
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeEmailHtml(selectedEmail.htmlBody) }}
                  />
                ) : selectedEmail.textBody ? (
                  <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300">
                    {selectedEmail.textBody}
                  </pre>
                ) : (
                  <p className="text-slate-500 italic">(No content)</p>
                )}

                {/* Previous Replies */}
                {selectedEmail.replies && selectedEmail.replies.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">
                      Previous Replies ({selectedEmail.replies.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedEmail.replies.map((reply) => (
                        <div key={reply.id} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-2 text-sm">
                            <Reply className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-700 dark:text-green-400">
                              {reply.fromName || reply.fromEmail}
                            </span>
                            <span className="text-slate-500 text-xs">
                              {new Date(reply.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div
                            className="text-sm text-slate-700 dark:text-slate-300"
                            dangerouslySetInnerHTML={{ __html: sanitizeEmailHtml(reply.htmlBody) }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Form Modal */}
              {showReplyForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Reply to {selectedEmail.fromName || selectedEmail.from}
                      </h3>
                      <button onClick={() => setShowReplyForm(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <X className="w-5 h-5 text-slate-500" />
                      </button>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">To</label>
                        <input
                          type="text"
                          value={selectedEmail.from}
                          disabled
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                        <input
                          type="text"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                        <textarea
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          rows={10}
                          placeholder="Type your reply..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowReplyForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendReply} disabled={sending || !replyBody.trim()}>
                        {sending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Reply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <MailOpen className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Select an email to view</p>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Compose Email Modal */}
      {showComposeForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Compose New Email
              </h3>
              <button onClick={() => setShowComposeForm(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From</label>
                <select
                  value={composeFrom}
                  onChange={(e) => setComposeFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {senderAddresses.map((addr) => (
                    <option key={addr.value} value={addr.value}>
                      {addr.displayName} &lt;{addr.value}&gt;
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">To</label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Email subject"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  rows={10}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowComposeForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendCompose} disabled={sending || !composeTo.trim() || !composeSubject.trim() || !composeBody.trim()}>
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
