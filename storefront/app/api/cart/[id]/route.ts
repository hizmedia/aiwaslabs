import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getPatientSession } from '@/lib/auth'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  await query(
    `DELETE FROM cart_items WHERE id = $1 AND patient_id = $2`,
    [id, session.id]
  )

  return NextResponse.json({ ok: true })
}
