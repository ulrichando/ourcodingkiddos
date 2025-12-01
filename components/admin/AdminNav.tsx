"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/analytics", label: "Analytics" },
  { href: "/dashboard/admin/announcements", label: "Announcements" },
  { href: "/dashboard/admin/users", label: "Users" },
  { href: "/dashboard/admin/courses", label: "Courses" },
  { href: "/dashboard/admin/content", label: "Content" },
  { href: "/dashboard/admin/sessions", label: "Sessions" },
  { href: "/dashboard/admin/class-requests", label: "Class Requests" },
  { href: "/dashboard/admin/support-tickets", label: "Support Tickets" },
  { href: "/dashboard/admin/finance", label: "Finance" },
  { href: "/dashboard/admin/reports", label: "Reports" },
  { href: "/dashboard/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = mounted ? pathname === link.href : false;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-full text-sm font-semibold border ${
              active
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent"
                : "bg-white text-slate-700 border-slate-200 hover:border-purple-200"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default AdminNav;
