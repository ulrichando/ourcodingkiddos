/**
 * Custom SVG Icons for Coding Kiddos
 * Semantically meaningful icons that represent actions
 */

import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Enrollment Icon - Calendar with checkmark
 * Used for: "Now Enrolling for 2025"
 * Represents: Registration, signing up, scheduling
 */
export function EnrollmentIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Calendar base */}
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      {/* Calendar top hooks */}
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      {/* Calendar divider line */}
      <line x1="3" y1="10" x2="21" y2="10" />
      {/* Checkmark inside calendar */}
      <path d="M9 16l2 2 4-4" />
    </svg>
  );
}

/**
 * Free Trial Icon - Gift box with play button
 * Used for: "Try a Free Class"
 * Represents: Free offer, gift, trial experience
 */
export function FreeTrialIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Gift box base */}
      <rect x="3" y="8" width="18" height="13" rx="1" />
      {/* Gift box lid */}
      <rect x="2" y="4" width="20" height="4" rx="1" />
      {/* Vertical ribbon */}
      <line x1="12" y1="4" x2="12" y2="21" />
      {/* Horizontal ribbon */}
      <line x1="3" y1="12" x2="21" y2="12" />
      {/* Bow left */}
      <path d="M12 4c-2-2-5-2-5 1s3 3 5 3" />
      {/* Bow right */}
      <path d="M12 4c2-2 5-2 5 1s-3 3-5 3" />
    </svg>
  );
}

/**
 * Play Class Icon - Play button in circle
 * Alternative for: "Try a Free Class"
 * Represents: Starting a class, video lesson, interactive learning
 */
export function PlayClassIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" />
      {/* Play triangle - filled for emphasis */}
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Signup Clipboard Icon - Clipboard with pencil
 * Alternative for: "Now Enrolling"
 * Represents: Registration form, signup process
 */
export function SignupIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Clipboard */}
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      {/* Clipboard clip */}
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      {/* Pencil writing */}
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

/**
 * Open Book Icon - Open book with pages
 * Used for: "Browse Programs"
 * Represents: Learning, courses, curriculum
 */
export function BrowseCoursesIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Book spine */}
      <path d="M12 7v14" />
      {/* Left page */}
      <path d="M3 18a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H3z" />
      {/* Right page */}
      <path d="M21 18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h6z" />
    </svg>
  );
}

/**
 * Calendar 2025 Badge Icon - Calendar with year
 * Alternative for: "Now Enrolling for 2025"
 * Represents: New year enrollment, timely signup
 */
export function Calendar2025Icon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Calendar base */}
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      {/* Calendar top hooks */}
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      {/* Calendar divider line */}
      <line x1="3" y1="10" x2="21" y2="10" />
      {/* Star burst for "new" */}
      <circle cx="12" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}

/**
 * Rocket Launch Icon - Rocket with exhaust
 * Alternative for: "Browse Programs" or general CTA
 * Represents: Starting journey, taking off, adventure
 */
export function RocketLaunchIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Rocket body */}
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      {/* Rocket window */}
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

/**
 * Badge Ribbon Icon - Award ribbon badge
 * Used for: Trust badges, achievements
 * Represents: Quality, certification, achievement
 */
export function BadgeRibbonIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Badge circle */}
      <circle cx="12" cy="8" r="6" />
      {/* Left ribbon */}
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
      {/* Star inside badge */}
      <path d="M12 5l1 2h2l-1.5 1.5.5 2-2-1-2 1 .5-2L9 7h2l1-2z" fill="currentColor" stroke="none" />
    </svg>
  );
}
