"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import {
  Mail,
  Send,
  Users,
  GraduationCap,
  UserCircle,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles,
  X,
  Plus,
  Eye,
} from "lucide-react";

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
};

type Recipient = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const defaultTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to Our Coding Kiddos!",
    body: `Dear {{name}},

Welcome to Our Coding Kiddos! We're thrilled to have you join our community of young coders.

Your account has been created successfully. You can now log in and start exploring our courses.

Best regards,
The Our Coding Kiddos Team`,
    category: "onboarding",
  },
  {
    id: "inactive",
    name: "Re-engagement",
    subject: "We miss you at Our Coding Kiddos!",
    body: `Hi {{name}},

We noticed you haven't logged in recently. We miss you!

There are new courses and exciting projects waiting for you. Come back and continue your coding journey!

Best regards,
The Our Coding Kiddos Team`,
    category: "engagement",
  },
  {
    id: "announcement",
    name: "General Announcement",
    subject: "Important Update from Our Coding Kiddos",
    body: `Dear {{name}},

We have an important announcement to share with you.

{{message}}

Thank you for being part of our community!

Best regards,
The Our Coding Kiddos Team`,
    category: "announcement",
  },
  {
    id: "course-reminder",
    name: "Course Reminder",
    subject: "Don't forget to complete your course!",
    body: `Hi {{name}},

You're doing great! You're {{progress}}% through your current course.

Keep up the momentum and finish strong!

Best regards,
The Our Coding Kiddos Team`,
    category: "engagement",
  },
];

export default function EmailManagementPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchRecipients();
    fetchEmailHistory();
  }, []);

  const fetchRecipients = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setRecipients(
          data.users?.map((u: any) => ({
            id: u.id,
            name: u.name || "Unknown",
            email: u.email,
            role: u.role,
          })) || []
        );
      }
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailHistory = async () => {
    // This would fetch from an email log table if implemented
    setEmailHistory([
      {
        id: "1",
        subject: "Welcome to Spring Session 2025!",
        recipients: 45,
        sentAt: new Date().toISOString(),
        status: "sent",
      },
      {
        id: "2",
        subject: "New Course Available: Advanced Python",
        recipients: 120,
        sentAt: new Date(Date.now() - 86400000).toISOString(),
        status: "sent",
      },
    ]);
  };

  const filteredRecipients = recipients.filter((r) => {
    if (audienceFilter === "all") return true;
    return r.role.toUpperCase() === audienceFilter.toUpperCase();
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = defaultTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const handleSelectAll = () => {
    if (selectedRecipients.length === filteredRecipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(filteredRecipients.map((r) => r.id));
    }
  };

  const handleSend = async () => {
    if (selectedRecipients.length === 0 || !subject || !body) {
      alert("Please select recipients and fill in subject and message");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientIds: selectedRecipients,
          subject,
          body,
        }),
      });

      if (res.ok) {
        setSent(true);
        setSelectedRecipients([]);
        setSubject("");
        setBody("");
        setSelectedTemplate("");
        setTimeout(() => setSent(false), 5000);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to send emails");
      }
    } catch (error) {
      console.error("Failed to send emails:", error);
      alert("Failed to send emails");
    } finally {
      setSending(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toUpperCase()) {
      case "STUDENT":
        return <GraduationCap className="w-4 h-4" />;
      case "PARENT":
        return <UserCircle className="w-4 h-4" />;
      case "INSTRUCTOR":
        return <Award className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const audienceOptions = [
    { value: "all", label: "All Users", icon: Users, count: recipients.length },
    {
      value: "STUDENT",
      label: "Students",
      icon: GraduationCap,
      count: recipients.filter((r) => r.role.toUpperCase() === "STUDENT").length,
    },
    {
      value: "PARENT",
      label: "Parents",
      icon: UserCircle,
      count: recipients.filter((r) => r.role.toUpperCase() === "PARENT").length,
    },
    {
      value: "INSTRUCTOR",
      label: "Instructors",
      icon: Award,
      count: recipients.filter((r) => r.role.toUpperCase() === "INSTRUCTOR").length,
    },
  ];

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Communication</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Email Management</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Send bulk emails to users, parents, and instructors
          </p>
        </div>

        {/* Success Banner */}
        {sent && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-emerald-700 dark:text-emerald-300">
              Emails sent successfully to {selectedRecipients.length} recipients!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Compose */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Email Templates
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {defaultTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedTemplate === template.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700"
                    }`}
                  >
                    <FileText
                      className={`w-5 h-5 mb-2 ${
                        selectedTemplate === template.id
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-slate-400"
                      }`}
                    />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {template.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {template.category}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Compose Email */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Compose Email
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Compose your email message..."
                    rows={10}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Use {"{{name}}"} to personalize with recipient's name
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setShowPreview(true)}
                    disabled={!body}
                    className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={sending || selectedRecipients.length === 0 || !subject || !body}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send to {selectedRecipients.length} Recipients
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recipients */}
          <div className="space-y-6">
            {/* Audience Filter */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                Select Audience
              </h2>
              <div className="space-y-2">
                {audienceOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setAudienceFilter(option.value);
                        setSelectedRecipients([]);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                        audienceFilter === option.value
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-5 h-5 ${
                            audienceFilter === option.value
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-slate-400"
                          }`}
                        />
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {option.label}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {option.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipients List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Recipients ({selectedRecipients.length}/{filteredRecipients.length})
                </h3>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  {selectedRecipients.length === filteredRecipients.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              {loading ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">Loading...</p>
              ) : (
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {filteredRecipients.map((recipient) => (
                    <label
                      key={recipient.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(recipient.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecipients([...selectedRecipients, recipient.id]);
                          } else {
                            setSelectedRecipients(
                              selectedRecipients.filter((id) => id !== recipient.id)
                            );
                          }
                        }}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {recipient.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {recipient.email}
                        </p>
                      </div>
                      <span className="text-slate-400">{getRoleIcon(recipient.role)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Email History */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                Recent Emails
              </h3>
              <div className="space-y-3">
                {emailHistory.map((email) => (
                  <div
                    key={email.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {email.subject}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {email.recipients} recipients
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(email.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Email Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Subject:</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{subject}</p>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-sans">
                    {body.replace(/\{\{name\}\}/g, "John Doe")}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
