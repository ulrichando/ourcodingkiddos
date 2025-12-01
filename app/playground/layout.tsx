import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Playground - Try Coding Online Free | HTML, CSS, JavaScript, Python",
  description: "Free online code playground for kids. Write and run HTML, CSS, JavaScript, and Python code directly in your browser. Perfect for learning and experimenting. No sign-up required!",
  keywords: ["code playground", "online code editor", "HTML playground", "CSS playground", "JavaScript playground", "Python playground", "free coding tool", "learn to code online"],
  openGraph: {
    title: "Code Playground - Try Coding Online Free",
    description: "Free online code playground. Write and run HTML, CSS, JavaScript, and Python code in your browser.",
    url: "https://ourcodingkiddos.com/playground",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Playground - Try Coding Online Free",
    description: "Free online code playground for HTML, CSS, JavaScript, and Python. Start coding now!",
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
