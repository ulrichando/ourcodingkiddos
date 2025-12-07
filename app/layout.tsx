import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppHeader from "../components/navigation/AppHeader";
import AuthProvider from "../components/providers/AuthProvider";
import ThemeHydrator from "../components/providers/ThemeHydrator";
import ScreenSizeProvider from "../components/providers/ScreenSizeProvider";
import { ErrorBoundary } from "../components/ErrorBoundary";
import StructuredData from "../components/seo/StructuredData";
import LazyComponents from "../components/providers/LazyComponents";
import Footer from "../components/footer/Footer";

// Optimize font loading - prevents layout shift
// Using "optional" prevents font swap flash entirely
const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-inter",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "Our Coding Kiddos - Learn to Code",
    template: "%s | Our Coding Kiddos"
  },
  description: "Empowering young minds with coding skills. Interactive online coding classes for kids in HTML, CSS, JavaScript, Python, and Roblox.",
  keywords: ["coding for kids", "programming classes", "learn to code", "kids coding", "online coding courses", "HTML for kids", "Python for kids", "JavaScript for kids"],
  authors: [{ name: "Our Coding Kiddos" }],
  creator: "Our Coding Kiddos",
  publisher: "Our Coding Kiddos",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" }
    ]
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Our Coding Kiddos"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Our Coding Kiddos",
    title: "Our Coding Kiddos - Learn to Code",
    description: "Empowering young minds with coding skills. Interactive online coding classes for kids.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Coding Kiddos - Learn to Code",
    description: "Empowering young minds with coding skills. Interactive online coding classes for kids.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="google-site-verification" content="yp_rid3CBPWufr6CMjIwP8Cc7pltqQezUnE5EMwry-k" />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem("ok-theme");
                  var theme = stored || "dark";
                  document.documentElement.classList.toggle("dark", theme === "dark");
                  document.documentElement.setAttribute("data-theme", theme);
                  if (!stored) localStorage.setItem("ok-theme", theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <StructuredData />
        <AuthProvider>
          <ThemeHydrator />
          <ScreenSizeProvider>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <AppHeader />
              <main className="flex-1" role="main" id="main-content">{children}</main>
              <Footer />
              <LazyComponents />
            </div>
          </ErrorBoundary>
          </ScreenSizeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
