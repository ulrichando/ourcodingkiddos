import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Coding Kiddos",
  description: "Learn about Coding Kiddos - empowering the next generation of coders. Discover our mission, values, and commitment to making coding accessible, fun, and safe for every child.",
  keywords: ["about us", "mission", "coding for kids", "online coding school", "programming education", "COPPA compliant"],
  openGraph: {
    title: "About Us | Coding Kiddos",
    description: "Empowering the next generation of coders. Learn about our mission and values.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Coding Kiddos",
    description: "Empowering the next generation of coders. Learn about our mission and values.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
