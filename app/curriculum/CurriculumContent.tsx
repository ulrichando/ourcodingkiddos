"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Users,
  BookOpen,
  Star,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Award,
  Zap,
  GraduationCap,
  Rocket,
  Shield,
  Code,
  Play,
  Filter,
  ArrowRight,
  CheckCircle,
  Target,
  Lightbulb,
  Layers,
  Briefcase,
} from "lucide-react";

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  language: string;
  ageGroup: string;
  level: string;
  sessionCount: number;
  sessionDuration: number;
  priceCents: number;
  originalPriceCents: number | null;
  features: any;
  curriculum: any;
  isFeatured: boolean;
  _count: { enrollments: number };
}

interface ClassSession {
  id: string;
  title: string;
  language: string;
  ageGroup: string;
  startTime: Date;
  durationMinutes: number;
  sessionType: string;
  enrolledCount: number | null;
  maxStudents: number | null;
}

interface CurriculumContentProps {
  programs: Program[];
  sessions: ClassSession[];
}

const ageGroupLabels: Record<string, string> = {
  AGES_7_10: "Ages 7-10",
  AGES_11_14: "Ages 11-14",
  AGES_15_18: "Ages 15-18",
};

const languageLabels: Record<string, string> = {
  HTML: "HTML & CSS",
  CSS: "CSS",
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  ROBLOX: "Roblox Studio",
  AI_ML: "AI & Machine Learning",
  GAME_DEVELOPMENT: "Game Development",
  WEB_DEVELOPMENT: "Web Development",
  MOBILE_DEVELOPMENT: "Mobile Apps",
  ROBOTICS: "Robotics",
  ENGINEERING: "Engineering",
  CAREER_PREP: "Career Prep",
};

const languageColors: Record<string, string> = {
  HTML: "from-orange-500 to-red-500",
  CSS: "from-blue-400 to-blue-600",
  JAVASCRIPT: "from-yellow-400 to-orange-500",
  PYTHON: "from-blue-500 to-green-500",
  ROBLOX: "from-red-500 to-red-700",
  AI_ML: "from-purple-500 to-indigo-600",
  GAME_DEVELOPMENT: "from-green-500 to-teal-500",
  WEB_DEVELOPMENT: "from-cyan-500 to-blue-500",
  MOBILE_DEVELOPMENT: "from-pink-500 to-rose-500",
  ROBOTICS: "from-gray-500 to-slate-600",
  ENGINEERING: "from-amber-500 to-orange-600",
  CAREER_PREP: "from-violet-500 to-purple-600",
};

