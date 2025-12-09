import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story - Ulrich Ando, Founder & CEO | Coding Kiddos",
  description: "Discover the inspiring journey of Ulrich Ando, a Google software engineer who founded Coding Kiddos to make coding education accessible, fun, and effective for every child.",
  keywords: ["Ulrich Ando", "founder", "CEO", "Google engineer", "coding for kids", "Coding Kiddos story", "coding education"],
  openGraph: {
    title: "Our Story | Coding Kiddos",
    description: "From Google engineer to education pioneer. Learn how Ulrich Ando founded Coding Kiddos to empower the next generation of coders.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story | Coding Kiddos",
    description: "From Google engineer to education pioneer. The inspiring story of Coding Kiddos.",
  },
};

export default function OurStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
