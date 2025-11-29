import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import AdminDashboardShell from "../../../components/admin/AdminDashboardShell";

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
  const role = typeof (session?.user as any)?.role === "string" ? ((session?.user as any).role as string).toUpperCase() : null;
  if (!session?.user || role !== "ADMIN") {
    return redirect("/auth/login");
  }

  const useDemo = process.env.NEXT_PUBLIC_USE_DEMO_DATA === "true";
  const hasDbUrl = Boolean(process.env.DATABASE_URL);
  let warning: string | null = null;

  const demoUsersRaw = [
    { id: "u1", name: "Ghislain Ulrich", email: "ghislainulrich007@gmail.com", role: "PARENT", createdAt: new Date("2025-11-26") },
    { id: "u2", name: "Ando Ulrich", email: "ulrichando007@gmail.com", role: "ADMIN", createdAt: new Date("2025-11-26") },
  ];
  const demoStudentsRaw = [
    {
      id: "s1",
      name: "Emma",
      age: 10,
      dob: null,
      totalXp: 1250,
      currentLevel: 3,
      parentEmail: "test@parent.com",
      user: { email: "emma2024@example.com", name: "Emma", createdAt: new Date("2025-11-26") },
      guardian: { user: { email: "test@parent.com" } },
    },
    {
      id: "s2",
      name: "Jake",
      age: 13,
      dob: null,
      totalXp: 800,
      currentLevel: 2,
      parentEmail: "test@parent.com",
      user: { email: "jake2024@example.com", name: "Jake", createdAt: new Date("2025-11-26") },
      guardian: { user: { email: "test@parent.com" } },
    },
  ];
  const demoCoursesRaw = [
    { id: "c1", title: "HTML Basics for Kids", language: "HTML", level: "BEGINNER", ageGroup: "AGES_7_10", isPublished: true },
    { id: "c2", title: "CSS Magic: Style Your Pages", language: "CSS", level: "BEGINNER", ageGroup: "AGES_7_10", isPublished: true },
    { id: "c3", title: "JavaScript Adventures", language: "JAVASCRIPT", level: "BEGINNER", ageGroup: "AGES_11_14", isPublished: true },
    { id: "c4", title: "Python for Young Coders", language: "PYTHON", level: "BEGINNER", ageGroup: "AGES_11_14", isPublished: true },
    { id: "c5", title: "Roblox Game Creator", language: "ROBLOX", level: "BEGINNER", ageGroup: "AGES_11_14", isPublished: true },
    { id: "c6", title: "Advanced Web Development", language: "JAVASCRIPT", level: "INTERMEDIATE", ageGroup: "AGES_15_18", isPublished: true },
  ];
  const demoParentsRaw = [
    { id: "p1", phone: "555-1234", address: "123 Demo St", user: { name: "Ghislain Ulrich", email: "ghislainulrich007@gmail.com" }, _count: { children: 1 } },
    { id: "p2", phone: "555-4321", address: "456 Sample Ave", user: { name: "Ando Ulrich", email: "ulrichando007@gmail.com" }, _count: { children: 1 } },
  ];
  const demoSubscriptionsRaw = [
    {
      id: "sub1",
      parentEmail: "ulrichando007@gmail.com",
      planType: "FAMILY",
      status: "ACTIVE",
      priceCents: 0,
      endDate: null,
      currentPeriodEnd: new Date("2025-12-31"),
      user: { email: "ulrichando007@gmail.com" },
    },
    {
      id: "sub2",
      parentEmail: "test@parent.com",
      planType: "MONTHLY",
      status: "ACTIVE",
      priceCents: 2900,
      endDate: new Date("2025-12-01"),
      currentPeriodEnd: new Date("2025-12-01"),
      user: { email: "test@parent.com" },
    },
  ];

  let usersRaw = demoUsersRaw;
  let studentsRaw = demoStudentsRaw;
  let coursesRaw = demoCoursesRaw;
  let subscriptionsRaw = demoSubscriptionsRaw;
  let parentsRaw = demoParentsRaw;

  if (hasDbUrl && !useDemo) {
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
  } else if (!hasDbUrl) {
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
