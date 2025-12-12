import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: studentProfileId } = await params;
    const userEmail = session.user.email;
    const userRole = (session as any)?.user?.role?.toUpperCase();

    // Get the student profile with user info
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        guardian: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Authorization check
    const isParent = studentProfile.guardian?.user?.email === userEmail;
    const isAdmin = userRole === "ADMIN";
    const isInstructor = userRole === "INSTRUCTOR";
    const isSelf = studentProfile.user?.email === userEmail;

    if (!isParent && !isAdmin && !isInstructor && !isSelf) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = studentProfile.userId;

    // Get all badges and the student's earned badges
    const [allBadges, userBadges] = await Promise.all([
      prisma.badge.findMany({
        orderBy: [
          { rarity: 'desc' },
          { category: 'asc' },
          { name: 'asc' }
        ],
      }),
      prisma.userBadge.findMany({
        where: { userId },
        include: {
          badge: true,
        },
      }),
    ]);

    // Create a map of earned badge IDs
    const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));
    const earnedBadgeMap = new Map(
      userBadges.map((ub) => [ub.badgeId, ub.awardedAt.toISOString()])
    );

    // Combine all badges with earned status
    const badges = allBadges.map((badge) => ({
      id: badge.id,
      key: badge.key,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      category: badge.category,
      requirementType: badge.requirementType,
      requirementValue: badge.requirementValue,
      rarity: badge.rarity,
      isEarned: earnedBadgeIds.has(badge.id),
      awardedAt: earnedBadgeMap.get(badge.id) || null,
    }));

    return NextResponse.json({ badges });
  } catch (error) {
    console.error("GET /api/students/[id]/badges error:", error);
    return NextResponse.json(
      { error: "Failed to fetch badges" },
      { status: 500 }
    );
  }
}
