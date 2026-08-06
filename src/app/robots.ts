// =====================================================================
// MARKET1 ROBOTS.TXT GENERATOR
// Guides search engine crawlers safely through the platform.
// =====================================================================

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://market1.com';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/tools/'], // Allow indexing of home and all tools
      disallow: ['/admin/', '/dashboard/', '/api/'], // Block private areas
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
