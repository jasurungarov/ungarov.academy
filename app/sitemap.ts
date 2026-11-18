import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ungarovacademy.uz';

  return [
    {
      url: baseUrl,
    },
  ];
}
