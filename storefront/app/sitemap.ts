import type { MetadataRoute } from 'next'
import { ARTICLES } from '@/lib/articles'

const BASE = 'https://aiwaslabs.co.uk'

async function getProductSlugs(): Promise<string[]> {
  try {
    const { query } = await import('@/lib/db')
    const rows = await query<{ slug: string }>('SELECT slug FROM products WHERE available = true')
    return rows.map(r => r.slug)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productSlugs = await getProductSlugs()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const productPages: MetadataRoute.Sitemap = productSlugs.map(slug => ({
    url: `${BASE}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map(a => ({
    url: `${BASE}/resources/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...articlePages]
}
