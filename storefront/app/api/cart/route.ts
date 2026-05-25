import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getPatientSession } from '@/lib/auth'

export async function GET() {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const items = await query<{
    id: string; product_id: string; title: string; price: string
    images: string[]; slug: string; created_at: string
  }>(
    `SELECT ci.id, ci.product_id, ci.created_at,
            p.title, p.price, p.images, p.slug
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.patient_id = $1
     ORDER BY ci.created_at DESC`,
    [session.id]
  )

  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { product_id } = await req.json()
  if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 })

  await query(
    `INSERT INTO cart_items (patient_id, product_id)
     VALUES ($1, $2)
     ON CONFLICT (patient_id, product_id) DO NOTHING`,
    [session.id, product_id]
  )

  return NextResponse.json({ ok: true }, { status: 201 })
}
