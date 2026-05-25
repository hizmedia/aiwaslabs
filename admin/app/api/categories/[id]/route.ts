import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { name, slug, sort_order } = await req.json()

  const [row] = await query<{ id: string }>(
    `UPDATE categories
     SET name       = COALESCE($1, name),
         slug       = COALESCE($2, slug),
         sort_order = COALESCE($3, sort_order)
     WHERE id = $4
     RETURNING id`,
    [name ?? null, slug ?? null, sort_order ?? null, id]
  )

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ id: row.id })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await query('DELETE FROM categories WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
