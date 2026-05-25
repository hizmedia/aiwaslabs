import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET /api/products/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const [product] = await query<Record<string, unknown>>(`
    SELECT p.*,
           COALESCE(json_agg(f ORDER BY f.sort_order) FILTER (WHERE f.id IS NOT NULL), '[]') AS faqs
    FROM products p
    LEFT JOIN faqs f ON f.product_id = p.id
    WHERE p.id = $1
    GROUP BY p.id
  `, [id])

  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

// PATCH /api/products/:id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { title, slug, description, price, biomarker_count, images, category_tags, product_type, badge, available, faqs, test_info } = body

  try {
    await query(`
      UPDATE products SET
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        biomarker_count = COALESCE($5, biomarker_count),
        images = COALESCE($6, images),
        category_tags = COALESCE($7, category_tags),
        product_type = COALESCE($8, product_type),
        badge = COALESCE($9, badge),
        available = COALESCE($10, available),
        test_info = COALESCE($11, test_info),
        updated_at = NOW()
      WHERE id = $12
    `, [title, slug, description, price, biomarker_count, images ? JSON.stringify(images) : null, category_tags, product_type, badge, available, test_info ? JSON.stringify(test_info) : null, id])

    if (faqs !== undefined) {
      await query('DELETE FROM faqs WHERE product_id = $1', [id])
      for (let i = 0; i < faqs.length; i++) {
        const { question, answer } = faqs[i]
        if (question && answer) {
          await query(
            'INSERT INTO faqs (product_id, question, answer, sort_order) VALUES ($1, $2, $3, $4)',
            [id, question, answer, i]
          )
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/products/:id
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  await query('DELETE FROM products WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
