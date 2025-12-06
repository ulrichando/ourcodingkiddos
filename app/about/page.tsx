"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
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
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000, isVisible: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return count;
}

// Intersection observer hook
function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, { threshold: 0.3, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isIntersecting };
}

const stats = [
  { value: 10000, suffix: "+", label: "Happy Students", icon: Users },
  { value: 50, suffix: "+", label: "Coding Courses", icon: BookOpen },
  { value: 98, suffix: "%", label: "Parent Satisfaction", icon: Star },
  { value: 25, suffix: "+", label: "Countries Reached", icon: Globe },
];

const values = [
  {
    icon: Heart,
    title: "Child-First Approach",
    description: "Every course, feature, and interaction is designed with children's safety, engagement, and learning needs in mind.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Lightbulb,
    title: "Learning Through Play",
    description: "We believe coding should be fun! Our gamified lessons and creative projects make learning feel like an adventure.",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    icon: Shield,
    title: "Safety & Privacy",
    description: "COPPA compliant platform with strict safety measures. Parents can trust their children are in a secure environment.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Target,
    title: "Mastery-Based Learning",
    description: "Students progress at their own pace, mastering concepts before moving on. No one gets left behind.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Supportive Community",
    description: "Join a community of young coders, supportive instructors, and engaged parents all working together.",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    icon: Rocket,
    title: "Future-Ready Skills",
    description: "Beyond coding syntax, we teach problem-solving, creativity, and computational thinking for tomorrow's challenges.",
    gradient: "from-orange-500 to-red-500",
  },
];

const features = [
  "Interactive coding lessons with instant feedback",
  "Live classes with certified instructors",
  "Project-based learning with real creations",
  "Progress tracking for parents",
  "Certificates upon course completion",
  "Safe, ad-free learning environment",
];

function StatCard({ value, suffix, label, icon: Icon, isVisible, index }: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Users;
  isVisible: boolean;
  index: number;
}) {
  const count = useAnimatedCounter(value, 2000, isVisible);

  return (
    <div
      className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-gradient tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">{label}</div>
    </div>
  );
}

export default function AboutPage() {
  const statsObserver = useIntersectionObserver();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-slate-50 to-slate-50 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/50 dark:bg-purple-900/30 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-200/50 dark:bg-pink-900/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative text-center space-y-8">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-semibold border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-4 h-4" />
              Our Story
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold animate-fade-in-up">
            Empowering the Next Generation of{" "}
            <span className="text-gradient">Coders</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-100">
            Our Coding Kiddos was founded with a simple mission: make coding accessible,
            fun, and safe for every child. We believe that every kid deserves the chance
            to discover the magic of creating with code.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4 animate-fade-in-up delay-200">
            <Link href="/courses">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 group">
                Explore Courses
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section with animated counters */}
      <section className="bg-white dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700/50 py-16">
        <div ref={statsObserver.ref} className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                icon={stat.icon}
                isVisible={statsObserver.isIntersecting}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-400 px-4 py-2 rounded-full text-sm font-semibold border border-pink-200 dark:border-pink-800">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Building Tomorrow&apos;s Creators, <span className="text-gradient">Today</span>
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
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-8 flex items-center justify-center border border-purple-200/50 dark:border-purple-700/30">
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  {[
                    { icon: Code2, color: "from-purple-500 to-violet-500" },
                    { icon: GraduationCap, color: "from-pink-500 to-rose-500" },
                    { icon: Rocket, color: "from-blue-500 to-cyan-500" },
                    { icon: Award, color: "from-amber-500 to-yellow-500" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="group aspect-square rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl flex items-center justify-center p-4 transition-all duration-300 hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative blur elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-400/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-pink-400/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white dark:bg-slate-800/30 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-semibold border border-purple-200 dark:border-purple-800 mb-6">
              <Heart className="w-4 h-4" />
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Stand For</h2>
            <p className="text-slate-600 dark:text-slate-400">
              These core principles guide everything we do at Our Coding Kiddos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6 space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="relative rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 md:p-10 overflow-hidden shadow-2xl shadow-purple-500/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                <div className="relative space-y-6">
                  <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-300" />
                    <h3 className="text-2xl font-bold text-white">What We Offer</h3>
                  </div>
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-300" />
                        <span className="text-white/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-800">
                <BookOpen className="w-4 h-4" />
                Our Platform
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Everything Kids Need to <span className="text-gradient">Learn Coding</span>
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
              <Link href="/programs">
                <Button variant="outline" className="mt-4 group">
                  View Programs
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Start Your Child&apos;s Coding Journey?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of families who&apos;ve discovered the joy of coding with Our Coding Kiddos.
            Start with a free course today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button className="bg-white text-purple-600 hover:bg-slate-100 min-w-[180px] shadow-lg shadow-purple-900/30 hover:shadow-xl active:scale-95 group">
                Browse Courses
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" className="border-white/50 text-white hover:bg-white/10 min-w-[180px]">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-white dark:bg-slate-800/30">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Trusted by families worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              { icon: Shield, label: "COPPA Compliant" },
              { icon: Award, label: "Certified Instructors" },
              { icon: Globe, label: "Available Worldwide" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50"
              >
                <item.icon className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
