import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/room/'],
      },
    ],
    sitemap: 'https://imposterga.me/sitemap.xml',
  };
}
