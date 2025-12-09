import {
  AlertCircle,
  RefreshCw,
  MessageCircle,
  Shield,
  FileText,
  Clock,
  Users,
  CheckCircle,
} from "lucide-react";

export const metadata = {
  title: "Policies | Coding Kiddos",
  description: "Class policies including attendance, missed classes, and catch-up sessions at Coding Kiddos.",
};

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            Our Policies
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Class Policies & Guidelines
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about our class policies, attendance requirements, and how we handle missed classes.
          </p>
        </div>

        {/* Missed & Catch-Up Class Policy */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-8 mb-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Class Policy
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Missed Classes & Catch-Up Sessions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We understand that life happens! Here&apos;s our policy to ensure every student gets the most out of their learning journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Missed Class Policy */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-3">
                Missed Class Policy
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Please notify us at least <strong>24 hours</strong> in advance if you cannot attend</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Missed classes without notice are <strong>not refundable</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Class recordings may be available for review upon request</span>
                </li>
              </ul>
            </div>

            {/* Catch-Up Sessions */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-3">
                Catch-Up Sessions
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Students can join an <strong>alternate session</strong> of the same program within the same week</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Subject to availability and instructor approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>Request catch-up sessions through your parent portal</span>
                </li>
              </ul>
            </div>

            {/* How to Request */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-3">
                How to Request
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Email us at <strong>support@ourcodingkiddos.com</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Include the missed class date and preferred catch-up time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>We&apos;ll confirm availability within <strong>24 hours</strong></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
              <strong>Note:</strong> Each student is allowed up to <strong>2 catch-up sessions per month</strong>.
              For extended absences, please contact us to discuss alternative arrangements.
            </p>
          </div>
        </div>

        {/* Additional Policies */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Attendance Policy */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Attendance Policy
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Students should join classes on time (within 5 minutes of start)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Camera should be on during class for engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Parents will be notified if students miss more than 2 consecutive classes</span>
              </li>
            </ul>
          </div>

          {/* Class Duration */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Class Duration & Timing
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Group classes are typically 60-120 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>1-on-1 sessions are 30-60 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Short breaks are included in longer sessions</span>
              </li>
            </ul>
          </div>

          {/* Code of Conduct */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Code of Conduct
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Be respectful to instructors and fellow students</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Keep chat messages appropriate and on-topic</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>No sharing of personal information in public chats</span>
              </li>
            </ul>
          </div>

          {/* Refund Policy */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Refund Policy
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Full refund if cancelled 7+ days before class start</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>50% refund if cancelled 3-7 days before class start</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>No refund for cancellations less than 3 days before class</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-100 dark:border-purple-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">
            Have Questions About Our Policies?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            We&apos;re here to help! Contact us anytime for clarification.
          </p>
          <a
            href="mailto:support@ourcodingkiddos.com"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}
