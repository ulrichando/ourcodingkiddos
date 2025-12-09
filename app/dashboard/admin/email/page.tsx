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
  ChevronDown,
  AtSign,
} from "lucide-react";

// Email sender options
const fromAddressOptions = [
  { value: "hello", label: "Hello", email: "hello@ourcodingkiddos.com", description: "General communications" },
  { value: "support", label: "Support", email: "support@ourcodingkiddos.com", description: "Customer support" },
  { value: "billing", label: "Billing", email: "billing@ourcodingkiddos.com", description: "Payment & billing" },
  { value: "safety", label: "Safety", email: "safety@ourcodingkiddos.com", description: "Safety concerns" },
  { value: "info", label: "Info", email: "info@ourcodingkiddos.com", description: "General inquiries" },
  { value: "partnerships", label: "Partnerships", email: "partnerships@ourcodingkiddos.com", description: "Business inquiries" },
];

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
  // Onboarding Templates
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to Coding Kiddos! 🎉",
    body: `Dear {{name}},

Welcome to Coding Kiddos! We're thrilled to have you join our community of young coders.

Your account has been created successfully. Here's what you can do next:

• Set up your child's profile
• Browse our curriculum and courses
• Take a free placement exam
• Schedule your first class

We can't wait to see your child start their coding adventure!

Best regards,
The Coding Kiddos Team`,
    category: "onboarding",
  },
  {
    id: "parent-welcome",
    name: "Parent Welcome Guide",
    subject: "Getting Started - A Guide for Parents",
    body: `Dear {{name}},

Thank you for choosing Coding Kiddos for your child's coding education!

Here's a quick guide to help you get the most out of our platform:

📚 COURSES
Your child can access interactive lessons in HTML, CSS, JavaScript, Python, and Roblox programming.

👨‍🏫 LIVE CLASSES
Book 1-on-1 sessions with our certified instructors for personalized learning.

📊 PROGRESS TRACKING
Monitor your child's progress, achievements, and certificates from your parent dashboard.

🛡️ SAFETY FIRST
All our instructors are background-checked, and we maintain strict online safety protocols.

Need help? Reply to this email or contact us at support@ourcodingkiddos.com.

Happy coding!
The Coding Kiddos Team`,
    category: "onboarding",
  },
  // Engagement Templates
  {
    id: "inactive",
    name: "We Miss You",
    subject: "We miss you at Coding Kiddos! 💜",
    body: `Hi {{name}},

We noticed it's been a while since your last visit. We miss having you in our coding community!

Since you've been away, here's what's new:

✨ New courses and projects
🎮 Updated Roblox programming lessons
🏆 New achievement badges to earn
👨‍🏫 More live class slots available

Your progress is saved and waiting for you. Ready to continue your coding journey?

Log in now and pick up where you left off!

Best regards,
The Coding Kiddos Team`,
    category: "engagement",
  },
  {
    id: "course-reminder",
    name: "Course Progress",
    subject: "Keep the momentum going! 🚀",
    body: `Hi {{name}},

You're making great progress! Here's a quick update on your learning journey:

📈 Your current progress: {{progress}}%

You're so close to completing your course and earning your certificate! Just a few more lessons to go.

Tips to stay motivated:
• Set aside 15-30 minutes daily for coding practice
• Try the fun coding challenges in each lesson
• Share your projects with friends and family

Keep up the amazing work!

Best regards,
The Coding Kiddos Team`,
    category: "engagement",
  },
  {
    id: "achievement",
    name: "Achievement Unlocked",
    subject: "Congratulations! You've unlocked a new achievement! 🏆",
    body: `Hi {{name}},

Amazing news! You've just unlocked a new achievement:

🏆 {{achievement_name}}

This is a fantastic milestone in your coding journey. Keep up the great work!

What's next?
• Continue with your current course
• Try a new programming language
• Challenge yourself with advanced projects

We're so proud of your progress!

Best regards,
The Coding Kiddos Team`,
    category: "engagement",
  },
  // Announcement Templates
  {
    id: "announcement",
    name: "General Announcement",
    subject: "Important Update from Coding Kiddos",
    body: `Dear {{name}},

We have an important announcement to share with you:

{{message}}

If you have any questions, please don't hesitate to reach out to us.

Thank you for being part of our community!

Best regards,
The Coding Kiddos Team`,
    category: "announcement",
  },
  {
    id: "new-course",
    name: "New Course Launch",
    subject: "New Course Alert: {{course_name}} is here! 🎓",
    body: `Dear {{name}},

Exciting news! We've just launched a brand new course:

📚 {{course_name}}

What you'll learn:
• {{learning_point_1}}
• {{learning_point_2}}
• {{learning_point_3}}

This course is perfect for {{age_group}} and includes:
✅ Interactive lessons
✅ Hands-on projects
✅ Completion certificate

Enroll today and start learning!

Best regards,
The Coding Kiddos Team`,
    category: "announcement",
  },
  {
    id: "event",
    name: "Upcoming Event",
    subject: "You're Invited: {{event_name}}",
    body: `Dear {{name}},

You're invited to an exciting upcoming event!

📅 Event: {{event_name}}
🗓️ Date: {{event_date}}
⏰ Time: {{event_time}}
📍 Location: Online (link will be sent before the event)

What to expect:
{{event_description}}

This is a great opportunity to learn, connect, and have fun with fellow young coders!

RSVP by replying to this email or through your dashboard.

See you there!
The Coding Kiddos Team`,
    category: "announcement",
  },
  // Administrative Templates
  {
    id: "class-scheduled",
    name: "Class Scheduled",
    subject: "Your 1-on-1 Class is Scheduled! 📅",
    body: `Dear {{name}},

Great news! Your 1-on-1 coding class has been scheduled:

📚 Topic: {{class_topic}}
👨‍🏫 Instructor: {{instructor_name}}
📅 Date: {{class_date}}
⏰ Time: {{class_time}}
⏱️ Duration: {{duration}} minutes

What to prepare:
• A computer with a stable internet connection
• A quiet learning environment
• Any questions about the topic

A Zoom link will be sent 30 minutes before the class.

If you need to reschedule, please contact us at least 24 hours in advance.

See you in class!
The Coding Kiddos Team`,
    category: "scheduling",
  },
  {
    id: "class-reminder-24h",
    name: "Class Reminder (24h)",
    subject: "Reminder: Your Class is Tomorrow! ⏰",
    body: `Hi {{name}},

This is a friendly reminder that you have a class scheduled for tomorrow:

📚 Topic: {{class_topic}}
👨‍🏫 Instructor: {{instructor_name}}
📅 Date: {{class_date}}
⏰ Time: {{class_time}}

Please make sure you:
✅ Have your computer ready
✅ Test your microphone and camera
✅ Find a quiet place to learn

The Zoom link will be sent 30 minutes before the class.

See you tomorrow!
The Coding Kiddos Team`,
    category: "scheduling",
  },
  {
    id: "payment-receipt",
    name: "Payment Receipt",
    subject: "Payment Confirmation - Coding Kiddos",
    body: `Dear {{name}},

Thank you for your payment! Here are the details:

💳 PAYMENT RECEIPT
━━━━━━━━━━━━━━━━━━━━━━
Amount: \${{amount}}
Date: {{payment_date}}
Description: {{description}}
Transaction ID: {{transaction_id}}

Your purchase is now active. If you have any questions about your purchase, please contact our billing team at billing@ourcodingkiddos.com.

Thank you for choosing Coding Kiddos!

Best regards,
The Coding Kiddos Team`,
    category: "billing",
  },
  {
    id: "certificate",
    name: "Certificate Earned",
    subject: "Congratulations! You've Earned Your Certificate! 🎓",
    body: `Dear {{name}},

CONGRATULATIONS! 🎉

You have successfully completed:

📜 {{course_name}}

Your official certificate of completion is now available in your dashboard!

This achievement shows your dedication and hard work in learning to code. We're incredibly proud of you!

What's next?
• Download and share your certificate
• Explore our advanced courses
• Start a new programming language

Keep up the amazing work!

Best regards,
The Coding Kiddos Team`,
    category: "achievement",
  },
  // Feedback Templates
  {
    id: "feedback-request",
    name: "Feedback Request",
    subject: "We'd Love Your Feedback! 💬",
    body: `Dear {{name}},

We hope you're enjoying your experience at Coding Kiddos!

Your feedback is incredibly important to us. It helps us improve and provide the best learning experience for all our students.

Could you take 2 minutes to share your thoughts?

• How would you rate your overall experience?
• What do you like most about our platform?
• What could we do better?

Simply reply to this email with your feedback, or visit our feedback form in your dashboard.

Thank you for helping us improve!

Best regards,
The Coding Kiddos Team`,
    category: "feedback",
  },
  {
    id: "newsletter",
    name: "Monthly Newsletter",
    subject: "Coding Kiddos Newsletter - {{month}} {{year}}",
    body: `Dear {{name}},

Here's what's happening at Coding Kiddos this month:

📰 NEWSLETTER - {{month}} {{year}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆕 NEW THIS MONTH
{{new_content}}

🏆 STUDENT SPOTLIGHT
{{student_spotlight}}

📅 UPCOMING EVENTS
{{upcoming_events}}

💡 CODING TIP OF THE MONTH
{{coding_tip}}

Thank you for being part of our coding community!

Best regards,
The Coding Kiddos Team`,
    category: "newsletter",
  },
];

