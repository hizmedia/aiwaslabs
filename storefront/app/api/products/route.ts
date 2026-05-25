import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  let sql = `
    SELECT id, title, slug, price, product_type, category_tags,
           biomarker_count, badge, images
    FROM products
    WHERE available = true
  `
  const params: unknown[] = []

  if (category) {
    params.push(category)
    sql += ` AND $${params.length} = ANY(category_tags)`
  }

  if (featured === '1') {
    sql += ` AND badge IS NOT NULL`
  }

  sql += ` ORDER BY created_at DESC`

  if (featured === '1') {
    sql += ` LIMIT 6`
  }

  const products = await query<{
    id: string
    title: string
    slug: string
    price: string
    product_type: string
    category_tags: string[]
    biomarker_count: number
    badge: string | null
    images: string[]
  }>(sql, params.length ? params : undefined)

  return NextResponse.json(products)
}
