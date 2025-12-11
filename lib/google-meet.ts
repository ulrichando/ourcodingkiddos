/**
 * Google Meet Integration
 *
 * This module handles Google Meet link generation using OAuth tokens.
 * Tokens are stored in the database and automatically refreshed when needed.
 */

import { prismaBase } from './prisma';

/**
 * Get valid Google OAuth token for a user
 * Automatically refreshes if expired
 */
async function getValidGoogleToken(userEmail: string): Promise<string | null> {
  // Get the user's Google account with tokens
  const account = await prismaBase.account.findFirst({
    where: {
      user: { email: userEmail },
      provider: 'google',
    },
    select: {
      access_token: true,
      refresh_token: true,
      expires_at: true,
    },
  });

  if (!account || !account.access_token) {
    console.log('[Google Meet] No Google account linked for:', userEmail);
    return null;
  }

  // Check if token is expired (with 5 minute buffer)
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = account.expires_at || 0;
  const isExpired = expiresAt - now < 300; // 5 minutes buffer

  if (!isExpired) {
    // Token is still valid
    return account.access_token;
  }

  // Token is expired, refresh it
  if (!account.refresh_token) {
    console.log('[Google Meet] No refresh token available for:', userEmail);
    return null;
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: account.refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.error('[Google Meet] Token refresh failed:', await response.text());
      return null;
    }

    const tokens = await response.json();

    // Update the account with new tokens
    await prismaBase.account.updateMany({
      where: {
        user: { email: userEmail },
        provider: 'google',
      },
      data: {
        access_token: tokens.access_token,
        expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
        // Only update refresh token if a new one is provided
        ...(tokens.refresh_token ? { refresh_token: tokens.refresh_token } : {}),
      },
    });

    console.log('[Google Meet] Token refreshed successfully for:', userEmail);
    return tokens.access_token;
  } catch (error) {
    console.error('[Google Meet] Error refreshing token:', error);
    return null;
  }
}

/**
 * Create a Google Meet link using Google Calendar API
 * The meeting link is persistent and can be reused
 */
export async function createGoogleMeetLink(
  userEmail: string,
  title: string,
  startTime: Date,
  durationMinutes: number
): Promise<string | null> {
  const accessToken = await getValidGoogleToken(userEmail);

  if (!accessToken) {
    console.log('[Google Meet] Cannot create meeting link - no valid token');
    return null;
  }

  try {
    // Create a Google Calendar event with a Meet link
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    const event = {
      summary: title,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/New_York', // Adjust to your timezone
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/New_York',
      },
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      console.error('[Google Meet] Calendar event creation failed:', await response.text());
      return null;
    }

    const eventData = await response.json();
    const meetLink = eventData.conferenceData?.entryPoints?.find(
      (entry: any) => entry.entryPointType === 'video'
    )?.uri;

    if (meetLink) {
      console.log('[Google Meet] Created meeting link:', meetLink);
      return meetLink;
    }

    console.log('[Google Meet] No meeting link in response');
    return null;
  } catch (error) {
    console.error('[Google Meet] Error creating meeting link:', error);
    return null;
  }
}

/**
 * Check if a user has Google Calendar/Meet permissions
 */
export async function hasGoogleMeetAccess(userEmail: string): Promise<boolean> {
  const token = await getValidGoogleToken(userEmail);
  return token !== null;
}

/**
 * Get the OAuth connection status for a user
 */
export async function getGoogleConnectionStatus(userEmail: string): Promise<{
  connected: boolean;
  needsReconnect: boolean;
  email?: string;
}> {
  const account = await prismaBase.account.findFirst({
    where: {
      user: { email: userEmail },
      provider: 'google',
    },
    select: {
      access_token: true,
      refresh_token: true,
      expires_at: true,
    },
  });

  if (!account) {
    return { connected: false, needsReconnect: false };
  }

  // Check if we can refresh the token
  if (!account.refresh_token) {
    return { connected: true, needsReconnect: true };
  }

  return { connected: true, needsReconnect: false, email: userEmail };
}
