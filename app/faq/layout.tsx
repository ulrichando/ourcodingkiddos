import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Coding Kiddos",
  description: "Find answers to common questions about Coding Kiddos coding courses for kids, billing, technical support, and safety. Get help with course enrollment, payment methods, and more.",
  keywords: ["FAQ", "help", "support", "coding courses", "kids programming", "questions", "billing", "technical support"],
  openGraph: {
    title: "FAQ - Frequently Asked Questions | Coding Kiddos",
    description: "Find answers to common questions about our coding courses for kids, billing, and support.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - Coding Kiddos",
    description: "Find answers to common questions about our coding courses for kids.",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
