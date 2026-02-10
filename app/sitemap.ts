import { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';
import { THEMES } from '@/data/themes';
import { Theme } from '@/schema';

export default function sitemap(): MetadataRoute.Sitemap {
  const themes = Object.keys(THEMES) as Theme[];

  // Static pages
  const staticPages = [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE.url}/imposter-game`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE.url}/how-to-play`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE.url}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // Theme pages
  const themePages = themes.map((theme) => ({
    url: `${SITE.url}/theme/${theme}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...themePages];
}
