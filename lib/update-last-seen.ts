/**
 * Update Last Seen Middleware
 *
 * Automatically updates user's lastSeen timestamp on activity
 * This helps track instructor online/offline status
 */

import { prismaBase } from './prisma';

/**
 * Update user's last seen timestamp
 * Call this on authenticated requests
 */
export async function updateLastSeen(userEmail: string): Promise<void> {
  try {
    await prismaBase.user.update({
      where: { email: userEmail },
      data: { lastSeen: new Date() },
    });
  } catch (error) {
    // Silently fail - last seen updates should not break the app
    console.error('[Last Seen] Error updating lastSeen:', error);
  }
}

/**
 * Check if a user is currently online
 * User is considered online if lastSeen is within last 5 minutes
 */
export function isUserOnline(lastSeen: Date | null): boolean {
  if (!lastSeen) return false;

  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  return lastSeen > fiveMinutesAgo;
}

/**
 * Format last seen time in human-readable format
 * Examples: "Online", "5 minutes ago", "2 hours ago", "Yesterday", "Jan 15"
 */
export function formatLastSeen(lastSeen: Date | null): string {
  if (!lastSeen) return 'Never';

  // Check if online (within last 5 minutes)
  if (isUserOnline(lastSeen)) {
    return 'Online';
  }

  const now = new Date();
  const diffMs = now.getTime() - lastSeen.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Less than 1 hour: show minutes
  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  // Less than 24 hours: show hours
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }

  // Yesterday
  if (diffDays === 1) {
    return 'Yesterday';
  }

  // Less than 7 days: show days
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // More than 7 days: show date
  const month = lastSeen.toLocaleDateString('en-US', { month: 'short' });
  const day = lastSeen.getDate();
  const year = lastSeen.getFullYear();
  const currentYear = now.getFullYear();

  // Show year only if different from current year
  if (year === currentYear) {
    return `${month} ${day}`;
  }

  return `${month} ${day}, ${year}`;
}

/**
 * Get online status color
 * Returns Tailwind color classes based on online status
 */
export function getOnlineStatusColor(lastSeen: Date | null): {
  dot: string;
  text: string;
  bg: string;
} {
  if (isUserOnline(lastSeen)) {
    return {
      dot: 'bg-green-500',
      text: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    };
  }

  if (!lastSeen) {
    return {
      dot: 'bg-gray-400',
      text: 'text-gray-500 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-800',
    };
  }

  const now = new Date();
  const diffMs = now.getTime() - lastSeen.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Active within last 24 hours: yellow/warning
  if (diffHours < 24) {
    return {
      dot: 'bg-yellow-500',
      text: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    };
  }

  // Inactive: gray
  return {
    dot: 'bg-gray-400',
    text: 'text-gray-500 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-800',
  };
}
