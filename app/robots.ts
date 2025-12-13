import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ourcodingkiddos.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Private/authenticated areas
          '/dashboard/',
          '/api/',
          '/settings',
          '/messages',
          '/notifications',

          // Auth pages (don't need to be crawled heavily)
          '/auth/forgot-password',
          '/auth/reset-password',
          '/auth/verify-email',
          '/auth/student-login',

          // Admin/internal pages
          '/admin/',

          // Dynamic user-specific content
          '/programs/*/success',
        ],
      },
      {
        // Block aggressive crawlers from hammering the site
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
