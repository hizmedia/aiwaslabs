import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const rows = await query<{
    id: string
    name: string
    slug: string
    sort_order: number
    product_count: string
  }>(`
    SELECT c.id, c.name, c.slug, c.sort_order,
           (SELECT COUNT(*) FROM products p WHERE c.slug = ANY(p.category_tags)) AS product_count
    FROM categories c
    ORDER BY c.sort_order, c.name
  `)
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const { name, slug, sort_order } = await req.json()

  if (!name?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
  }

  const [row] = await query<{ id: string }>(
    `INSERT INTO categories (name, slug, sort_order)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [name.trim(), slug.trim(), sort_order ?? 0]
  )

  return NextResponse.json({ id: row.id }, { status: 201 })
}