const levelConfig = {
  BEGINNER: {
    name: "Coder Level I",
    subtitle: "Foundation",
    description: "Perfect for students new to coding. Build a solid programming foundation.",
    icon: Code,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
  },
  INTERMEDIATE: {
    name: "Coder Level II",
    subtitle: "Builder",
    description: "For students ready to build real-world projects and deepen their skills.",
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  ADVANCED: {
    name: "Coder Level III",
    subtitle: "Creator",
    description: "Master advanced concepts and prepare for professional development.",
    icon: Rocket,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  EXPERT: {
    name: "Coder Level IV",
    subtitle: "Innovator",
    description: "Expert-level courses for aspiring tech leaders.",
    icon: GraduationCap,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  MASTER: {
    name: "Coder Level V",
    subtitle: "Master",
    description: "Industry-ready skills for serious tech enthusiasts.",
    icon: Award,
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    borderColor: "border-rose-200 dark:border-rose-800",
    textColor: "text-rose-700 dark:text-rose-300",
  },
};

const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT", "MASTER"] as const;

const testimonials = [
  {
    quote: "My daughter went from knowing nothing about coding to building her own games in just 12 weeks!",
    author: "Sarah M.",
    role: "Parent of 10-year-old",
    rating: 5,
  },
  {
    quote: "The instructors are patient and really know how to explain complex concepts to kids. Highly recommend!",
    author: "Michael T.",
    role: "Parent of 14-year-old",
    rating: 5,
  },
  {
    quote: "Our Coding Kiddos helped my son discover his passion for programming. He's now considering a career in tech!",
    author: "Jennifer L.",
    role: "Parent of 16-year-old",
    rating: 5,
  },
];

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const SESSIONS_PER_PAGE = 6;

export function CurriculumContent({ programs, sessions }: CurriculumContentProps) {
  const [activeLevel, setActiveLevel] = useState<string>("BEGINNER");
  const [activeAgeGroup, setActiveAgeGroup] = useState<string>("all");
  const [scheduleFilter, setScheduleFilter] = useState<string>("all");
  const [schedulePage, setSchedulePage] = useState(1);

  // Group programs by level
  const programsByLevel = levels.reduce((acc, level) => {
    acc[level] = programs.filter((p) => p.level === level);
    return acc;
  }, {} as Record<string, Program[]>);

  // Filter programs by age group
  const filteredPrograms =
    activeAgeGroup === "all"
      ? programsByLevel[activeLevel] || []
      : (programsByLevel[activeLevel] || []).filter((p) => p.ageGroup === activeAgeGroup);

  // Filter sessions
  const filteredSessions =
    scheduleFilter === "all"
      ? sessions
      : sessions.filter((s) => s.ageGroup === scheduleFilter || s.language === scheduleFilter);

  // Pagination for sessions
  const totalSessionPages = Math.ceil(filteredSessions.length / SESSIONS_PER_PAGE);
  const sessionStartIndex = (schedulePage - 1) * SESSIONS_PER_PAGE;
  const paginatedSessions = filteredSessions.slice(sessionStartIndex, sessionStartIndex + SESSIONS_PER_PAGE);

  // Reset page when filter changes
  const handleFilterChange = (value: string) => {
    setScheduleFilter(value);
    setSchedulePage(1);
  };

  const config = levelConfig[activeLevel as keyof typeof levelConfig] || levelConfig.BEGINNER;
  const LevelIcon = config.icon;

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 text-center bg-gradient-to-b from-purple-50 via-white to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200 dark:bg-pink-900/30 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-semibold">
            <GraduationCap className="w-4 h-4" />
            Structured Learning Curriculum
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100">
            Coding Classes for{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Future Innovators
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From beginner to advanced, our expert-led curriculum prepares kids ages 7-18 for success
            in technology. Live classes, real projects, real results.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">4-Session Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">4.9/5 Parent Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">1000+ Students Taught</span>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="#schedule"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-4 rounded-xl hover:brightness-110 transition shadow-lg"
            >
              <Calendar className="w-5 h-5" />
              View Class Schedule
            </Link>
            <Link
              href="#levels"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <BookOpen className="w-5 h-5" />
              Explore Curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-12 px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "Live Instruction",
                description: "Small class sizes with expert teachers",
              },
              {
                icon: Code,
                title: "Hands-On Projects",
                description: "Build real apps, games, and websites",
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description: "Weekly or twice-weekly sessions",
              },
              {
                icon: Award,
                title: "Certificates",
                description: "Earn credentials upon completion",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Complete Developer Journey */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950 text-white overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-white/10">
              <Target className="w-4 h-4 text-purple-400" />
              The Complete Developer Journey
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              From Zero to{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Full-Stack Developer
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Our carefully crafted 5-level curriculum takes your child from their very first line of code
              to becoming an industry-ready developer. Every step is designed to build confidence,
              real-world skills, and a genuine love for technology.
            </p>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {[
                { value: "2-3 Years", label: "Complete Journey" },
                { value: "50+", label: "Real Projects Built" },
                { value: "5", label: "Certifications Earned" },
                { value: "26", label: "Specialized Courses" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* What Does It Mean To Be A Full-Stack Developer */}
          <div className="mb-16 p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                What is a Full-Stack Developer?
              </h3>
              <p className="text-slate-300 max-w-2xl mx-auto">
                A full-stack developer is someone who can build complete applications from start to finish -
                everything a user sees AND everything that happens behind the scenes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-white mb-2">Frontend Development</h4>
                <p className="text-sm text-slate-400 mb-3">
                  Everything users see and interact with - buttons, layouts, animations, and user experience.
                </p>
                <div className="flex flex-wrap gap-1">
                  {["HTML", "CSS", "JavaScript", "React"].map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-white mb-2">Backend Development</h4>
                <p className="text-sm text-slate-400 mb-3">
                  The server-side logic - handling data, user accounts, security, and making everything work.
                </p>
                <div className="flex flex-wrap gap-1">
                  {["Node.js", "Python", "APIs", "Databases"].map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-white mb-2">DevOps & Deployment</h4>
                <p className="text-sm text-slate-400 mb-3">
                  Putting it all together - deploying apps to the cloud so the world can use them.
                </p>
                <div className="flex flex-wrap gap-1">
                  {["Git", "AWS", "Docker", "CI/CD"].map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* The 5-Level Journey */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                The 5 Levels to Mastery
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Each level builds on the previous one, ensuring a solid foundation before advancing.
                Students progress at their own pace with personalized support.
              </p>
            </div>

            {/* Main Timeline */}
            <div className="relative">
              {/* Vertical Line - Mobile */}
              <div className="md:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-purple-500 to-rose-500" />

              {/* Timeline Cards */}
              <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-5 md:gap-4">
                {[
                  {
                    level: 1,
                    title: "Explorer",
                    subtitle: "Foundation",
                    duration: "12 weeks",
                    ages: "Ages 7-10",
                    color: "from-green-400 to-emerald-500",
                    shadowColor: "shadow-green-500/20",
                    skills: ["Block-based coding", "Computational thinking", "Basic algorithms", "Problem solving"],
                    projects: ["Scratch games", "Animated stories", "Interactive art"],
                    tools: ["Scratch", "Python Basics"],
                    outcome: "Think like a programmer",
                    description: "Start the coding journey with visual, block-based programming. Perfect for beginners who have never coded before.",
                  },
                  {
                    level: 2,
                    title: "Builder",
                    subtitle: "Web Fundamentals",
                    duration: "12-18 weeks",
                    ages: "Ages 10-14",
                    color: "from-blue-400 to-indigo-500",
                    shadowColor: "shadow-blue-500/20",
                    skills: ["HTML structure", "CSS styling", "Basic JavaScript", "Responsive design"],
                    projects: ["Personal website", "Landing pages", "Roblox games"],
                    tools: ["VS Code", "Chrome DevTools"],
                    outcome: "Build real websites",
                    description: "Learn the languages of the web. Create real websites that can be shared with friends and family.",
                  },
                  {
                    level: 3,
                    title: "Creator",
                    subtitle: "Dynamic Apps",
                    duration: "16-24 weeks",
                    ages: "Ages 12-16",
                    color: "from-purple-400 to-pink-500",
                    shadowColor: "shadow-purple-500/20",
                    skills: ["Advanced JavaScript", "React fundamentals", "API integration", "Version control"],
                    projects: ["Weather app", "Game projects", "Mobile apps"],
                    tools: ["React", "Git", "GitHub"],
                    outcome: "Create interactive apps",
                    description: "Move beyond static websites to build dynamic, interactive applications with real data.",
                  },
                  {
                    level: 4,
                    title: "Engineer",
                    subtitle: "Full-Stack",
                    duration: "18-24 weeks",
                    ages: "Ages 14-18",
                    color: "from-orange-400 to-amber-500",
                    shadowColor: "shadow-orange-500/20",
                    skills: ["Backend with Node.js", "Database design", "Authentication", "Cloud deployment"],
                    projects: ["Full-stack apps", "Blog platform", "E-commerce site"],
                    tools: ["Node.js", "PostgreSQL", "Vercel"],
                    outcome: "Build complete systems",
                    description: "Master backend development and databases. Build applications that can serve thousands of users.",
                  },
                  {
                    level: 5,
                    title: "Architect",
                    subtitle: "Professional",
                    duration: "24+ weeks",
                    ages: "Ages 15-18",
                    color: "from-rose-400 to-red-500",
                    shadowColor: "shadow-rose-500/20",
                    skills: ["System architecture", "AI & ML", "Cloud services", "Professional practices"],
                    projects: ["SaaS application", "AI projects", "Capstone portfolio"],
                    tools: ["TypeScript", "AWS", "Docker"],
                    outcome: "Industry-ready developer",
                    description: "Advanced specializations including AI/ML, cloud architecture, and professional software engineering.",
                  },
                ].map((stage, index) => (
                  <div key={stage.level} className="relative pl-16 md:pl-0">
                    {/* Mobile Level Indicator */}
                    <div className={`md:hidden absolute left-5 top-6 w-6 h-6 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center text-white text-xs font-bold shadow-lg ${stage.shadowColor} z-10`}>
                      {stage.level}
                    </div>

                    {/* Card */}
                    <div className={`relative group`}>
                      {/* Desktop Connection Arrow */}
                      {index < 4 && (
                        <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-20">
                          <ArrowRight className="w-4 h-4 text-slate-600" />
                        </div>
                      )}

                      <div className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:bg-slate-800/70 h-full`}>
                        {/* Level Badge - Desktop */}
                        <div className={`hidden md:flex absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br ${stage.color} items-center justify-center text-white text-sm font-bold shadow-lg ${stage.shadowColor}`}>
                          {stage.level}
                        </div>

                        {/* Header */}
                        <div className="md:pt-3 mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-lg font-bold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                              {stage.title}
                            </h3>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                              {stage.ages}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{stage.subtitle} • {stage.duration}</p>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                          {stage.description}
                        </p>

                        {/* Skills */}
                        <div className="mb-4">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 font-semibold">Core Skills</p>
                          <div className="space-y-1">
                            {stage.skills.map((skill, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                                <CheckCircle className={`w-3 h-3 text-green-400`} />
                                {skill}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Projects */}
                        <div className="mb-4">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 font-semibold">Projects Built</p>
                          <div className="flex flex-wrap gap-1">
                            {stage.projects.map((project, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400">
                                {project}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Tools */}
                        <div className="mb-4">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 font-semibold">Technologies</p>
                          <div className="flex flex-wrap gap-1">
                            {stage.tools.map((tool, i) => (
                              <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md bg-gradient-to-r ${stage.color} text-white font-medium`}>
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Outcome */}
                        <div className={`pt-3 border-t border-slate-700/50`}>
                          <div className="flex items-center gap-2">
                            <Award className={`w-4 h-4 text-yellow-400`} />
                            <p className="text-xs font-medium text-white">{stage.outcome}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Tree Visualization */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Complete Skill Tree
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Every skill your child will master on their journey to becoming a full-stack developer.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  category: "Programming Languages",
                  icon: Code,
                  color: "from-blue-500 to-cyan-500",
                  skills: [
                    { name: "Python", level: "Levels 1-5" },
                    { name: "JavaScript", level: "Levels 2-5" },
                    { name: "TypeScript", level: "Levels 4-5" },
                    { name: "HTML/CSS", level: "Levels 2-5" },
                    { name: "SQL", level: "Levels 4-5" },
                    { name: "Lua (Roblox)", level: "Levels 1-2" },
                  ],
                },
                {
                  category: "Frameworks & Libraries",
                  icon: Layers,
                  color: "from-purple-500 to-pink-500",
                  skills: [
                    { name: "React", level: "Levels 3-5" },
                    { name: "Next.js", level: "Levels 4-5" },
                    { name: "Node.js", level: "Levels 4-5" },
                    { name: "React Native", level: "Level 3" },
                    { name: "TensorFlow", level: "Level 5" },
                    { name: "Pygame", level: "Level 2" },
                  ],
                },
                {
                  category: "Tools & Platforms",
                  icon: Briefcase,
                  color: "from-orange-500 to-amber-500",
                  skills: [
                    { name: "Git & GitHub", level: "Levels 3-5" },
                    { name: "VS Code", level: "Levels 2-5" },
                    { name: "Docker", level: "Level 5" },
                    { name: "AWS/Vercel", level: "Levels 4-5" },
                    { name: "Figma", level: "Levels 3-5" },
                    { name: "Postman", level: "Levels 4-5" },
                  ],
                },
                {
                  category: "Concepts & Practices",
                  icon: Lightbulb,
                  color: "from-green-500 to-emerald-500",
                  skills: [
                    { name: "Algorithms", level: "Levels 1-5" },
                    { name: "Data Structures", level: "Levels 3-5" },
                    { name: "API Design", level: "Levels 4-5" },
                    { name: "Testing", level: "Levels 4-5" },
                    { name: "Security", level: "Level 5" },
                    { name: "System Design", level: "Level 5" },
                  ],
                },
              ].map((category, index) => (
                <div key={index} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-4">{category.category}</h4>
                  <div className="space-y-3">
                    {category.skills.map((skill, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{skill.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Outcomes */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Where This Journey Leads
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Completing our curriculum opens doors to exciting career paths and opportunities.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Software Developer",
                  salary: "$85,000 - $150,000+",
                  description: "Build applications and systems for companies of all sizes.",
                  companies: ["Google", "Microsoft", "Startups"],
                },
                {
                  title: "Full-Stack Engineer",
                  salary: "$95,000 - $170,000+",
                  description: "Work on both frontend and backend of web applications.",
                  companies: ["Meta", "Netflix", "Tech Companies"],
                },
                {
                  title: "AI/ML Engineer",
                  salary: "$120,000 - $200,000+",
                  description: "Build intelligent systems and machine learning models.",
                  companies: ["OpenAI", "DeepMind", "Research Labs"],
                },
                {
                  title: "Mobile App Developer",
                  salary: "$80,000 - $140,000+",
                  description: "Create apps for iOS and Android devices.",
                  companies: ["Apple", "Uber", "Mobile Startups"],
                },
                {
                  title: "Game Developer",
                  salary: "$70,000 - $130,000+",
                  description: "Design and build video games and interactive experiences.",
                  companies: ["Epic", "Roblox", "Game Studios"],
                },
                {
                  title: "Tech Entrepreneur",
                  salary: "Unlimited Potential",
                  description: "Start your own tech company and build your vision.",
                  companies: ["Your Own Startup!"],
                },
              ].map((career, index) => (
                <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                  <h4 className="font-bold text-lg text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {career.title}
                  </h4>
                  <div className="text-sm text-green-400 font-semibold mb-3">{career.salary}</div>
                  <p className="text-sm text-slate-400 mb-4">{career.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {career.companies.map((company, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why This Works */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: "🎯",
                title: "Clear Progression",
                description: "Each level builds directly on the previous, ensuring no gaps in knowledge and steady confidence growth.",
              },
              {
                icon: "🛠️",
                title: "Learn by Building",
                description: "Every concept is taught through hands-on projects. By Level 5, your child will have 50+ portfolio pieces.",
              },
              {
                icon: "👨‍🏫",
                title: "Expert Guidance",
                description: "Live instruction from industry professionals who know what skills employers actually want.",
              },
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-slate-400 mb-6">Ready to start your child's coding journey?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#levels"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-xl hover:brightness-110 transition shadow-lg shadow-purple-500/25"
              >
                Explore Courses <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#schedule"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition border border-white/10"
              >
                <Calendar className="w-4 h-4" />
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Level Tabs Section */}
      <section id="levels" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Choose Your Learning Path</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Progress through our structured curriculum at your own pace. Each level builds on the
              previous, creating a clear path to coding mastery.
            </p>
          </div>

          {/* Level Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {levels.map((level) => {
              const cfg = levelConfig[level];
              const Icon = cfg.icon;
              const isActive = activeLevel === level;
              const programCount = programsByLevel[level]?.length || 0;

              return (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? `${cfg.bgColor} ${cfg.borderColor} ${cfg.textColor} shadow-lg`
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive ? `bg-gradient-to-br ${cfg.color}` : "bg-slate-100 dark:bg-slate-700"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-sm sm:text-base">{cfg.name}</div>
                    <div className="text-xs opacity-75">
                      {cfg.subtitle} &bull; {programCount} courses
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Level Description */}
          <div
            className={`text-center p-6 rounded-2xl ${config.bgColor} ${config.borderColor} border mb-8`}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                <LevelIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${config.textColor}`}>{config.name}</h3>
                <p className="text-sm opacity-75">{config.subtitle}</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400">{config.description}</p>
          </div>

          {/* Age Group Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveAgeGroup("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeAgeGroup === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Ages
            </button>
            {Object.entries(ageGroupLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveAgeGroup(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeAgeGroup === key
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Course Cards Grid */}
          {filteredPrograms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <CourseCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Courses Available Yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {activeAgeGroup === "all"
                  ? `We're currently developing ${config.name} courses. Check back soon!`
                  : `No ${config.name} courses available for ${ageGroupLabels[activeAgeGroup]} yet.`}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                Get Notified When Available
              </Link>
            </div>
          )}

          {/* View Next Level CTA */}
          {activeLevel !== "MASTER" && (
            <div className="mt-12 text-center">
              <button
                onClick={() => {
                  const nextLevel = levels[levels.indexOf(activeLevel as any) + 1];
                  if (nextLevel) setActiveLevel(nextLevel);
                }}
                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                View Next Level: {levelConfig[levels[levels.indexOf(activeLevel as any) + 1]]?.name}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Class Schedule Section */}
      <section id="schedule" className="py-16 px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Upcoming Class Schedule</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Browse available class times and find the perfect fit for your schedule. New sessions
              are added regularly.
            </p>
          </div>

          {/* Schedule Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <select
              value={scheduleFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            >
              <option value="all">All Classes</option>
              <optgroup label="Age Group">
                {Object.entries(ageGroupLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Subject">
                {Object.entries(languageLabels)
                  .slice(0, 8)
                  .map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Schedule Grid */}
          {filteredSessions.length > 0 ? (
            <>
              {/* Session count */}
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Showing {sessionStartIndex + 1}-{Math.min(sessionStartIndex + SESSIONS_PER_PAGE, filteredSessions.length)} of {filteredSessions.length} classes
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{session.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {languageLabels[session.language] || session.language}
                        </p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {ageGroupLabels[session.ageGroup] || session.ageGroup}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(session.startTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(session.startTime)}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {session.enrolledCount || 0}/{session.maxStudents || "∞"} enrolled
                      </span>
                      <Link
                        href="/booking"
                        className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Enroll →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalSessionPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setSchedulePage(p => Math.max(1, p - 1))}
                    disabled={schedulePage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition border border-slate-200 dark:border-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalSessionPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalSessionPages <= 5) {
                        pageNum = i + 1;
                      } else if (schedulePage <= 3) {
                        pageNum = i + 1;
                      } else if (schedulePage >= totalSessionPages - 2) {
                        pageNum = totalSessionPages - 4 + i;
                      } else {
                        pageNum = schedulePage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setSchedulePage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                            pageNum === schedulePage
                              ? "bg-purple-600 text-white"
                              : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setSchedulePage(p => Math.min(totalSessionPages, p + 1))}
                    disabled={schedulePage === totalSessionPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition border border-slate-200 dark:border-slate-700"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Upcoming Sessions</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                New class sessions are added regularly. Contact us to request a specific time.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Request a Class Time
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">What Parents Are Saying</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Join thousands of satisfied families who trust Our Coding Kiddos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-slate-700 dark:text-slate-300 mb-4 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Child&apos;s Coding Journey?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students learning to code with Our Coding Kiddos. Try risk-free with
            our 4-session money-back guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/programs"
              className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition shadow-lg"
            >
              <Play className="w-5 h-5" />
              Start Here
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition border border-white/30"
            >
              Get Personalized Advice
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Course Card Component
function CourseCard({ program }: { program: Program }) {
  const discount = program.originalPriceCents
    ? Math.round(
        ((program.originalPriceCents - program.priceCents) / program.originalPriceCents) * 100
      )
    : 0;

  return (
    <Link
      href={`/programs/${program.slug}`}
      className={`group block overflow-hidden rounded-2xl border bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 ${
        program.isFeatured
          ? "border-purple-300 dark:border-purple-700 ring-2 ring-purple-500/20"
          : "border-slate-200 dark:border-slate-700"
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative h-36 bg-gradient-to-br ${
          languageColors[program.language] || "from-slate-400 to-slate-600"
        }`}
      >
        {program.thumbnailUrl ? (
          <img
            src={program.thumbnailUrl}
            alt={program.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Code className="w-12 h-12 text-white/50" />
          </div>
        )}
        {program.isFeatured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {languageLabels[program.language] || program.language}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {ageGroupLabels[program.ageGroup] || program.ageGroup}
          </span>
        </div>

        <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
          {program.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {program.shortDescription || program.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {program.sessionCount} sessions
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {program._count.enrollments} enrolled
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-2xl font-bold">{formatPrice(program.priceCents)}</span>
            {program.originalPriceCents && (
              <span className="text-sm text-slate-400 line-through ml-2">
                {formatPrice(program.originalPriceCents)}
              </span>
            )}
          </div>
          <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Learn More →
          </span>
        </div>
      </div>
    </Link>
  );
}
