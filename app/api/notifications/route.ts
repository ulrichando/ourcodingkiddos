import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export type NotificationType = "achievement" | "streak" | "class_reminder" | "progress" | "system" | "student_added" | "course_started" | "course_completed" | "welcome";

export type Notification = {
  id: string;
  userEmail: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
  metadata?: Record<string, any>;
};

// In-memory storage (in production, use database)
let notifications: Notification[] = [];

// Helper to create notification
export function createNotification(
  userEmail: string,
  title: string,
  message: string,
  type: NotificationType,
  link?: string,
  metadata?: Record<string, any>
): Notification {
  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userEmail: userEmail.toLowerCase(),
    title,
    message,
    type,
    isRead: false,
    link,
    createdAt: new Date().toISOString(),
    metadata,
  };

  notifications.unshift(notification); // Add to beginning

  // Keep only last 100 notifications per user
  const userNotifications = notifications.filter(n => n.userEmail === userEmail.toLowerCase());
  if (userNotifications.length > 100) {
    const oldestId = userNotifications[userNotifications.length - 1].id;
    notifications = notifications.filter(n => n.id !== oldestId);
  }

  return notification;
}

// GET - Fetch notifications for current user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email.toLowerCase();
  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unreadOnly") === "true";
  const limit = parseInt(searchParams.get("limit") || "50");

  // Filter notifications for this user
  let userNotifications = notifications.filter(n => n.userEmail === userEmail);

  if (unreadOnly) {
    userNotifications = userNotifications.filter(n => !n.isRead);
  }

  // Limit results
  userNotifications = userNotifications.slice(0, limit);

  return NextResponse.json({
    notifications: userNotifications,
    unreadCount: notifications.filter(n => n.userEmail === userEmail && !n.isRead).length
  });
}

// POST - Create a new notification or mark as read
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, notificationId, notificationIds } = body;

  // Mark single notification as read
  if (action === "markRead" && notificationId) {
    const notification = notifications.find(n => n.id === notificationId && n.userEmail === session.user.email.toLowerCase());
    if (notification) {
      notification.isRead = true;
    }
    return NextResponse.json({ success: true });
  }

  // Mark all notifications as read
  if (action === "markAllRead") {
    notifications.forEach(n => {
      if (n.userEmail === session.user.email.toLowerCase()) {
        n.isRead = true;
      }
    });
    return NextResponse.json({ success: true });
  }

  // Mark multiple as read
  if (action === "markMultipleRead" && Array.isArray(notificationIds)) {
    notifications.forEach(n => {
      if (n.userEmail === session.user.email.toLowerCase() && notificationIds.includes(n.id)) {
        n.isRead = true;
      }
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// DELETE - Delete notification
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const notificationId = searchParams.get("id");

  if (!notificationId) {
    return NextResponse.json({ error: "Missing notification ID" }, { status: 400 });
  }

  const userEmail = session.user.email.toLowerCase();
  const initialLength = notifications.length;

  notifications = notifications.filter(n => !(n.id === notificationId && n.userEmail === userEmail));

  if (notifications.length === initialLength) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
