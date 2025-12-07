"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Cookie, Shield, BarChart3, Megaphone, Settings } from "lucide-react";
import Button from "@/components/ui/button";
import { emails } from "@/lib/emails";

export default function CookiePolicyPage() {
  const manageCookies = () => {
    // Clear cookie consent to show the banner again
    localStorage.removeItem("cookie-consent");
    localStorage.removeItem("cookie-consent-date");
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md p-8 space-y-8 leading-relaxed">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Cookie Policy</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: December 2025</p>
          </div>

          {/* Introduction */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">What Are Cookies?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website.
              They help us provide you with a better experience by remembering your preferences, keeping you signed in,
              and understanding how you use our site.
            </p>
          </section>

          {/* Types of Cookies */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Types of Cookies We Use</h2>

            <div className="grid gap-4">
              {/* Necessary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Necessary Cookies</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      These cookies are essential for the website to function properly. They enable core functionality
                      such as security, user authentication, and session management. Without these cookies, services
                      you have asked for cannot be provided.
                    </p>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Examples:</span> Session tokens, login cookies, security tokens
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Analytics Cookies</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      These cookies help us understand how visitors interact with our website by collecting and
                      reporting information anonymously. This helps us improve our website and services.
                    </p>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Examples:</span> Google Analytics, page view tracking, user journey analysis
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Marketing Cookies</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      These cookies are used to track visitors across websites. The intention is to display ads
                      that are relevant and engaging for the individual user.
                    </p>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Examples:</span> Facebook Pixel, Google Ads, remarketing cookies
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Preference Cookies</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      These cookies allow the website to remember choices you make (such as your preferred language
                      or theme) and provide enhanced, more personalized features.
                    </p>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Examples:</span> Theme preferences, language settings, UI customizations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How Long Cookies Last */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How Long Do Cookies Last?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Cookies can be either &quot;session&quot; cookies or &quot;persistent&quot; cookies:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>Session cookies:</strong> These are temporary and are deleted when you close your browser.</li>
              <li><strong>Persistent cookies:</strong> These remain on your device for a set period or until you delete them manually.</li>
            </ul>
          </section>

          {/* Managing Cookies */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Managing Your Cookie Preferences</h2>
            <p className="text-slate-700 dark:text-slate-300">
              You can manage your cookie preferences at any time. You have several options:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>Use our cookie settings panel to customize which cookies you accept</li>
              <li>Configure your browser settings to block or delete cookies</li>
              <li>Use browser extensions that manage cookie consent</li>
            </ul>
            <div className="pt-2">
              <Button onClick={manageCookies}>
                <Settings className="w-4 h-4" />
                Manage Cookie Settings
              </Button>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Third-Party Cookies</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Some cookies are placed by third-party services that appear on our pages. We use trusted partners
              for analytics and functionality. These third parties may use cookies to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>Analyze site traffic and usage patterns</li>
              <li>Provide social media features</li>
              <li>Deliver relevant advertisements</li>
              <li>Enable video playback and interactive content</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Children&apos;s Privacy</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Our Coding Kiddos is designed for children, and we take their privacy seriously. We minimize the
              use of tracking cookies for users identified as students. Marketing cookies are not used for
              student accounts, and analytics data is collected in an anonymized manner.
            </p>
          </section>

          {/* Updates */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Updates to This Policy</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for
              legal, operational, or regulatory reasons. We encourage you to review this page periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Questions?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              If you have any questions about our use of cookies, please contact us at{" "}
              <a
                href={`mailto:${emails.support}`}
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                {emails.support}
              </a>
            </p>
          </section>

          {/* Related Links */}
          <section className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link href="/privacy" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              Terms of Service
            </Link>
          </section>
        </Card>
      </div>
    </main>
  );
}
