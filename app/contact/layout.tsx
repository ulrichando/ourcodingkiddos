import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get Help with Coding Classes | Support",
  description: "Get in touch with Our Coding Kiddos support team. Questions about enrollments, classes, billing, or technical support? We reply within 24 hours. Safe and private.",
  keywords: ["contact coding school", "coding support", "enrollment help", "coding class questions", "customer support"],
  openGraph: {
    title: "Contact Us - Get Help with Coding Classes",
    description: "Get in touch with our support team. Questions about enrollments, classes, or billing? We reply within 24 hours.",
    url: "https://ourcodingkiddos.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Get Help with Coding Classes",
    description: "Get in touch with our support team. We reply within 24 hours.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
