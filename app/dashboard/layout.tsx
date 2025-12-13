import type { Metadata } from "next";

// Force dynamic rendering for all dashboard pages - prevents static prerendering issues
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Dashboard | Coding Kiddos",
  description: "Manage your Coding Kiddos account, courses, and settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrap in a div that takes full height to prevent parent scrolling
  return (
    <div className="h-dvh overflow-hidden">
      {children}
    </div>
  );
}
