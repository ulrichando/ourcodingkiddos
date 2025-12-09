import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { CurriculumContent } from "./CurriculumContent";

export const metadata: Metadata = {
  title: "Coding Curriculum - Structured Learning Paths | Coding Kiddos",
  description:
    "Explore our structured coding curriculum for kids and teens ages 7-18. From beginner to advanced, learn Python, Web Development, Game Design, AI & more with live instruction.",
  keywords: [
    "coding curriculum for kids",
    "kids coding classes",
    "learn to code",
    "coding bootcamp for kids",
    "python for kids",
    "web development for teens",
  ],
  openGraph: {
    title: "Coding Curriculum - Coding Kiddos",
    description:
      "Structured learning paths from beginner to advanced. Live instruction, hands-on projects, certificates.",
    url: "https://ourcodingkiddos.com/curriculum",
    type: "website",
  },
};

async function getPrograms() {
  const programs = await prisma.program.findMany({
    where: { isPublished: true },
    include: {
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: [{ level: "asc" }, { orderIndex: "asc" }, { createdAt: "asc" }],
  });
  return programs;
}

async function getClassSessions() {
  const now = new Date();
  const sessions = await prisma.classSession.findMany({
    where: {
      startTime: { gte: now },
      status: "SCHEDULED",
    },
    orderBy: { startTime: "asc" },
    take: 20,
  });
  return sessions;
}

export default async function CurriculumPage() {
  const [programs, sessions] = await Promise.all([
    getPrograms(),
    getClassSessions(),
  ]);

  return <CurriculumContent programs={programs} sessions={sessions} />;
}
