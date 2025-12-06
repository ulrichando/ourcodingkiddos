"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  HelpCircle,
  BookOpen,
  CreditCard,
  Users,
  Shield,
  Laptop,
  GraduationCap,
  MessageCircle,
  Sparkles
} from "lucide-react";
import Input from "@/components/ui/input";

const categories = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "getting-started", label: "Getting Started", icon: Sparkles },
  { id: "courses", label: "Courses & Learning", icon: BookOpen },
  { id: "billing", label: "Enrollment & Payments", icon: CreditCard },
  { id: "account", label: "Account & Parents", icon: Users },
  { id: "technical", label: "Technical Support", icon: Laptop },
  { id: "safety", label: "Safety & Privacy", icon: Shield },
];

const faqs = [
  // Getting Started
  {
    category: "getting-started",
    question: "What is Our Coding Kiddos?",
    answer: "Our Coding Kiddos is an online learning platform designed specifically for children ages 6-16 to learn coding. We offer interactive courses in HTML, CSS, JavaScript, Python, and Roblox Studio, with both self-paced lessons and live classes taught by certified instructors."
  },
  {
    category: "getting-started",
    question: "What age groups do you teach?",
    answer: "Our courses are designed for children ages 6-16. We have age-appropriate content for different groups: 6-8 (Beginner), 9-12 (Intermediate), and 13-16 (Advanced). Each course clearly indicates the recommended age range."
  },
  {
    category: "getting-started",
    question: "Does my child need prior coding experience?",
    answer: "No prior experience is needed! We have courses for complete beginners that start from the very basics. Our curriculum is designed to take students from zero knowledge to creating their own projects."
  },
  {
    category: "getting-started",
    question: "How do I create an account?",
    answer: "Click 'Get Started' or 'Sign Up' on our website. Parents create a parent account first, then can add student profiles for their children. This allows parents to monitor progress and manage subscriptions while giving kids a safe, supervised learning environment."
  },
  {
    category: "getting-started",
    question: "Is there a free trial?",
    answer: "Yes! We offer free introductory courses so you can try our platform before committing. These include sample lessons from our most popular courses. No credit card is required to access free content."
  },

  // Courses & Learning
  {
    category: "courses",
    question: "What programming languages do you teach?",
    answer: "We teach HTML & CSS (web design), JavaScript (interactive websites), Python (general programming & games), and Roblox Studio (game development with Lua). Each language has multiple courses for different skill levels."
  },
  {
    category: "courses",
    question: "How do live classes work?",
    answer: "Live classes are conducted via video call with our certified instructors in small groups (max 8 students). Students can interact, ask questions, and get real-time feedback on their code. Classes are scheduled at various times to accommodate different time zones."
  },
  {
    category: "courses",
    question: "What's the difference between self-paced and live classes?",
    answer: "Self-paced courses let students learn at their own speed with video lessons, interactive exercises, and projects. Live classes provide real-time instruction with an instructor, ideal for students who benefit from direct interaction and immediate feedback."
  },
  {
    category: "courses",
    question: "How long does it take to complete a course?",
    answer: "Course length varies from 4-12 weeks depending on the content. Self-paced courses can be completed faster or slower based on the student's schedule. Most students spend 2-4 hours per week on their coursework."
  },
  {
    category: "courses",
    question: "Do students receive certificates?",
    answer: "Yes! Students receive a digital certificate upon completing each course. Certificates can be shared on social media, added to portfolios, and printed. We also have a verification system for employers and schools to confirm authenticity."
  },
  {
    category: "courses",
    question: "Can students save their projects?",
    answer: "Absolutely! All projects are automatically saved to the student's account. Students can access their portfolio of completed projects anytime, share them with friends and family, and continue building on them."
  },

  // Billing & Payments
  {
    category: "billing",
    question: "How do I enroll my child?",
    answer: "Contact us directly to discuss your child's needs and we'll help you find the right program. We offer personalized consultations to ensure the best fit for your child's age and skill level."
  },
  {
    category: "billing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and PayPal. All payments are processed securely. We do not store your card information on our servers."
  },
  {
    category: "billing",
    question: "Do you offer family or group discounts?",
    answer: "Yes! We offer special rates for families with multiple children. Schools and coding clubs can also contact us for group pricing. Email support@ourcodingkiddos.com for details."
  },
  {
    category: "billing",
    question: "Is there financial assistance available?",
    answer: "We believe every child should have access to coding education. We offer scholarships and assistance for families in need. Contact our support team to learn about available programs."
  },

  // Account & Parents
  {
    category: "account",
    question: "How can parents monitor their child's progress?",
    answer: "Parents have access to a dedicated dashboard showing their child's course progress, completed projects, time spent learning, achievements earned, and upcoming live classes. Weekly progress reports are also sent via email."
  },
  {
    category: "account",
    question: "Can I add multiple children to one account?",
    answer: "Yes! A single parent account can manage multiple student profiles. Each child gets their own personalized learning experience, progress tracking, and saved projects. Family plans offer discounted pricing for additional children."
  },
  {
    category: "account",
    question: "How do I update my account information?",
    answer: "Log into your account and go to Settings. From there, you can update your email, password, payment information, notification preferences, and your children's profiles."
  },
  {
    category: "account",
    question: "Can I switch between subscription plans?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the start of your next billing cycle."
  },

  // Technical Support
  {
    category: "technical",
    question: "What equipment does my child need?",
    answer: "A computer or laptop with internet access is all you need. Our platform works on Windows, Mac, and Chromebook. A modern web browser (Chrome, Firefox, Safari, or Edge) is required. Tablets work for some courses but we recommend a computer for the best experience."
  },
  {
    category: "technical",
    question: "Do I need to install any software?",
    answer: "No installation required for most courses! Our coding environment runs entirely in the browser. For Roblox Studio courses, you'll need to download Roblox Studio (free). We provide step-by-step installation guides."
  },
  {
    category: "technical",
    question: "What if my child's code isn't working?",
    answer: "Our platform includes helpful error messages and hints. Students can also use the 'Ask for Help' button to get guidance. For Premium members, live chat support is available during business hours. Our community forum is another great resource."
  },
  {
    category: "technical",
    question: "Can students access courses on mobile devices?",
    answer: "Our website is mobile-responsive for browsing and watching video lessons. However, for the best coding experience, we recommend using a computer with a keyboard. Live classes require a computer with camera and microphone."
  },
  {
    category: "technical",
    question: "What internet speed do I need?",
    answer: "A standard broadband connection (at least 5 Mbps) is sufficient for self-paced courses. For live classes with video, we recommend at least 10 Mbps for smooth streaming."
  },

  // Safety & Privacy
  {
    category: "safety",
    question: "Is your platform safe for children?",
    answer: "Absolutely. Safety is our top priority. We're COPPA compliant, all instructors are background-checked, live classes are monitored, there's no direct messaging between students, and parents have full visibility into their child's activity."
  },
  {
    category: "safety",
    question: "What data do you collect about my child?",
    answer: "We collect only what's necessary: first name, age range, and learning progress. We do not collect sensitive personal information from children. Full details are in our Privacy Policy, which complies with COPPA regulations."
  },
  {
    category: "safety",
    question: "Can my child interact with other students?",
    answer: "Student interaction is limited and supervised. In live classes, students can participate in group discussions moderated by instructors. There's no private messaging between students. Our forum is moderated to ensure appropriate content."
  },
  {
    category: "safety",
    question: "How do you verify instructors?",
    answer: "All instructors undergo background checks, identity verification, and a rigorous interview process. They must have relevant teaching experience and programming expertise. We also collect student feedback to ensure quality."
  },
  {
    category: "safety",
    question: "How can I delete my child's data?",
    answer: "Parents can request data deletion at any time by contacting privacy@ourcodingkiddos.com or through account settings. We'll process deletion requests within 30 days as required by privacy regulations."
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch = searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || HelpCircle;
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none dark:block hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <nav className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </Link>
        </nav>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-sm text-purple-700 dark:text-slate-300 mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Find answers to common questions about our coding courses, billing, and platform.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-purple-300 dark:hover:border-purple-500/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {filteredFaqs.length} {filteredFaqs.length === 1 ? "question" : "questions"} found
        </p>

        {/* FAQ Items */}
        <div className="space-y-3 mb-16">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Try adjusting your search or browse a different category
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openItems.includes(index);
              const CategoryIcon = getCategoryIcon(faq.category);
              const faqId = `faq-${index}`;
              const answerId = `faq-answer-${index}`;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden transition hover:border-purple-300 dark:hover:border-purple-500/30"
                >
                  <button
                    id={faqId}
                    onClick={() => toggleItem(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleItem(index);
                      }
                    }}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="w-full flex items-start gap-4 p-5 text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                      isOpen
                        ? "bg-purple-100 dark:bg-purple-500/20"
                        : "bg-slate-100 dark:bg-white/5"
                    }`}>
                      <CategoryIcon className={`w-5 h-5 ${
                        isOpen
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white pr-8">
                        {faq.question}
                      </h3>
                      {!isOpen && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={faqId}
                      className="px-5 pb-5 pl-[76px]"
                    >
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions? */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Still have questions?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-white/90 transition"
            >
              Contact Support
            </Link>
            <button
              onClick={() => {
                const chatButton = document.querySelector('[data-chat-toggle]') as HTMLButtonElement;
                if (chatButton) chatButton.click();
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition"
            >
              Chat with Cody AI
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          <Link
            href="/courses"
            className="p-6 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-purple-300 dark:hover:border-purple-500/30 transition group"
          >
            <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h3 className="font-semibold mb-1">Browse Courses</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Explore our full catalog</p>
          </Link>
          <Link
            href="/programs"
            className="p-6 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-purple-300 dark:hover:border-purple-500/30 transition group"
          >
            <CreditCard className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3" />
            <h3 className="font-semibold mb-1">View Programs</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">See our coding programs</p>
          </Link>
          <Link
            href="/about"
            className="p-6 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-purple-300 dark:hover:border-purple-500/30 transition group"
          >
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="font-semibold mb-1">About Us</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Learn about our mission</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
