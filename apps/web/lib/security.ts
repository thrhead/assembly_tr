import DOMPurify from 'isomorphic-dompurify';

/**
 * Strips all HTML tags from a string.
 */
export function stripHtml(text: string): string {
    if (!text) return '';
    return text.replace(/<[^>]*>?/gm, '');
}

/**
 * Sanitizes HTML content using isomorphic-dompurify to prevent XSS.
 * Safe for use in both Node.js (Server) and Browser environments.
 */
export function sanitizeHtml(html: string): string {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: ['href', 'target']
    });
}