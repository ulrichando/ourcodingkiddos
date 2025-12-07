"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  BookPlus,
  Megaphone,
  Calendar,
  Mail,
  FileText,
  Rocket,
  HelpCircle,
  Plus,
  X,
  Zap,
} from "lucide-react";

type QuickAction = {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  color: string;
};

type QuickActionsWidgetProps = {
  onCreateUser?: () => void;
  onCreateAnnouncement?: () => void;
  onSendEmail?: () => void;
};

export default function QuickActionsWidget({
  onCreateUser,
  onCreateAnnouncement,
  onSendEmail,
}: QuickActionsWidgetProps) {
  const [showAllActions, setShowAllActions] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: "create-user",
      label: "Add User",
      description: "Create a new user account",
      icon: UserPlus,
      href: "/dashboard/admin/users?action=create",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "create-course",
      label: "Add Course",
      description: "Create a new course",
      icon: BookPlus,
      href: "/dashboard/admin/courses?action=create",
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "announcement",
      label: "Announcement",
      description: "Send platform announcement",
      icon: Megaphone,
      href: "/dashboard/admin/announcements?action=create",
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "schedule-session",
      label: "New Session",
      description: "Schedule a class session",
      icon: Calendar,
      href: "/dashboard/admin/sessions?action=create",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "send-email",
      label: "Send Email",
      description: "Send bulk email to users",
      icon: Mail,
      href: "/dashboard/admin/email",
      color: "from-rose-500 to-pink-500",
    },
    {
      id: "create-program",
      label: "Add Program",
      description: "Create a learning program",
      icon: Rocket,
      href: "/dashboard/admin/programs?action=create",
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "create-blog",
      label: "New Blog Post",
      description: "Write a blog article",
      icon: FileText,
      href: "/dashboard/admin/blog?action=create",
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "support-ticket",
      label: "View Tickets",
      description: "Check support tickets",
      icon: HelpCircle,
      href: "/dashboard/admin/support-tickets",
      color: "from-slate-500 to-slate-600",
    },
  ];

  const displayedActions = showAllActions ? quickActions : quickActions.slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          Quick Actions
        </h2>
        <button
          onClick={() => setShowAllActions(!showAllActions)}
          className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1"
        >
          {showAllActions ? (
            <>
              <X className="w-3 h-3 sm:w-4 sm:h-4" /> Less
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> More
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {displayedActions.map((action) => {
          const Icon = action.icon;
          const content = (
            <div className="group flex flex-col items-center p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-lg`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 text-center truncate w-full">
                {action.label}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-center mt-0.5 sm:mt-1 hidden sm:block line-clamp-1">
                {action.description}
              </span>
            </div>
          );

          if (action.href) {
            return (
              <Link key={action.id} href={action.href}>
                {content}
              </Link>
            );
          }

          return (
            <div key={action.id} onClick={action.action}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
