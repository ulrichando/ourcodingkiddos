import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placement Exam - Find Your Coding Level | Coding Kiddos",
  description: "Take our free placement exam to discover your child's coding level. Choose between a fun gamified challenge or multiple-choice test. Get personalized course recommendations and earn a skill certificate.",
  keywords: ["placement exam", "coding test", "skill assessment", "coding level", "kids programming test", "beginner", "intermediate", "advanced"],
  openGraph: {
    title: "Placement Exam | Coding Kiddos",
    description: "Discover your child's coding level with our free placement exam. Get personalized course recommendations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Placement Exam | Coding Kiddos",
    description: "Discover your child's coding level with our free placement exam.",
  },
};

export default function PlacementExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
