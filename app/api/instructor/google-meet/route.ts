import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { google } from "googleapis";

// Helper to refresh Google access token
async function refreshAccessToken(refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials.access_token;
  } catch (error) {
    console.error("[google-meet] Failed to refresh token:", error);
    return null;
  }
}

// POST - Create a Google Meet link for a class session
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only instructors and admins can create Meet links
    const userRole = (session as any).user?.role;
    if (!["INSTRUCTOR", "ADMIN"].includes(userRole)) {
      return NextResponse.json(
        { error: "Only instructors can create meeting links" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, startTime, durationMinutes } = body;

    if (!title || !startTime || !durationMinutes) {
      return NextResponse.json(
        { error: "Title, start time, and duration are required" },
        { status: 400 }
      );
    }

    // Get the user's Google OAuth account
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: {
          where: { provider: "google" },
        },
      },
    });

    if (!user?.accounts?.[0]) {
      return NextResponse.json(
        {
          error: "Google account not linked",
          needsGoogleAuth: true,
          message: "Please connect your Google account to create Meet links",
        },
        { status: 400 }
      );
    }

    const googleAccount = user.accounts[0];
    let accessToken = googleAccount.access_token;

    // Check if token is expired and refresh if needed
    const tokenExpiry = googleAccount.expires_at
      ? googleAccount.expires_at * 1000
      : 0;
    if (Date.now() > tokenExpiry && googleAccount.refresh_token) {
      accessToken = await refreshAccessToken(googleAccount.refresh_token) ?? null;

      if (accessToken) {
        // Update the stored access token
        await prisma.account.update({
          where: { id: googleAccount.id },
          data: {
            access_token: accessToken,
            expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
          },
        });
      }
    }

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Failed to authenticate with Google",
          needsGoogleAuth: true,
          message: "Please reconnect your Google account",
        },
        { status: 401 }
      );
    }

    // Create OAuth2 client with the access token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: accessToken });

    // Create Google Calendar API client
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Calculate end time
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(
      startDateTime.getTime() + durationMinutes * 60 * 1000
    );

    // Create calendar event with Google Meet conferencing
    const event = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: title,
        description: description || `Coding class: ${title}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "UTC",
        },
        conferenceData: {
          createRequest: {
            requestId: `class-${Date.now()}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
        attendees: [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 60 },
            { method: "popup", minutes: 15 },
          ],
        },
      },
    });

    const meetLink = event.data.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === "video"
    )?.uri;

    if (!meetLink) {
      return NextResponse.json(
        { error: "Failed to generate Meet link" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      meetLink,
      calendarEventId: event.data.id,
      calendarEventLink: event.data.htmlLink,
    });
  } catch (error: any) {
    console.error("[google-meet] Error creating meeting:", error);

    // Handle specific Google API errors
    if (error.code === 401 || error.message?.includes("invalid_grant")) {
      return NextResponse.json(
        {
          error: "Google authentication expired",
          needsGoogleAuth: true,
          message: "Please reconnect your Google account",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create meeting", details: error.message },
      { status: 500 }
    );
  }
}

// GET - Check if user has Google account linked
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: {
          where: { provider: "google" },
          select: { id: true, expires_at: true },
        },
      },
    });

    const hasGoogleAccount = !!(user?.accounts && user.accounts.length > 0);
    const isTokenValid =
      hasGoogleAccount &&
      user.accounts[0].expires_at &&
      user.accounts[0].expires_at * 1000 > Date.now();

    return NextResponse.json({
      hasGoogleAccount,
      isTokenValid,
      needsReauth: hasGoogleAccount && !isTokenValid,
    });
  } catch (error) {
    console.error("[google-meet] Error checking Google account:", error);
    return NextResponse.json(
      { error: "Failed to check Google account status" },
      { status: 500 }
    );
  }
}
