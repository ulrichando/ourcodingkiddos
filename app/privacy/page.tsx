"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, Users, Lock, Eye, Trash2, Mail } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "December 2024";

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
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Privacy Policy</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {lastUpdated}</p>
          </div>

          {/* Introduction */}
          <section className="space-y-3">
            <p className="text-slate-700 dark:text-slate-300">
              Our Coding Kiddos (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the privacy of our users,
              especially children. This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website and use our services.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Information We Collect</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Personal Information</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">We may collect the following personal information:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li><strong>Account Information:</strong> Name, email address, password (encrypted), and profile picture</li>
                  <li><strong>Parent/Guardian Information:</strong> Contact details for account verification and communications</li>
                  <li><strong>Student Information:</strong> First name, age range, and learning progress</li>
                  <li><strong>Payment Information:</strong> Processed securely through Stripe; we do not store credit card numbers</li>
                  <li><strong>Communication Data:</strong> Messages sent through our platform</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Automatically Collected Information</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and general location</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Learning progress and course completion data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How We Use Your Information</h2>
            <p className="text-slate-700 dark:text-slate-300">We use collected information for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>Provide Services:</strong> Deliver coding courses, track progress, and issue certificates</li>
              <li><strong>Account Management:</strong> Create and manage user accounts</li>
              <li><strong>Communication:</strong> Send important updates, respond to inquiries, and provide customer support</li>
              <li><strong>Payment Processing:</strong> Process subscriptions and transactions through Stripe</li>
              <li><strong>Improvement:</strong> Analyze usage patterns to improve our platform and content</li>
              <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
              <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
            </ul>
          </section>

          {/* Children's Privacy - COPPA */}
          <section className="space-y-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Children&apos;s Privacy (COPPA Compliance)</h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Our Coding Kiddos is designed for children, and we take their privacy very seriously.
              We comply with the Children&apos;s Online Privacy Protection Act (COPPA).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>Parental Consent:</strong> We require verifiable parental consent before collecting personal information from children under 13</li>
              <li><strong>Limited Collection:</strong> We only collect information necessary to provide our educational services</li>
              <li><strong>No Behavioral Advertising:</strong> We do not use children&apos;s data for targeted advertising</li>
              <li><strong>Parental Control:</strong> Parents can review, modify, or delete their child&apos;s information at any time</li>
              <li><strong>Secure Environment:</strong> Student accounts have restricted features to ensure a safe learning environment</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Information Sharing and Disclosure</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We do not sell, trade, or rent your personal information. We may share information only in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our platform (e.g., Stripe for payments, email services)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Consent:</strong> When you have given explicit permission</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Data Security</h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Encrypted password storage using industry-standard hashing</li>
              <li>Regular security audits and updates</li>
              <li>Access controls limiting who can view personal data</li>
              <li>Secure data centers with physical security measures</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your Rights</h2>
            <p className="text-slate-700 dark:text-slate-300">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300">
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@ourcodingkiddos.com" className="text-purple-600 dark:text-purple-400 hover:underline">
                privacy@ourcodingkiddos.com
              </a>
            </p>
          </section>

          {/* Data Retention */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Data Retention</h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              We retain personal information for as long as necessary to provide our services and fulfill the purposes
              described in this policy. When you delete your account:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>Personal data is deleted within 30 days</li>
              <li>Some data may be retained for legal or legitimate business purposes</li>
              <li>Anonymized data may be kept for analytics</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Third-Party Services</h2>
            <p className="text-slate-700 dark:text-slate-300">We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>Stripe:</strong> Payment processing (<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Privacy Policy</a>)</li>
              <li><strong>Google Analytics:</strong> Website analytics (anonymized)</li>
              <li><strong>Resend:</strong> Email delivery service</li>
            </ul>
          </section>

          {/* Changes to Policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Changes to This Privacy Policy</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes
              by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to
              review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Contact Us</h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <p>Email: <a href="mailto:privacy@ourcodingkiddos.com" className="text-purple-600 dark:text-purple-400 hover:underline">privacy@ourcodingkiddos.com</a></p>
              <p>Website: <a href="https://ourcodingkiddos.com/contact" className="text-purple-600 dark:text-purple-400 hover:underline">ourcodingkiddos.com/contact</a></p>
            </div>
          </section>

          {/* Related Links */}
          <section className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link href="/terms" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              Cookie Policy
            </Link>
          </section>
        </Card>
      </div>
    </main>
  );
}
