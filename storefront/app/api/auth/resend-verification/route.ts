import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { query } from '@/lib/db'
import { getPatientSession } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'

export async function POST() {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const [user] = await query<{ first_name: string; email_verified: boolean }>(
    `SELECT first_name, email_verified FROM users WHERE id = $1`,
    [session.id]
  )

  if (!user || user.email_verified) {
    return NextResponse.json({ ok: true }) // already verified, no-op
  }

  const token   = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await query(
    `UPDATE users SET verification_token = $1, verification_expires = $2 WHERE id = $3`,
    [token, expires, session.id]
  )

  await sendVerificationEmail({ firstName: user.first_name, email: session.email, token })

  return NextResponse.json({ ok: true })
}
