import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story - Ulrich Ando, Founder & CEO | Our Coding Kiddos",
  description: "Discover the inspiring journey of Ulrich Ando, a Google software engineer who founded Our Coding Kiddos to make coding education accessible, fun, and effective for every child.",
  keywords: ["Ulrich Ando", "founder", "CEO", "Google engineer", "coding for kids", "Our Coding Kiddos story", "coding education"],
  openGraph: {
    title: "Our Story | Our Coding Kiddos",
    description: "From Google engineer to education pioneer. Learn how Ulrich Ando founded Our Coding Kiddos to empower the next generation of coders.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story | Our Coding Kiddos",
    description: "From Google engineer to education pioneer. The inspiring story of Our Coding Kiddos.",
  },
};

export default function OurStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
