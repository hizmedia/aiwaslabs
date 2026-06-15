import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { query } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const normalizedEmail = String(email).toLowerCase().trim()

  const [user] = await query<{ id: string; first_name: string; password_hash: string }>(
    `SELECT id, first_name, password_hash FROM users
     WHERE email = $1 AND role = 'patient' LIMIT 1`,
    [normalizedEmail]
  )

  // Always return success to prevent email enumeration
  if (!user || user.password_hash === 'GUEST_BOOKING') {
    return NextResponse.json({ ok: true })
  }

  const token   = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await query(
    `UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3`,
    [token, expires, user.id]
  )

  sendPasswordResetEmail({ firstName: user.first_name, email: normalizedEmail, token }).catch(console.error)

  return NextResponse.json({ ok: true })
}
