import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const role =
    typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // First try to find by studentProfile ID
    let studentProfile = await prisma.studentProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            enrollments: {
              include: {
                course: {
                  include: {
                    lessons: true,
                  },
                },
                progress: true,
              },
            },
            badges: {
              include: {
                badge: true,
              },
            },
          },
        },
        guardian: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // If not found, try by user ID
    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
              enrollments: {
                include: {
                  course: {
                    include: {
                      lessons: true,
                    },
                  },
                  progress: true,
                },
              },
              badges: {
                include: {
                  badge: true,
                },
              },
            },
          },
          guardian: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }

    if (!studentProfile) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get certificates
    const certificates = await prisma.certificate.findMany({
      where: {
        enrollment: {
          userId: studentProfile.user.id,
        },
      },
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
      },
    });

    // Calculate age from DOB
    let age: number | undefined;
    if (studentProfile.dob) {
      const now = new Date();
      const dob = new Date(studentProfile.dob);
      age = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
        age--;
      }
    } else if (studentProfile.age) {
      age = studentProfile.age;
    }

    // Transform enrollments with progress calculation
    const enrollments = studentProfile.user.enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = enrollment.progress.filter((p) => p.completed).length;
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Get last activity
      const lastProgress = enrollment.progress
        .filter((p) => p.completedAt)
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0];

      return {
        id: enrollment.id,
        courseTitle: enrollment.course.title,
        enrolledAt: enrollment.enrolledAt.toISOString(),
        progress,
        lessonsCompleted: completedLessons,
        totalLessons,
        lastActivity: lastProgress?.completedAt?.toISOString(),
      };
    });

    // Transform badges
    const badges = studentProfile.user.badges.map((ub) => ({
      id: ub.id,
      name: ub.badge.name,
      description: ub.badge.description || "",
      earnedAt: ub.awardedAt.toISOString(),
      icon: ub.badge.icon,
    }));

    // Transform certificates
    const transformedCertificates = certificates.map((cert) => ({
      id: cert.id,
      courseName: cert.enrollment.course.title,
      issuedAt: cert.issuedAt.toISOString(),
    }));

    // Build activity log from progress
    const activityLog: { action: string; details: string; timestamp: string }[] = [];

    for (const enrollment of studentProfile.user.enrollments) {
      for (const progress of enrollment.progress) {
        if (progress.completed && progress.completedAt) {
          activityLog.push({
            action: "Completed Lesson",
            details: `In course: ${enrollment.course.title}`,
            timestamp: progress.completedAt.toISOString(),
          });
        }
      }
    }

    // Add badge awards to activity
    for (const badge of studentProfile.user.badges) {
      activityLog.push({
        action: "Earned Badge",
        details: badge.badge.name,
        timestamp: badge.awardedAt.toISOString(),
      });
    }

    // Sort activity by timestamp
    activityLog.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const student = {
      id: studentProfile.id,
      userId: studentProfile.user.id,
      name: studentProfile.name || studentProfile.user.name || "Unknown",
      email: studentProfile.user.email,
      avatar: studentProfile.avatar || studentProfile.user.image,
      age,
      joinedAt: studentProfile.user.createdAt.toISOString(),
      parentEmail: studentProfile.guardian?.user?.email || studentProfile.parentEmail,
      parentName: studentProfile.guardian?.user?.name,
      totalXp: studentProfile.totalXp || 0,
      currentLevel: studentProfile.currentLevel || 1,
      enrollments,
      badges,
      certificates: transformedCertificates,
      quizScores: [], // Would need quiz results table
      activityLog: activityLog.slice(0, 20), // Limit to 20 most recent
    };

    return NextResponse.json({ student });
  } catch (error) {
    console.error("[StudentDetails] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch student details" },
      { status: 500 }
    );
  }
}
