import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Get the student's user record
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all badges and the user's earned badges
    const [allBadges, userBadges] = await Promise.all([
      prisma.badge.findMany({
        orderBy: [
          { rarity: 'desc' },
          { category: 'asc' },
          { name: 'asc' }
        ],
      }),
      prisma.userBadge.findMany({
        where: { userId: user.id },
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
    console.error("GET /api/student/badges error:", error);
    return NextResponse.json(
      { error: "Failed to fetch badges" },
      { status: 500 }
    );
  }
}
