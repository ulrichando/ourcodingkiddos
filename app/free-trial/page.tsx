"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Star, Users, Calendar, Clock, Sparkles, ArrowRight, Play } from "lucide-react";

const AGE_GROUPS = [
  { value: "AGES_7_10", label: "Ages 7-10", description: "Young Coders" },
  { value: "AGES_11_14", label: "Ages 11-14", description: "Junior Developers" },
  { value: "AGES_15_18", label: "Ages 15-18", description: "Advanced Coders" },
];

const LANGUAGES = [
  { value: "SCRATCH", label: "Scratch", icon: "🧩", description: "Visual coding for beginners", ageGroups: ["AGES_7_10"] },
  { value: "PYTHON", label: "Python", icon: "🐍", description: "Most popular first language", ageGroups: ["AGES_7_10", "AGES_11_14", "AGES_15_18"] },
  { value: "JAVASCRIPT", label: "JavaScript", icon: "⚡", description: "Build websites & games", ageGroups: ["AGES_11_14", "AGES_15_18"] },
  { value: "ROBLOX", label: "Roblox Lua", icon: "🎮", description: "Create Roblox games", ageGroups: ["AGES_7_10", "AGES_11_14"] },
  { value: "HTML_CSS", label: "HTML & CSS", icon: "🌐", description: "Design web pages", ageGroups: ["AGES_7_10", "AGES_11_14", "AGES_15_18"] },
];

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

export default function FreeTrialPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    parentName: "",
    parentEmail: "",
    phone: "",
    childName: "",
    childAge: "",
    ageGroup: "",
    language: "",
    preferredDate: "",
    preferredTime: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const filteredLanguages = LANGUAGES.filter(
    (lang) => !formData.ageGroup || lang.ageGroups.includes(formData.ageGroup)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset language if age group changes and current language isn't available
    if (name === "ageGroup") {
      const availableLanguages = LANGUAGES.filter((l) => l.ageGroups.includes(value));
      if (!availableLanguages.find((l) => l.value === formData.language)) {
        setFormData((prev) => ({ ...prev, [name]: value, language: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentEmail: formData.parentEmail,
          parentName: formData.parentName,
          childName: formData.childName,
          childAge: formData.childAge ? parseInt(formData.childAge) : undefined,
          ageGroup: formData.ageGroup || undefined,
          phone: formData.phone || undefined,
          language: formData.language || undefined,
          preferredDate: formData.preferredDate || undefined,
          preferredTime: formData.preferredTime || undefined,
          timezone: formData.timezone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to book free trial");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const canProceedStep1 = formData.childName && formData.ageGroup;
  const canProceedStep2 = formData.language;
  const canSubmit = formData.parentEmail && formData.childName;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/20 p-10 border border-purple-100 dark:border-slate-700">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              You're All Set! 🎉
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              We've received {formData.childName}'s free trial request! Our team will contact you within 24 hours to confirm the session.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-8 text-left border border-purple-100 dark:border-purple-800/30">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-purple-800 dark:text-purple-200">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 dark:text-purple-400 mt-1">1.</span>
                  We'll email you at <strong>{formData.parentEmail}</strong> to confirm the trial date
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 dark:text-purple-400 mt-1">2.</span>
                  You'll receive a Zoom/Google Meet link for the live class
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 dark:text-purple-400 mt-1">3.</span>
                  {formData.childName} will join a 1-hour live coding session with our expert instructor
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 dark:text-purple-400 mt-1">4.</span>
                  After the trial, you can enroll in the full program with an exclusive discount!
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Browse Programs
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-white rounded-full" />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                100% Free • No Credit Card Required
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Give Your Child a <span className="text-yellow-300">Free</span> Coding Class
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                Let them experience the magic of coding with a live, interactive session taught by our expert instructors. No commitment required!
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-300" />
                  <span>1-Hour Live Session</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-300" />
                  <span>Small Group Class</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span>Expert Instructors</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=500&fit=crop"
                  alt="Diverse children learning to code together"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-green-600 dark:text-green-400 ml-0.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Live Class</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Interactive learning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s
                    ? "bg-purple-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                }`}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-20 h-1 mx-2 rounded transition-all ${
                    step > s ? "bg-purple-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/20 border border-purple-100 dark:border-slate-700 overflow-hidden">
          {/* Step 1: Child Info */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tell us about your child</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">We'll personalize the trial class based on their age and interests</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Child's Name *
                  </label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleInputChange}
                    placeholder="Enter your child's name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Child's Age
                  </label>
                  <input
                    type="number"
                    name="childAge"
                    value={formData.childAge}
                    onChange={handleInputChange}
                    placeholder="e.g., 10"
                    min="5"
                    max="18"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Age Group *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {AGE_GROUPS.map((group) => (
                      <label
                        key={group.value}
                        className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.ageGroup === group.value
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="ageGroup"
                          value={group.value}
                          checked={formData.ageGroup === group.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="font-semibold text-slate-900 dark:text-white">{group.label}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{group.description}</span>
                        {formData.ageGroup === group.value && (
                          <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-purple-600 dark:text-purple-400" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedStep1}
                  className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next: Choose a Language
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Language Selection */}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Choose a programming language</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">Select the language your child will learn in the trial class</p>

              <div className="grid gap-4">
                {filteredLanguages.map((lang) => (
                  <label
                    key={lang.value}
                    className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.language === lang.value
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="language"
                      value={lang.value}
                      checked={formData.language === lang.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-3xl">{lang.icon}</span>
                    <div className="flex-1">
                      <span className="font-semibold text-slate-900 dark:text-white block">{lang.label}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{lang.description}</span>
                    </div>
                    {formData.language === lang.value && (
                      <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    )}
                  </label>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-slate-600 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedStep2}
                  className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next: Your Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Parent Info & Schedule */}
          {step === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Complete your booking</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">Enter your details so we can confirm the trial session</p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Preferred Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Preferred Time (Optional)
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a time</option>
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800/30">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">Trial Class Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Student:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{formData.childName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Age Group:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {AGE_GROUPS.find((g) => g.value === formData.ageGroup)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Language:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {LANGUAGES.find((l) => l.value === formData.language)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-purple-200 dark:border-purple-700/50">
                      <span className="text-slate-600 dark:text-slate-400">Price:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">FREE</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm border border-red-200 dark:border-red-800/30">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-slate-600 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      Book Free Trial
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Trust Elements */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Trusted by parents worldwide</p>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 font-semibold text-slate-700 dark:text-slate-300">4.9/5</span>
            </div>
            <div className="text-slate-400 dark:text-slate-600">|</div>
            <div className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">5,000+</span> Students Enrolled
            </div>
            <div className="text-slate-400 dark:text-slate-600">|</div>
            <div className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">98%</span> Parent Satisfaction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
