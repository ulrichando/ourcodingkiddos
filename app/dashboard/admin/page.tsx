import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import AdminDashboardShell from "../../../components/admin/AdminDashboardShell";
import {
  demoUsersRaw,
  demoStudentsRaw,
  demoCoursesRaw,
  demoSubscriptionsRaw,
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
  let subscriptionsRaw: any[] = [];
  let parentsRaw: any[] = [];

  if (hasDbUrl) {
    try {
      [usersRaw, studentsRaw, coursesRaw, subscriptionsRaw, parentsRaw] = await Promise.all([
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
        prisma.subscription.findMany({
          orderBy: { currentPeriodStart: "desc" },
          include: { user: { select: { email: true } } },
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
      ]);
    } catch (error) {
      console.error("Admin dashboard data load failed; falling back to demo data", error);
      warning =
        "Database unavailable or misconfigured (check DATABASE_URL). Showing demo admin data instead.";
      usersRaw = demoUsersRaw;
      studentsRaw = demoStudentsRaw;
      coursesRaw = demoCoursesRaw;
      subscriptionsRaw = demoSubscriptionsRaw;
      parentsRaw = demoParentsRaw;
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

  const subscriptions = subscriptionsRaw.map((s) => ({
    id: s.id,
    parentEmail: s.parentEmail || s.user.email || "N/A",
    plan: s.planType ? toTitle(s.planType) : "N/A",
    status: s.status.toLowerCase(),
    price: typeof s.priceCents === "number" ? `$${(s.priceCents / 100).toFixed(0)}/mo` : "$0/mo",
    endDate: formatDate(s.endDate ?? s.currentPeriodEnd ?? null),
  }));

  // If no subscriptions, create a demo one so demo data reflects active plan
  const subscriptionsWithFallback =
    subscriptions.length > 0
      ? subscriptions
      : [
          {
            id: "demo-sub",
            parentEmail: "demo.parent@ourcodingkiddos.com",
            plan: "Monthly",
            status: "active",
            price: "$29/mo",
            endDate: "—",
          },
        ];

  const parents = parentsRaw.map((p) => ({
    id: p.id,
    name: p.user?.name || "Parent",
    email: p.user?.email || "N/A",
    phone: p.phone || "N/A",
    address: p.address || "N/A",
    childrenCount: p._count?.children ?? 0,
  }));

  const studentCount = students.length > 0 ? students.length : users.filter((u) => u.type === "student").length;
  const activeSubsCount = subscriptionsWithFallback.filter((s) => s.status === "active").length;

  const stats = {
    totalParents: users.filter((u) => u.type === "parent").length,
    totalStudents: studentCount,
    instructors: users.filter((u) => u.type === "instructor").length,
    activeSubs: activeSubsCount,
  };

  return (
    <AdminDashboardShell
      userEmail={session.user.email}
      stats={stats}
      users={users}
      parents={parents}
      students={students}
      courses={courses}
      subscriptions={subscriptionsWithFallback}
      warning={warning}
    />
  );
}
