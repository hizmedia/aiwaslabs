import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { status, notes } = body

  const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const [booking] = await query<{ id: string }>(
    `UPDATE bookings
     SET status = COALESCE($1, status),
         notes  = COALESCE($2, notes)
     WHERE id = $3
     RETURNING id`,
    [status ?? null, notes ?? null, id]
  )

  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ id: booking.id })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await query('DELETE FROM bookings WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
