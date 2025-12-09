"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, Users, Lock, Eye, Trash2, Mail } from "lucide-react";
import { emails } from "@/lib/emails";

export default function PrivacyPage() {
  const lastUpdated = "December 2025";

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
              Coding Kiddos (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the privacy of our users,
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
                  <li><strong>Parent Account Information:</strong> Name, email address, password (encrypted), and profile picture</li>
                  <li><strong>Parent/Guardian Information:</strong> Contact details for account verification and all communications</li>
                  <li><strong>Student Information:</strong> First name, username (no email), age (not birthdate), learning progress, and code projects</li>
                  <li><strong>Payment Information:</strong> Processed securely through Stripe; we do not store credit card numbers</li>
                  <li><strong>Communication Data:</strong> Messages sent through our platform (parents only)</li>
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

          {/* Children's Privacy - COPPA 2025 */}
          <section className="space-y-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Children&apos;s Privacy (COPPA 2025 Compliance)</h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Coding Kiddos is designed for children, and we take their privacy very seriously.
              We comply with the Children&apos;s Online Privacy Protection Act (COPPA), including the 2024 amendments
              (effective June 23, 2025).
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Parental Consent</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>We require <strong>verifiable parental consent</strong> before collecting any personal information from children under 13</li>
                  <li>Parents must be 18 or older and explicitly consent during registration</li>
                  <li>Consent is obtained through our secure parent account registration process</li>
                  <li>Parents receive confirmation of consent via email</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">No Email Collection for Children</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Children log in with a <strong>username only</strong> - we do not collect email addresses from children</li>
                  <li>All communications and notifications are sent to the parent&apos;s email address</li>
                  <li>Usernames are created by parents and contain no personally identifiable information</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Limited Data Collection</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>We only collect: first name, age (not birthdate), learning progress, and code projects</li>
                  <li>Profile photos require separate parental consent and are optional</li>
                  <li>We do <strong>not</strong> collect: biometric data, precise geolocation, or device identifiers for advertising</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">No Targeted Advertising</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>We do <strong>not</strong> use children&apos;s data for behavioral or targeted advertising</li>
                  <li>We do <strong>not</strong> share children&apos;s data with advertising networks</li>
                  <li>We do <strong>not</strong> create advertising profiles for children</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Parental Rights</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li><strong>Review:</strong> Parents can view all data collected about their child at any time</li>
                  <li><strong>Modify:</strong> Parents can update or correct their child&apos;s information</li>
                  <li><strong>Delete:</strong> Parents can request deletion of their child&apos;s account and all associated data</li>
                  <li><strong>Revoke consent:</strong> Parents can withdraw consent at any time</li>
                  <li><strong>Download:</strong> Parents can request a copy of their child&apos;s data in a portable format</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Safe Learning Environment</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Student accounts have restricted features and cannot contact other users directly</li>
                  <li>All content is moderated and age-appropriate</li>
                  <li>We employ content filters and human review for any shared projects</li>
                </ul>
              </div>
            </div>
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
              <a href={`mailto:${emails.support}`} className="text-purple-600 dark:text-purple-400 hover:underline">
                {emails.support}
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
              We retain personal information only for as long as necessary. Here are our specific retention periods:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 pr-4 font-semibold">Data Type</th>
                    <th className="text-left py-2 font-semibold">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2 pr-4">Account information</td>
                    <td className="py-2">Until account deletion + 30 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Child&apos;s learning progress</td>
                    <td className="py-2">Until account deletion + 30 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Code projects</td>
                    <td className="py-2">Until account deletion + 30 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Profile photos</td>
                    <td className="py-2">Until removed or account deletion</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Payment records</td>
                    <td className="py-2">7 years (legal requirement)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Consent records</td>
                    <td className="py-2">3 years after consent withdrawal</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Anonymized analytics</td>
                    <td className="py-2">Indefinitely (non-identifiable)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              When you request account deletion:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>Personal data is deleted within 30 days</li>
              <li>Backup copies are purged within 90 days</li>
              <li>We will confirm deletion via email to the parent</li>
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
              <p>Email: <a href={`mailto:${emails.support}`} className="text-purple-600 dark:text-purple-400 hover:underline">{emails.support}</a></p>
              <p>Website: <Link href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline">ourcodingkiddos.com/contact</Link></p>
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