export default function EmailManagementPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [fromAddress, setFromAddress] = useState<string>("hello");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);
  const [manualEmails, setManualEmails] = useState<string>("");
  const [manualEmailList, setManualEmailList] = useState<string[]>([]);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [detectedPlaceholders, setDetectedPlaceholders] = useState<string[]>([]);

  useEffect(() => {
    fetchRecipients();
    fetchEmailHistory();
  }, []);

  // Extract placeholders from template (excluding name and email which are auto-filled)
  const extractPlaceholders = (text: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = new Set<string>();
    let match;
    while ((match = regex.exec(text)) !== null) {
      const placeholder = match[1];
      // Skip auto-filled placeholders
      if (!['name', 'email'].includes(placeholder)) {
        matches.add(placeholder);
      }
    }
    return Array.from(matches);
  };

  // Format placeholder name for display (snake_case to Title Case)
  const formatPlaceholderLabel = (placeholder: string): string => {
    return placeholder
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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

      // Extract and set placeholders
      const placeholders = extractPlaceholders(template.subject + ' ' + template.body);
      setDetectedPlaceholders(placeholders);

      // Reset template variables
      const initialVars: Record<string, string> = {};
      placeholders.forEach(p => {
        initialVars[p] = '';
      });
      setTemplateVariables(initialVars);
    }
  };

  // Update template variable and apply to body/subject
  const handleVariableChange = (placeholder: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [placeholder]: value
    }));
  };

  // Apply variables to text
  const applyVariables = (text: string): string => {
    let result = text;
    Object.entries(templateVariables).forEach(([key, value]) => {
      if (value) {
        result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
      }
    });
    return result;
  };

  const handleSelectAll = () => {
    if (selectedRecipients.length === filteredRecipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(filteredRecipients.map((r) => r.id));
    }
  };

  const handleAddManualEmail = () => {
    if (!manualEmails.trim()) return;

    // Parse emails (comma, semicolon, or newline separated)
    const emails = manualEmails
      .split(/[,;\n]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (emails.length === 0) {
      alert("Please enter valid email addresses");
      return;
    }

    // Add unique emails
    const newEmails = emails.filter(e => !manualEmailList.includes(e));
    setManualEmailList([...manualEmailList, ...newEmails]);
    setManualEmails("");
  };

  const handleRemoveManualEmail = (email: string) => {
    setManualEmailList(manualEmailList.filter(e => e !== email));
  };

  const handleSend = async () => {
    const hasRecipients = selectedRecipients.length > 0 || manualEmailList.length > 0;
    if (!hasRecipients || !subject || !body) {
      alert("Please add recipients and fill in subject and message");
      return;
    }

    // Apply template variables before sending
    const finalSubject = applyVariables(subject);
    const finalBody = applyVariables(body);

    // Check for unfilled placeholders
    const remainingPlaceholders = finalBody.match(/\{\{(?!name|email)\w+\}\}/g);
    if (remainingPlaceholders && remainingPlaceholders.length > 0) {
      const confirm = window.confirm(
        `Warning: Some template fields are not filled in:\n${remainingPlaceholders.join(', ')}\n\nSend anyway?`
      );
      if (!confirm) return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientIds: selectedRecipients,
          manualEmails: manualEmailList,
          subject: finalSubject,
          body: finalBody,
          fromAddress,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setSentCount(result.sent || selectedRecipients.length + manualEmailList.length);
        setSent(true);
        setSelectedRecipients([]);
        setManualEmailList([]);
        setSubject("");
        setBody("");
        setSelectedTemplate("");
        setTemplateVariables({});
        setDetectedPlaceholders([]);
        setTimeout(() => setSent(false), 5000);
      } else {
        const error = await res.json();
        alert(error.message || error.error || "Failed to send emails");
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
              Emails sent successfully to {sentCount} recipients!
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
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-auto">
                  {defaultTemplates.length} templates available
                </span>
              </h2>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {["all", ...Array.from(new Set(defaultTemplates.map(t => t.category)))].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      const categoryFilter = document.getElementById('template-grid');
                      if (categoryFilter) {
                        categoryFilter.dataset.filter = cat;
                        categoryFilter.querySelectorAll('[data-category]').forEach((el) => {
                          const htmlEl = el as HTMLElement;
                          if (cat === 'all' || htmlEl.dataset.category === cat) {
                            htmlEl.style.display = 'block';
                          } else {
                            htmlEl.style.display = 'none';
                          }
                        });
                      }
                    }}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all capitalize"
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>

              <div id="template-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
                {defaultTemplates.map((template) => (
                  <button
                    key={template.id}
                    data-category={template.category}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedTemplate === template.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-500"
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
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
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
                {/* From Address Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    From Address
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {fromAddressOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFromAddress(option.value)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          fromAddress === option.value
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-500"
                            : "border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <AtSign className={`w-4 h-4 ${
                            fromAddress === option.value
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-slate-400"
                          }`} />
                          <span className={`text-sm font-medium ${
                            fromAddress === option.value
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-slate-900 dark:text-slate-100"
                          }`}>
                            {option.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {option.email}
                        </p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Sending from: <span className="font-medium text-purple-600 dark:text-purple-400">
                      {fromAddressOptions.find(o => o.value === fromAddress)?.email}
                    </span>
                  </p>
                </div>

                {/* Manual Email Entry */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    To (Manual Entry)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualEmails}
                      onChange={(e) => setManualEmails(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddManualEmail();
                        }
                      }}
                      placeholder="Enter email addresses (comma separated)..."
                      className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleAddManualEmail}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Enter emails manually or select from users below. Separate multiple emails with commas.
                  </p>

                  {/* Manual Email Tags */}
                  {manualEmailList.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {manualEmailList.map((email) => (
                        <span
                          key={email}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                        >
                          <Mail className="w-3 h-3" />
                          {email}
                          <button
                            onClick={() => handleRemoveManualEmail(email)}
                            className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => setManualEmailList([])}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={applyVariables(subject)}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Template Variables */}
                {detectedPlaceholders.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Template Fields
                      <span className="text-xs font-normal text-amber-600 dark:text-amber-400 ml-auto">
                        Fill in to customize your email
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {detectedPlaceholders.map((placeholder) => (
                        <div key={placeholder}>
                          <label className="block text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
                            {formatPlaceholderLabel(placeholder)}
                          </label>
                          <input
                            type="text"
                            value={templateVariables[placeholder] || ''}
                            onChange={(e) => handleVariableChange(placeholder, e.target.value)}
                            placeholder={`Enter ${formatPlaceholderLabel(placeholder).toLowerCase()}...`}
                            className="w-full px-3 py-2 text-sm border border-amber-300 dark:border-amber-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
                      These values will replace the {"{{placeholders}}"} in your template. Name and email are filled automatically per recipient.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={applyVariables(body)}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Compose your email message..."
                    rows={10}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Use {"{{name}}"} to personalize with recipient's name (auto-filled per recipient)
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
                    disabled={sending || (selectedRecipients.length === 0 && manualEmailList.length === 0) || !subject || !body}
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
                        Send to {selectedRecipients.length + manualEmailList.length} Recipients
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
                <div className="mb-4 space-y-2">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">From:</p>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {fromAddressOptions.find(o => o.value === fromAddress)?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Subject:</p>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{applyVariables(subject).replace(/\{\{name\}\}/g, "John Doe")}</p>
                  </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-sans">
                    {applyVariables(body).replace(/\{\{name\}\}/g, "John Doe").replace(/\{\{email\}\}/g, "john.doe@example.com")}
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
