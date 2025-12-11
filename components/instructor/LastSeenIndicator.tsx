'use client';

/**
 * Last Seen Indicator Component
 *
 * Displays instructor's online status and last seen time
 * Shows:
 * - "Online" (green) if active within last 5 minutes
 * - "X minutes/hours ago" (yellow) if active within last 24 hours
 * - Date or "X days ago" (gray) if longer
 */

import { formatLastSeen, getOnlineStatusColor, isUserOnline } from '@/lib/update-last-seen';

interface LastSeenIndicatorProps {
  lastSeen: Date | string | null;
  showDot?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LastSeenIndicator({
  lastSeen,
  showDot = true,
  showText = true,
  size = 'md',
  className = '',
}: LastSeenIndicatorProps) {
  // Convert string to Date if needed
  const lastSeenDate = lastSeen
    ? typeof lastSeen === 'string'
      ? new Date(lastSeen)
      : lastSeen
    : null;

  const isOnline = isUserOnline(lastSeenDate);
  const formattedTime = formatLastSeen(lastSeenDate);
  const colors = getOnlineStatusColor(lastSeenDate);

  // Size classes for dot
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  // Size classes for text
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showDot && (
        <span className="relative flex">
          <span
            className={`inline-flex rounded-full ${colors.dot} ${dotSizes[size]} ${
              isOnline ? 'animate-pulse' : ''
            }`}
          />
          {isOnline && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${colors.dot} opacity-75 animate-ping`}
            />
          )}
        </span>
      )}

      {showText && (
        <span className={`${colors.text} ${textSizes[size]} font-medium`}>
          {formattedTime}
        </span>
      )}
    </div>
  );
}

/**
 * Badge variant - Shows status in a badge/pill format
 */
export function LastSeenBadge({
  lastSeen,
  className = '',
}: {
  lastSeen: Date | string | null;
  className?: string;
}) {
  const lastSeenDate = lastSeen
    ? typeof lastSeen === 'string'
      ? new Date(lastSeen)
      : lastSeen
    : null;

  const isOnline = isUserOnline(lastSeenDate);
  const formattedTime = formatLastSeen(lastSeenDate);
  const colors = getOnlineStatusColor(lastSeenDate);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors.bg} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${colors.dot} ${isOnline ? 'animate-pulse' : ''}`} />
      <span className={`text-xs font-medium ${colors.text}`}>{formattedTime}</span>
    </div>
  );
}

/**
 * Minimal variant - Just the dot with tooltip on hover
 */
export function LastSeenDot({
  lastSeen,
  className = '',
}: {
  lastSeen: Date | string | null;
  className?: string;
}) {
  const lastSeenDate = lastSeen
    ? typeof lastSeen === 'string'
      ? new Date(lastSeen)
      : lastSeen
    : null;

  const isOnline = isUserOnline(lastSeenDate);
  const formattedTime = formatLastSeen(lastSeenDate);
  const colors = getOnlineStatusColor(lastSeenDate);

  return (
    <div className={`relative group ${className}`} title={formattedTime}>
      <span className="relative flex">
        <span
          className={`inline-flex rounded-full ${colors.dot} w-2.5 h-2.5 ${
            isOnline ? 'animate-pulse' : ''
          }`}
        />
        {isOnline && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${colors.dot} opacity-75 animate-ping`}
          />
        )}
      </span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {formattedTime}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
        </div>
      </div>
    </div>
  );
}
