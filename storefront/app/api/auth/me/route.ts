import { NextResponse } from 'next/server'
import { getPatientSession } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET() {
  const session = await getPatientSession()
  if (!session) return NextResponse.json(null)

  const [row] = await query<{ email_verified: boolean }>(
    `SELECT email_verified FROM users WHERE id = $1`,
    [session.id]
  )

  return NextResponse.json({ ...session, email_verified: row?.email_verified ?? false })
}
