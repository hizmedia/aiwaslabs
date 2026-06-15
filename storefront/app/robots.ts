import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/checkout/', '/api/'],
      },
    ],
    sitemap: 'https://aiwaslabs.co.uk/sitemap.xml',
    host: 'https://aiwaslabs.co.uk',
  }
}
