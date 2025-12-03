"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Target,
  Users,
  Sparkles,
  Shield,
  Award,
  BookOpen,
  Rocket,
  Globe,
  Star,
  Lightbulb,
  Code2,
  GraduationCap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";

const stats = [
  { value: "10,000+", label: "Happy Students", icon: Users },
  { value: "50+", label: "Coding Courses", icon: BookOpen },
  { value: "98%", label: "Parent Satisfaction", icon: Star },
  { value: "25+", label: "Countries Reached", icon: Globe },
];

const values = [
  {
    icon: Heart,
    title: "Child-First Approach",
    description: "Every course, feature, and interaction is designed with children's safety, engagement, and learning needs in mind.",
    color: "pink"
  },
  {
    icon: Lightbulb,
    title: "Learning Through Play",
    description: "We believe coding should be fun! Our gamified lessons and creative projects make learning feel like an adventure.",
    color: "yellow"
  },
  {
    icon: Shield,
    title: "Safety & Privacy",
    description: "COPPA compliant platform with strict safety measures. Parents can trust their children are in a secure environment.",
    color: "green"
  },
  {
    icon: Target,
    title: "Mastery-Based Learning",
    description: "Students progress at their own pace, mastering concepts before moving on. No one gets left behind.",
    color: "blue"
  },
  {
    icon: Users,
    title: "Supportive Community",
    description: "Join a community of young coders, supportive instructors, and engaged parents all working together.",
    color: "purple"
  },
  {
    icon: Rocket,
    title: "Future-Ready Skills",
    description: "Beyond coding syntax, we teach problem-solving, creativity, and computational thinking for tomorrow's challenges.",
    color: "orange"
  },
];

const colorClasses: Record<string, { bg: string; text: string; darkBg: string }> = {
  pink: { bg: "bg-pink-100", text: "text-pink-600", darkBg: "dark:bg-pink-900/30" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600", darkBg: "dark:bg-yellow-900/30" },
  green: { bg: "bg-green-100", text: "text-green-600", darkBg: "dark:bg-green-900/30" },
  blue: { bg: "bg-blue-100", text: "text-blue-600", darkBg: "dark:bg-blue-900/30" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", darkBg: "dark:bg-purple-900/30" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", darkBg: "dark:bg-orange-900/30" },
};

const features = [
  "Interactive coding lessons with instant feedback",
  "Live classes with certified instructors",
  "Project-based learning with real creations",
  "Progress tracking for parents",
  "Certificates upon course completion",
  "Safe, ad-free learning environment",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">
            Empowering the Next Generation of{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Coders
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            Our Coding Kiddos was founded with a simple mission: make coding accessible,
            fun, and safe for every child. We believe that every kid deserves the chance
            to discover the magic of creating with code.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Target className="w-4 h-4" />
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Building Tomorrow&apos;s Creators, Today
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              In a world increasingly shaped by technology, we believe coding literacy is as
              fundamental as reading and writing. Our mission is to give every child—regardless
              of background or prior experience—the tools to become creators, not just consumers,
              of technology.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We&apos;ve designed our platform specifically for young learners, with age-appropriate
              content, engaging visuals, and a safe online environment that parents can trust.
              Our certified instructors are passionate about education and experienced in working
              with children.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link href="/courses">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Explore Courses
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10 p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                <div className="aspect-square rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center p-4">
                  <Code2 className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="aspect-square rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center p-4">
                  <GraduationCap className="w-12 h-12 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="aspect-square rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center p-4">
                  <Rocket className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="aspect-square rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center p-4">
                  <Award className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-slate-50 dark:bg-slate-800/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Heart className="w-4 h-4" />
              Our Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Stand For</h2>
            <p className="text-slate-600 dark:text-slate-400">
              These core principles guide everything we do at Our Coding Kiddos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const colors = colorClasses[value.color];
              return (
                <Card key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 space-y-4">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.darkBg} flex items-center justify-center`}>
                      <value.icon className={`w-6 h-6 ${colors.text} dark:opacity-90`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{value.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-0 text-white overflow-hidden relative">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative">
                  <h3 className="text-2xl font-bold mb-6">What We Offer</h3>
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="text-white/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm font-semibold">
              <BookOpen className="w-4 h-4" />
              Our Platform
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything Kids Need to Learn Coding
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              From HTML and CSS basics to Python and JavaScript, our comprehensive curriculum
              covers all the essential programming languages. Each course is broken down into
              bite-sized lessons that keep young minds engaged.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Students don&apos;t just watch—they create. Every course includes hands-on projects
              where kids build real websites, games, and applications they can proudly share
              with friends and family.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Child&apos;s Coding Journey?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of families who&apos;ve discovered the joy of coding with Our Coding Kiddos.
            Start with a free course today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button className="bg-white text-purple-600 hover:bg-white/90 min-w-[180px]">
                Browse Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 min-w-[180px]">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Trusted by families worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">COPPA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Certified Instructors</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Globe className="w-5 h-5" />
              <span className="font-semibold">Available Worldwide</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
