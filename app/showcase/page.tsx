import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Eye, Heart, MessageCircle, Github, ExternalLink, Star, Code2, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Student Showcase - Amazing Projects by Young Coders",
  description: "Explore incredible coding projects created by our talented students. See what kids can build when they learn to code with Our Coding Kiddos.",
  keywords: ["student projects", "kids coding projects", "coding showcase", "learn to code", "young programmers"],
  openGraph: {
    title: "Student Showcase - Our Coding Kiddos",
    description: "Amazing projects built by our talented young coders.",
    url: "https://ourcodingkiddos.com/showcase",
    type: "website",
  },
};

const languageLabels: Record<string, { label: string; color: string }> = {
  HTML: { label: "HTML & CSS", color: "from-orange-500 to-red-500" },
  CSS: { label: "CSS", color: "from-blue-400 to-blue-600" },
  JAVASCRIPT: { label: "JavaScript", color: "from-yellow-400 to-orange-500" },
  PYTHON: { label: "Python", color: "from-blue-500 to-green-500" },
  ROBLOX: { label: "Roblox", color: "from-red-500 to-red-700" },
  AI_ML: { label: "AI & ML", color: "from-purple-500 to-indigo-600" },
  GAME_DEVELOPMENT: { label: "Game Dev", color: "from-green-500 to-teal-500" },
  WEB_DEVELOPMENT: { label: "Web Dev", color: "from-cyan-500 to-blue-500" },
};

const ageGroupLabels: Record<string, string> = {
  AGES_7_10: "Ages 7-10",
  AGES_11_14: "Ages 11-14",
  AGES_15_18: "Ages 15-18",
};

async function getProjects() {
  const projects = await prisma.studentProject.findMany({
    where: {
      isApproved: true,
      isPublished: true,
    },
    include: {
      studentProfile: {
        select: {
          id: true,
          name: true,
          avatar: true,
          ageGroup: true,
        },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
  return projects;
}

export default async function ShowcasePage() {
  const projects = await getProjects();
  const featuredProjects = projects.filter((p) => p.isFeatured);
  const regularProjects = projects.filter((p) => !p.isFeatured);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 text-center bg-gradient-to-b from-purple-50 via-white to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-900">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-semibold">
            <Rocket className="w-4 h-4" />
            Student Showcase
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
            Amazing Projects by{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Young Coders
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            See what our talented students have built! From websites to games to AI projects,
            discover the incredible work created by kids learning to code.
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.slice(0, 4).map((project) => (
                <FeaturedProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects */}
      <section className="py-12 px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">All Projects</h2>
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <Code2 className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No projects yet. Be the first to share your creation!
              </p>
              <Link
                href="/dashboard/student"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:brightness-110 transition"
              >
                Submit Your Project
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Own Project?</h2>
          <p className="text-lg text-white/80 mb-8">
            Join Our Coding Kiddos and start creating amazing things with code!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition"
            >
              Browse Programs
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    githubUrl: string | null;
    demoUrl: string | null;
    thumbnailUrl: string | null;
    language: string | null;
    tags: any;
    isFeatured: boolean;
    viewCount: number;
    createdAt: Date;
    studentProfile: {
      id: string;
      name: string | null;
      avatar: string | null;
      ageGroup: string | null;
    };
    _count: { comments: number; likes: number };
  };
}

function ProjectCard({ project }: ProjectCardProps) {
  const langInfo = project.language ? languageLabels[project.language] : null;

  return (
    <Link
      href={`/showcase/${project.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Thumbnail */}
      <div
        className={`relative h-48 bg-gradient-to-br ${
          langInfo?.color || "from-purple-500 to-pink-500"
        }`}
      >
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Code2 className="w-16 h-16 text-white/50" />
          </div>
        )}
        {langInfo && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-slate-700">
              {langInfo.label}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          {project.githubUrl && (
            <span className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
              <Github className="w-4 h-4 text-slate-700" />
            </span>
          )}
          {project.demoUrl && (
            <span className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
              <ExternalLink className="w-4 h-4 text-slate-700" />
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Creator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
            {project.studentProfile.avatar ? (
              <img
                src={project.studentProfile.avatar}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              project.studentProfile.name?.charAt(0) || "S"
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {project.studentProfile.name || "Young Coder"}
            </div>
            {project.studentProfile.ageGroup && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {ageGroupLabels[project.studentProfile.ageGroup]}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {project.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {project._count.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {project._count.comments}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedProjectCard({ project }: ProjectCardProps) {
  const langInfo = project.language ? languageLabels[project.language] : null;

  return (
    <Link
      href={`/showcase/${project.id}`}
      className="group block overflow-hidden rounded-2xl border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="md:flex">
        {/* Thumbnail */}
        <div
          className={`relative md:w-2/5 h-48 md:h-auto bg-gradient-to-br ${
            langInfo?.color || "from-purple-500 to-pink-500"
          }`}
        >
          {project.thumbnailUrl ? (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 className="w-16 h-16 text-white/50" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-3/5 p-6">
          {langInfo && (
            <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mb-3">
              {langInfo.label}
            </span>
          )}
          <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {project.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Creator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
              {project.studentProfile.name?.charAt(0) || "S"}
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {project.studentProfile.name || "Young Coder"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {project._count.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {project._count.comments}
            </span>
            {project.githubUrl && (
              <span className="flex items-center gap-1">
                <Github className="w-4 h-4" />
                GitHub
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
