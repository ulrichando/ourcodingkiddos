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
  metadataBase: new URL("https://ourcodingkiddos.com"),
  title: {
    default: "Our Coding Kiddos - Online Coding Classes for Kids Ages 7-18",
    template: "%s | Our Coding Kiddos"
  },
  description: "Top-rated online coding classes for kids ages 7-18. Learn JavaScript, Python, HTML, CSS, and game development with live instructors. Fun, interactive programming courses designed for young beginners. Enroll today!",
  keywords: [
    "coding classes for kids",
    "kids coding courses online",
    "learn programming for children",
    "online coding school for kids",
    "JavaScript for kids",
    "Python for kids",
    "HTML CSS for beginners",
    "game development for kids",
    "Roblox programming",
    "coding bootcamp for children",
    "virtual coding lessons",
    "best coding classes for kids",
    "programming for ages 7-18",
    "kids learn to code",
    "interactive coding courses"
  ],
  authors: [{ name: "Our Coding Kiddos", url: "https://ourcodingkiddos.com" }],
  creator: "Our Coding Kiddos",
  publisher: "Our Coding Kiddos",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ourcodingkiddos.com",
  },
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
    url: "https://ourcodingkiddos.com",
    siteName: "Our Coding Kiddos",
    title: "Our Coding Kiddos - Online Coding Classes for Kids Ages 7-18",
    description: "Top-rated online coding classes for kids. Learn JavaScript, Python, HTML & game development with live instructors. Fun, interactive lessons for ages 7-18!",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Our Coding Kiddos - Online Coding Classes for Kids",
      }
    ],
  },
  verification: {
    google: "yp_rid3CBPWufr6CMjIwP8Cc7pltqQezUnE5EMwry-k",
  },
  category: "education",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
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
