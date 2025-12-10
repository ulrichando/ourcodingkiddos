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
import VisitorTracker from "../components/analytics/VisitorTracker";

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
    default: "Coding Kiddos - Online Coding Classes for Kids Ages 7-18",
    template: "%s | Coding Kiddos"
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
  authors: [{ name: "Coding Kiddos", url: "https://ourcodingkiddos.com" }],
  creator: "Coding Kiddos",
  publisher: "Coding Kiddos",
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
    title: "Coding Kiddos"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ourcodingkiddos.com",
    siteName: "Coding Kiddos",
    title: "Coding Kiddos - Online Coding Classes for Kids Ages 7-18",
    description: "Top-rated online coding classes for kids. Learn JavaScript, Python, HTML & game development with live instructors. Fun, interactive lessons for ages 7-18!",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Coding Kiddos - Online Coding Classes for Kids",
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
    <html lang="en" className={inter.variable} suppressHydrationWarning data-scroll-behavior="smooth">
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
        {/* Server-rendered legal footer for Google OAuth verification */}
        {/* This is rendered on the server and visible to crawlers regardless of JS execution */}
        <footer
          id="server-legal-footer"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#020617',
            borderTop: '1px solid #1e293b',
            padding: '6px 16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            fontSize: '11px',
            zIndex: 50
          }}
        >
          <span style={{ color: '#64748b' }}>© 2025 Coding Kiddos</span>
          <a
            href="/privacy"
            style={{
              color: '#a78bfa',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            style={{
              color: '#a78bfa',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Terms
          </a>
          <a
            href="/safety"
            style={{
              color: '#a78bfa',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Safety
          </a>
        </footer>
        {/* Hide server footer after client hydration - users see the nicer React footer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    var el = document.getElementById('server-legal-footer');
                    if (el) el.style.display = 'none';
                  }, 100);
                });
              }
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
              <VisitorTracker />
            </div>
          </ErrorBoundary>
          </ScreenSizeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
