import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import ContentManagerView from "../../../../components/admin/ContentManagerView";
import AdminLayout from "../../../../components/admin/AdminLayout";
import fs from "fs/promises";
import path from "path";
import { courses as fallbackCourses } from "../../../../data/courses";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string" ? ((session?.user as any).role as string).toUpperCase() : null;
  if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
    return redirect("/auth/login");
  }

  let courses = [];
  let dbError = false;
  try {
    courses = await prisma.course.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        language: true,
        level: true,
        ageGroup: true,
        isPublished: true,
        totalXp: true,
      },
    });
  } catch {
    dbError = true;
    courses = [];
  }

  const homePath = role === "ADMIN" ? "/dashboard/admin" : "/dashboard/instructor";

  return (
    <AdminLayout>
      <ContentManagerView courses={courses} homePath={homePath} dbError={dbError} />
    </AdminLayout>
  );
}
