"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Users, CreditCard, BookOpen, Shield, AlertTriangle, Scale, Mail } from "lucide-react";
import { emails } from "@/lib/emails";

export default function TermsPage() {
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
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Terms of Service</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {lastUpdated}</p>
          </div>

          {/* Introduction */}
          <section className="space-y-3">
            <p className="text-slate-700 dark:text-slate-300">
              Welcome to Our Coding Kiddos! These Terms of Service (&quot;Terms&quot;) govern your access to and use of
              the Our Coding Kiddos website, platform, and services (collectively, the &quot;Service&quot;). By accessing
              or using our Service, you agree to be bound by these Terms.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Please read these Terms carefully before using our Service. If you do not agree to these Terms,
              you may not access or use the Service.
            </p>
          </section>

          {/* Definitions */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">1. Definitions</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li><strong>&quot;We,&quot; &quot;us,&quot; or &quot;our&quot;</strong> refers to Our Coding Kiddos.</li>
              <li><strong>&quot;You&quot; or &quot;user&quot;</strong> refers to the individual accessing or using the Service.</li>
              <li><strong>&quot;Parent&quot;</strong> refers to the parent or legal guardian of a Student.</li>
              <li><strong>&quot;Student&quot;</strong> refers to a child using our educational services.</li>
              <li><strong>&quot;Account&quot;</strong> refers to your registered account on our platform.</li>
              <li><strong>&quot;Content&quot;</strong> refers to all materials, courses, videos, and resources on the platform.</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">2. Account Registration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">2.1 Eligibility</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Parent/Guardian accounts must be created by individuals 18 years or older</li>
                  <li>Student accounts are for children and must be created by a Parent or Guardian</li>
                  <li>Instructor accounts require verification and approval by Our Coding Kiddos</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">2.2 Account Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must provide accurate and complete information during registration</li>
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>You must notify us immediately of any unauthorized access or security breach</li>
                  <li>Parents are responsible for supervising their children&apos;s use of the Service</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">2.3 Parental Consent</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  For users under 13 years of age, a parent or legal guardian must create the account and provide
                  verifiable consent for the child&apos;s use of the Service. By creating a Student account, you represent
                  that you are the parent or legal guardian of that child.
                </p>
              </div>
            </div>
          </section>

          {/* Subscriptions and Payments */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">3. Subscriptions and Payments</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">3.1 Subscription Plans</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>We offer various subscription plans with different features and pricing</li>
                  <li>Some content may be available for free; premium content requires a paid subscription</li>
                  <li>Plan details, pricing, and features are available on our pricing page</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">3.2 Billing and Renewal</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Subscriptions are billed in advance on a recurring basis (monthly or annually)</li>
                  <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
                  <li>You can cancel your subscription at any time through your account settings</li>
                  <li>Cancellation takes effect at the end of the current billing period</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">3.3 Payment Processing</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Payments are processed securely through Stripe</li>
                  <li>We do not store your credit card information</li>
                  <li>You authorize us to charge your payment method for all fees due</li>
                  <li>Failed payments may result in suspension of your account</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">3.4 Refunds</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Refunds may be available within 14 days of purchase if you are unsatisfied with the Service.
                  Refund requests should be submitted to{" "}
                  <a href={`mailto:${emails.support}`} className="text-purple-600 dark:text-purple-400 hover:underline">
                    {emails.support}
                  </a>. Refunds are granted at our discretion and may be prorated based on usage.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Service */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">4. Use of Service</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">4.1 License Grant</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license
                  to access and use the Service for personal, non-commercial educational purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">4.2 Acceptable Use</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Use the Service in any way that violates applicable laws or regulations</li>
                  <li>Share your account credentials with others or allow others to access your account</li>
                  <li>Copy, distribute, or disclose any part of the Service without permission</li>
                  <li>Attempt to interfere with or compromise the system integrity or security</li>
                  <li>Use automated systems (bots, scrapers) to access the Service</li>
                  <li>Transmit viruses, malware, or other harmful computer code</li>
                  <li>Harass, bully, or intimidate other users</li>
                  <li>Post or share inappropriate, offensive, or harmful content</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">5. Intellectual Property</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">5.1 Our Content</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  All content on the Service, including courses, videos, text, graphics, logos, images, and software,
                  is owned by Our Coding Kiddos or our licensors and is protected by copyright, trademark, and other
                  intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">5.2 Restrictions</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>You may not reproduce, distribute, or create derivative works from our Content</li>
                  <li>You may not use our trademarks or branding without written permission</li>
                  <li>Screen recording, downloading, or redistributing course materials is prohibited</li>
                  <li>Using our Content for commercial purposes requires explicit authorization</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">5.3 User Content</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Any content you submit (code projects, comments, etc.) remains your property. By submitting content,
                  you grant us a non-exclusive, royalty-free license to use, display, and distribute such content
                  in connection with the Service.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">6. Disclaimers and Limitations</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">6.1 Service Availability</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  We strive to provide uninterrupted access to the Service, but we do not guarantee that the Service
                  will be available at all times. We may modify, suspend, or discontinue any part of the Service
                  without prior notice.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">6.2 Disclaimer of Warranties</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                  PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL MEET YOUR
                  REQUIREMENTS OR THAT IT WILL BE ERROR-FREE.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">6.3 Limitation of Liability</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR CODING KIDDOS SHALL NOT BE LIABLE FOR ANY INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR
                  GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT
                  EXCEED THE AMOUNT PAID BY YOU IN THE TWELVE MONTHS PRECEDING THE CLAIM.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">6.4 Educational Content</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Our courses are designed for educational purposes. While we strive for accuracy, we do not guarantee
                  that all content is complete, current, or error-free. Programming languages and technologies evolve,
                  and some information may become outdated.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">7. Termination</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">7.1 Termination by You</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  You may terminate your account at any time by contacting us or through your account settings.
                  Upon termination, you will lose access to the Service and any content associated with your account.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">7.2 Termination by Us</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  We may suspend or terminate your account at any time for any reason, including but not limited to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 mt-2">
                  <li>Violation of these Terms</li>
                  <li>Non-payment of subscription fees</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Conduct that may harm other users or the Service</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">7.3 Effect of Termination</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Upon termination, your right to use the Service will immediately cease. Sections regarding
                  intellectual property, disclaimers, limitations of liability, and governing law will survive
                  termination.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">8. Privacy</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Your privacy is important to us. Our collection and use of personal information is governed by our{" "}
              <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. Please review our Privacy Policy to understand
              our practices, especially regarding children&apos;s privacy and COPPA compliance.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">9. Changes to Terms</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by
              posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued
              use of the Service after changes are posted constitutes your acceptance of the modified Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">10. Governing Law</h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              These Terms shall be governed by and construed in accordance with the laws of the United States,
              without regard to its conflict of law provisions. Any disputes arising from these Terms or your
              use of the Service shall be resolved through binding arbitration, except where prohibited by law.
            </p>
          </section>

          {/* Severability */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">11. Severability</h2>
            <p className="text-slate-700 dark:text-slate-300">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be
              limited or eliminated to the minimum extent necessary, and the remaining provisions will remain
              in full force and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">12. Entire Agreement</h2>
            <p className="text-slate-700 dark:text-slate-300">
              These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement
              between you and Our Coding Kiddos regarding your use of the Service and supersede all prior
              agreements and understandings.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">13. Contact Us</h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <p>Email: <a href={`mailto:${emails.support}`} className="text-purple-600 dark:text-purple-400 hover:underline">{emails.support}</a></p>
              <p>Website: <a href="https://ourcodingkiddos.com/contact" className="text-purple-600 dark:text-purple-400 hover:underline">ourcodingkiddos.com/contact</a></p>
            </div>
          </section>

          {/* Related Links */}
          <section className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link href="/privacy" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              Privacy Policy
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
