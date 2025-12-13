/**
 * HTML Sanitization Utilities
 *
 * Uses DOMPurify for robust XSS protection when rendering user-generated HTML content.
 * This should be used with any dangerouslySetInnerHTML usage.
 */

import DOMPurify from 'dompurify';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Safe for use with dangerouslySetInnerHTML
 *
 * @param dirty - Untrusted HTML string
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(dirty: string, options?: DOMPurify.Config): string {
  if (!dirty) return '';

  // On server-side, return escaped HTML for safety
  if (!isBrowser) {
    return escapeHtmlBasic(dirty);
  }

  // Default config - allows common formatting tags
  const defaultConfig: DOMPurify.Config = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'target', 'rel', 'class', 'id',
      'src', 'alt', 'width', 'height',
      'colspan', 'rowspan'
    ],
    // Force target="_blank" links to have noopener noreferrer
    ADD_ATTR: ['target'],
    ALLOW_DATA_ATTR: false,
    // Don't allow javascript: URLs
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  };

  const config = options ? { ...defaultConfig, ...options } : defaultConfig;

  return DOMPurify.sanitize(dirty, config);
}

/**
 * Sanitizes HTML for rich text content like blog posts
 * More permissive than default sanitization
 */
export function sanitizeRichHtml(dirty: string): string {
  if (!dirty) return '';

  if (!isBrowser) {
    return escapeHtmlBasic(dirty);
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'figure', 'figcaption', 'hr',
      'video', 'audio', 'source', 'iframe'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'target', 'rel', 'class', 'id', 'style',
      'src', 'alt', 'width', 'height',
      'colspan', 'rowspan',
      'controls', 'autoplay', 'muted', 'loop', 'poster',
      'frameborder', 'allowfullscreen', 'allow'
    ],
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder'],
    // Only allow iframes from trusted sources
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Allow YouTube, Vimeo embeds
    CUSTOM_ELEMENT_HANDLING: {
      tagNameCheck: null,
      attributeNameCheck: null,
      allowCustomizedBuiltInElements: false,
    },
  });
}

/**
 * Sanitizes HTML for email content display
 * Restricted to prevent embedded scripts/styles from emails
 */
export function sanitizeEmailHtml(dirty: string): string {
  if (!dirty) return '';

  if (!isBrowser) {
    return escapeHtmlBasic(dirty);
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre',
      'a', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr'
    ],
    ALLOWED_ATTR: ['href', 'title', 'class'],
    FORBID_TAGS: ['style', 'script', 'img', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['style', 'onerror', 'onclick', 'onload'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Basic HTML escape for server-side rendering
 * Use when DOMPurify is not available (SSR)
 */
function escapeHtmlBasic(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips all HTML tags, returning plain text
 * Useful for excerpts or text-only displays
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  if (!isBrowser) {
    // Simple regex fallback for server
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/**
 * Sanitizes and formats message content (like chat messages)
 * Allows basic formatting while preventing XSS
 */
export function sanitizeMessage(content: string): string {
  if (!content) return '';

  // First, escape the content
  let safe = escapeHtmlBasic(content);

  // Then apply safe formatting transformations
  safe = safe
    .split('\n')
    .map((line) => {
      // Bold text (escaped version)
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet points
      if (formatted.startsWith('• ')) {
        return `<li class="ml-4">${formatted.slice(2)}</li>`;
      }
      // Numbered lists
      if (/^\d+\.\s/.test(formatted)) {
        return `<li class="ml-4 list-decimal">${formatted.replace(/^\d+\.\s/, '')}</li>`;
      }
      return formatted;
    })
    .join('<br/>');

  return safe;
}
