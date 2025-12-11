import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import AdminOverview from "../../../components/admin/AdminOverview";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  demoUsersRaw,
  demoStudentsRaw,
  demoCoursesRaw,
  demoParentsRaw,
} from "../../../lib/demo-data";

export const dynamic = "force-dynamic";

const ageGroupLabel: Record<string, string> = {
  AGES_7_10: "7-10",
  AGES_11_14: "11-14",
  AGES_15_18: "15-18",
};

function formatDate(date: Date | null): string {
  if (!date) return "N/A";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}

function toTitle(value: string | null | undefined): string {
  if (!value) return "N/A";
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function ageFromDob(dob: Date | null): number | null {
  if (!dob) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return redirect("/auth/login");
  }

  const hasDbUrl = Boolean(process.env.DATABASE_URL);
  let warning: string | null = null;

  let usersRaw: any[] = [];
  let studentsRaw: any[] = [];
  let coursesRaw: any[] = [];
  let parentsRaw: any[] = [];
  let programsCount = 0;

  if (hasDbUrl) {
    try {
      [usersRaw, studentsRaw, coursesRaw, parentsRaw, programsCount] = await Promise.all([
        prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, email: true, role: true, createdAt: true },
        }),
        prisma.studentProfile.findMany({
          orderBy: { user: { createdAt: "desc" } },
          select: {
            id: true,
            name: true,
            age: true,
            dob: true,
            totalXp: true,
            currentLevel: true,
            parentEmail: true,
            user: { select: { email: true, name: true, createdAt: true } },
            guardian: { select: { user: { select: { email: true } } } },
          },
        }),
        prisma.course.findMany({
          orderBy: { title: "asc" },
          select: { id: true, title: true, language: true, level: true, ageGroup: true, isPublished: true },
        }),
        prisma.parentProfile.findMany({
          orderBy: { user: { createdAt: "desc" } },
          select: {
            id: true,
            phone: true,
            address: true,
            user: { select: { name: true, email: true } },
            _count: { select: { children: true } },
          },
        }),
        prisma.program.count(),
      ]);
    } catch (error) {
      console.error("Admin dashboard data load failed; falling back to demo data", error);
      warning =
        "Database unavailable or misconfigured (check DATABASE_URL). Showing demo admin data instead.";
      usersRaw = demoUsersRaw;
      studentsRaw = demoStudentsRaw;
      coursesRaw = demoCoursesRaw;
      parentsRaw = demoParentsRaw;
      programsCount = 0;
    }
  } else {
    warning = "DATABASE_URL is not set. Showing demo admin data instead.";
  }

  const users = usersRaw.map((u) => ({
    id: u.id,
    name: u.name || "Unnamed",
    email: u.email,
    type: u.role.toLowerCase(),
    joined: formatDate(u.createdAt),
  }));

  const students = studentsRaw.map((s) => {
    const age = s.age ?? ageFromDob(s.dob);
    const username = s.user.email?.split("@")[0] || "unknown";
    const parentEmail = s.parentEmail || s.guardian?.user?.email || "N/A";
    return {
      id: s.id,
      name: s.name || s.user.name || "Student",
      username,
      age: age ? String(age) : "N/A",
      parentEmail,
      xp: s.totalXp ?? 0,
      level: s.currentLevel ?? 1,
    };
  });

  const courses = coursesRaw.map((c) => ({
    id: c.id,
    title: c.title,
    language: toTitle(c.language),
    level: toTitle(c.level),
    ageGroup: ageGroupLabel[c.ageGroup] ?? c.ageGroup ?? "N/A",
    status: c.isPublished ? "Published" : "Draft",
  }));

  const parents = parentsRaw.map((p) => ({
    id: p.id,
    name: p.user?.name || "Parent",
    email: p.user?.email || "N/A",
    phone: p.phone || "N/A",
    address: p.address || "N/A",
    childrenCount: p._count?.children ?? 0,
  }));

  const studentCount = students.length > 0 ? students.length : users.filter((u) => u.type === "student").length;

  const stats = {
    totalParents: users.filter((u) => u.type === "parent").length,
    totalStudents: studentCount,
    instructors: users.filter((u) => u.type === "instructor").length,
    programs: programsCount,
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Dashboard</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
        </div>
        <AdminOverview
          stats={stats}
          recentUsers={users}
          totalUsers={users.length}
          totalCourses={courses.length}
          warning={warning}
        />
      </div>
    </AdminLayout>
  );
}
