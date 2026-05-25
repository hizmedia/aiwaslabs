import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET /api/products — list all products
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const products = await query(`
    SELECT p.*,
           COALESCE(json_agg(f ORDER BY f.sort_order) FILTER (WHERE f.id IS NOT NULL), '[]') AS faqs
    FROM products p
    LEFT JOIN faqs f ON f.product_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `)

  return NextResponse.json(products)
}

// POST /api/products — create product
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const body = await req.json()
    const { title, slug, description, price, biomarker_count, images, category_tags, product_type, badge, available, faqs, test_info } = body

    if (!title || !slug || !description || !price || !product_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const [product] = await query<{ id: string }>(`
      INSERT INTO products (title, slug, description, price, biomarker_count, images, category_tags, product_type, badge, available, test_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [title, slug, description, price, biomarker_count ?? 0, JSON.stringify(images ?? []), category_tags ?? [], product_type, badge ?? null, available ?? true, test_info ? JSON.stringify(test_info) : null])

    if (faqs?.length) {
      for (let i = 0; i < faqs.length; i++) {
        const { question, answer } = faqs[i]
        if (question && answer) {
          await query(
            'INSERT INTO faqs (product_id, question, answer, sort_order) VALUES ($1, $2, $3, $4)',
            [product.id, question, answer, i]
          )
        }
      }
    }

    return NextResponse.json({ id: product.id }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    if (message.includes('unique')) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
