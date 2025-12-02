import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { logCreate, logUpdate } from "../../../lib/audit";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate unique ticket number
function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKT-${timestamp}${random}`;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const userRole = (session as any)?.user?.role?.toUpperCase();

    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("id");

    // Get single ticket with replies
    if (ticketId) {
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: {
          replies: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      }

      // Check permissions
      if (userRole !== "ADMIN" && ticket.userEmail !== userEmail) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.json({ ticket });
    }

    // Get list of tickets
    let tickets;

    if (userRole === "ADMIN") {
      // Admins see all tickets
      tickets = await prisma.supportTicket.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { replies: true }
          }
        }
      });
    } else {
      // Users see only their tickets
      tickets = await prisma.supportTicket.findMany({
        where: { userEmail },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { replies: true }
          }
        }
      });
    }

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error("GET /api/support-tickets error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const userName = session.user.name;
    const userRole = (session as any)?.user?.role?.toUpperCase() || "PARENT";

    const body = await req.json();
    const {
      action,
      ticketId,
      subject,
      description,
      category,
      priority,
      message,
      isInternal,
      attachmentName
    } = body;

    // Create new ticket
    if (action === "create" || !ticketId) {
      if (!subject || !description) {
        return NextResponse.json({ error: "Subject and description are required" }, { status: 400 });
      }

      const ticketNumber = generateTicketNumber();

      const ticket = await prisma.supportTicket.create({
        data: {
          ticketNumber,
          userEmail,
          userRole: userRole as any,
          userName,
          subject,
          description,
          category: category?.toUpperCase() || "GENERAL",
          priority: priority?.toUpperCase() || "MEDIUM",
          status: "OPEN"
        }
      });

      // Log ticket creation
      logCreate(
        userEmail,
        "SupportTicket",
        ticket.id,
        `Created support ticket: ${ticketNumber} - ${subject}`,
        (session as any).user?.id,
        { category: ticket.category, priority: ticket.priority, userRole }
      ).catch(() => {});

      return NextResponse.json({ success: true, ticket });
    }

    // Add reply to existing ticket
    if (action === "reply" && ticketId && message) {
      const reply = await prisma.ticketReply.create({
        data: {
          ticketId,
          fromEmail: userEmail,
          fromRole: userRole as any,
          fromName: userName,
          message,
          attachmentName,
          isInternal: isInternal || false
        }
      });

      // Update ticket timestamp
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
          updatedAt: new Date(),
          status: userRole === "ADMIN" ? "IN_PROGRESS" : "WAITING_FOR_CUSTOMER"
        }
      });

      // Log reply
      logUpdate(
        userEmail,
        "SupportTicket",
        ticketId,
        `Added reply to ticket${isInternal ? " (internal note)" : ""}`,
        (session as any).user?.id,
        { userRole, isInternal: isInternal || false }
      ).catch(() => {});

      return NextResponse.json({ success: true, reply });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/support-tickets error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const userName = session.user.name;
    const userRole = (session as any)?.user?.role?.toUpperCase();

    // Only admins can update ticket status/assignment
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      status,
      priority,
      assignedToEmail,
      assignedToName
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (status) {
      updateData.status = status;
      if (status === "RESOLVED") updateData.resolvedAt = new Date();
      if (status === "CLOSED") updateData.closedAt = new Date();
    }

    if (priority) updateData.priority = priority;
    if (assignedToEmail !== undefined) updateData.assignedToEmail = assignedToEmail;
    if (assignedToName !== undefined) updateData.assignedToName = assignedToName;

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: updateData
    });

    // Log ticket update
    const changes = [];
    if (status) changes.push(`status: ${status}`);
    if (priority) changes.push(`priority: ${priority}`);
    if (assignedToName) changes.push(`assigned to: ${assignedToName}`);

    logUpdate(
      userEmail,
      "SupportTicket",
      id,
      `Updated ticket: ${changes.join(", ")}`,
      (session as any).user?.id,
      { status, priority, assignedToEmail, assignedToName }
    ).catch(() => {});

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error("PATCH /api/support-tickets error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
