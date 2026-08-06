// =====================================================================
// MARKET1 UNIVERSAL SITEMAP GENERATOR (MUTE)
// Automatically indexes all 1,300+ tools for Google SEO.
// =====================================================================

import { MetadataRoute } from 'next';
import { TOOL_REGISTRY } from '../data/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  // 🚀 Change this to your actual production domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://market1.com';

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Home page is most important
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Dynamic Tool Pages (Reads directly from MUTE Registry)
  const dynamicToolRoutes: MetadataRoute.Sitemap = TOOL_REGISTRY.map((tool) => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9, // High priority for our tool pages to rank on Google
  }));

  return [...staticRoutes, ...dynamicToolRoutes];
}
