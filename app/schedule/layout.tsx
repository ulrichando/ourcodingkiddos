import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule - Book Live Coding Classes | Class Calendar",
  description: "View and book live coding classes for kids. 1:1 sessions, group classes, workshops, and coding camps. Interactive schedule with real instructors. Book your spot today!",
  keywords: ["live coding classes", "book coding class", "coding class schedule", "1:1 coding sessions", "group coding classes", "coding workshops", "coding camps for kids"],
  openGraph: {
    title: "Schedule - Book Live Coding Classes",
    description: "View and book live coding classes. 1:1 sessions, group classes, workshops, and camps with expert instructors.",
    url: "https://ourcodingkiddos.com/schedule",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Schedule - Book Live Coding Classes",
    description: "Interactive schedule to book live coding classes with expert instructors.",
  },
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
