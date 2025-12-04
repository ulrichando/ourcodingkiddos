import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/showcase - List approved student projects (public) or all projects (for student's own)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const userRole = (session?.user as any)?.role;
    const isAdmin = userRole === "ADMIN";

    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");
    const featured = searchParams.get("featured");
    const myProjects = searchParams.get("my") === "true";
    const limit = searchParams.get("limit");
    const page = searchParams.get("page") || "1";

    const where: any = {};

    // For public viewing, only show approved and published projects
    if (!isAdmin && !myProjects) {
      where.isApproved = true;
      where.isPublished = true;
    }

    // For student viewing their own projects
    if (myProjects && userEmail) {
      const studentProfile = await prisma.studentProfile.findFirst({
        where: { user: { email: userEmail } },
      });
      if (studentProfile) {
        where.studentProfileId = studentProfile.id;
        // Students can see all their own projects, not just approved ones
        delete where.isApproved;
        delete where.isPublished;
      }
    }

    if (language) {
      where.language = language;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const take = limit ? parseInt(limit) : 12;
    const skip = (parseInt(page) - 1) * take;

    const [projects, total] = await Promise.all([
      prisma.studentProject.findMany({
        where,
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
        take,
        skip,
      }),
      prisma.studentProject.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST /api/showcase - Submit a new project (students only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in to submit a project" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;

    // Only students (or their parents on their behalf) can submit projects
    if (!["STUDENT", "PARENT", "ADMIN"].includes(userRole)) {
      return NextResponse.json({ error: "Only students can submit projects" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      githubUrl,
      demoUrl,
      thumbnailUrl,
      videoUrl,
      language,
      tags,
      studentProfileId, // Required if parent is submitting for a child
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Validate GitHub URL format
    if (githubUrl && !githubUrl.match(/^https?:\/\/(www\.)?github\.com\/.+/)) {
      return NextResponse.json(
        { error: "Please provide a valid GitHub URL" },
        { status: 400 }
      );
    }

    // Determine which student profile to use
    let profileId = studentProfileId;

    if (!profileId) {
      // If student is submitting themselves, find their profile
      const studentProfile = await prisma.studentProfile.findFirst({
        where: { user: { email: session.user.email } },
      });

      if (!studentProfile) {
        return NextResponse.json(
          { error: "Student profile not found" },
          { status: 404 }
        );
      }
      profileId = studentProfile.id;
    } else {
      // If parent/admin is submitting for a student, verify they have access
      if (userRole === "PARENT") {
        const parentProfile = await prisma.parentProfile.findFirst({
          where: { user: { email: session.user.email } },
          include: { children: true },
        });

        const hasAccess = parentProfile?.children.some((c) => c.id === profileId);
        if (!hasAccess) {
          return NextResponse.json(
            { error: "You can only submit projects for your own children" },
            { status: 403 }
          );
        }
      }
    }

    const project = await prisma.studentProject.create({
      data: {
        studentProfileId: profileId,
        title,
        description,
        githubUrl,
        demoUrl,
        thumbnailUrl,
        videoUrl,
        language,
        tags: tags || [],
        isPublished: true, // Student submits it
        isApproved: false, // Needs admin approval for public showcase
        isFeatured: false,
      },
      include: {
        studentProfile: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to submit project" }, { status: 500 });
  }
}
