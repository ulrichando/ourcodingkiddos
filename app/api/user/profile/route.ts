import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';
import { logger } from '../../../../lib/logger';

/**
 * GET /api/user/profile
 * Fetch user profile including lastSeen timestamp
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get email from query params or use session email
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || session.user.email;

    // Only allow users to view their own profile unless they're admin
    if (email !== session.user.email && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        accountStatus: true,
        lastSeen: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      accountStatus: user.accountStatus,
      lastSeen: user.lastSeen?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error) {
    logger.api.error('Failed to fetch user profile', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
