import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { logger } from "../../../../lib/logger";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role =
    typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Aggregate notifications from multiple sources
    const notifications: any[] = [];

    // 1. Get pending support tickets
    const pendingTickets = await prisma.supportTicket.findMany({
      where: {
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        subject: true,
        priority: true,
        status: true,
        createdAt: true,
      },
    });

    for (const ticket of pendingTickets) {
      notifications.push({
        id: `ticket-${ticket.id}`,
        type: "ticket",
        title: "Support Ticket",
        message: ticket.subject,
        timestamp: ticket.createdAt.toISOString(),
        read: false,
        link: `/dashboard/admin/support-tickets?id=${ticket.id}`,
        priority: ticket.priority === "URGENT" || ticket.priority === "HIGH" ? "high" : "medium",
      });
    }

    // 2. Get pending class requests
    const pendingRequests = await prisma.classRequest.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    for (const request of pendingRequests) {
      notifications.push({
        id: `request-${request.id}`,
        type: "request",
        title: "Class Request Pending",
        message: `${request.parentName || request.parentEmail} requested a ${request.requestedTopic} session`,
        timestamp: request.createdAt.toISOString(),
        read: false,
        link: `/dashboard/admin/class-requests?id=${request.id}`,
        priority: "medium",
      });
    }

    // 3. Get recent enrollments (last 24 hours)
    const recentEnrollments = await prisma.enrollment.findMany({
      where: {
        startedAt: { gte: oneDayAgo },
      },
      orderBy: { startedAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    });

    for (const enrollment of recentEnrollments) {
      notifications.push({
        id: `enrollment-${enrollment.id}`,
        type: "enrollment",
        title: "New Enrollment",
        message: `${enrollment.user.name || enrollment.user.email} enrolled in ${enrollment.course.title}`,
        timestamp: enrollment.startedAt.toISOString(),
        read: true, // Mark enrollments as read by default
        link: `/dashboard/admin/users`,
        priority: "low",
      });
    }

    // 4. Get recent payments (last 7 days)
    const recentPayments = await prisma.payment.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: "SUCCEEDED",
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    for (const payment of recentPayments) {
      notifications.push({
        id: `payment-${payment.id}`,
        type: "payment",
        title: "Payment Received",
        message: `$${(payment.amount / 100).toFixed(2)} from ${payment.user.name || payment.user.email}`,
        timestamp: payment.createdAt.toISOString(),
        read: true,
        link: `/dashboard/admin/finance`,
        priority: "low",
      });
    }

    // 5. Get showcase projects pending approval
    const pendingProjects = await prisma.studentProject.findMany({
      where: {
        isApproved: false,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        studentProfile: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    for (const project of pendingProjects) {
      notifications.push({
        id: `project-${project.id}`,
        type: "alert",
        title: "Project Needs Approval",
        message: `"${project.title}" by ${project.studentProfile?.user?.name || "a student"} is pending review`,
        timestamp: project.createdAt.toISOString(),
        read: false,
        link: `/dashboard/admin/showcase?id=${project.id}`,
        priority: "medium",
      });
    }

    // Sort by timestamp (newest first) and unread first
    notifications.sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return NextResponse.json({
      notifications: notifications.slice(0, 20),
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    logger.db.error("Failed to fetch notifications", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications", notifications: [] },
      { status: 500 }
    );
  }
}
