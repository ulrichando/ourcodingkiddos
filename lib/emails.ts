/**
 * Centralized email configuration for Coding Kiddos
 *
 * This file contains all email addresses used across the website.
 * Update these values to change emails site-wide.
 *
 * Required emails to set up in your email provider (Resend):
 * - hello@ourcodingkiddos.com   (transactional emails)
 * - support@ourcodingkiddos.com (customer support)
 * - info@ourcodingkiddos.com    (general inquiries)
 * - billing@ourcodingkiddos.com (payment/billing questions)
 * - safety@ourcodingkiddos.com  (safety/abuse reports)
 */

// =============================================================================
// PRIMARY EMAILS
// =============================================================================

// Sender email - for transactional emails (welcome, password reset, notifications)
export const SENDER_EMAIL = process.env.EMAIL_FROM || "Coding Kiddos <hello@ourcodingkiddos.com>";
export const SENDER_EMAIL_ADDRESS = "hello@ourcodingkiddos.com";

// Reply-To email - where replies to transactional emails should go
export const REPLY_TO_EMAIL = process.env.EMAIL_REPLY_TO || "ulrich@ourcodingkiddos.com";

// Support email - for customer support and general help
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@ourcodingkiddos.com";

// =============================================================================
// DEPARTMENT EMAILS
// =============================================================================

// General information inquiries
export const INFO_EMAIL = "info@ourcodingkiddos.com";

// Billing and payment questions
export const BILLING_EMAIL = "billing@ourcodingkiddos.com";

// Safety concerns and abuse reports
export const SAFETY_EMAIL = "safety@ourcodingkiddos.com";

// Partnership and business inquiries
export const PARTNERSHIPS_EMAIL = "partnerships@ourcodingkiddos.com";

// =============================================================================
// EMAIL CONFIGURATION OBJECT
// =============================================================================

export const emails = {
  // Transactional (sending emails)
  sender: SENDER_EMAIL,
  senderAddress: SENDER_EMAIL_ADDRESS,
  replyTo: REPLY_TO_EMAIL,

  // Public-facing contact emails
  support: SUPPORT_EMAIL,
  info: INFO_EMAIL,
  billing: BILLING_EMAIL,
  safety: SAFETY_EMAIL,
  partnerships: PARTNERSHIPS_EMAIL,
} as const;

// Type for email keys
export type EmailType = keyof typeof emails;
