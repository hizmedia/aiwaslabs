import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { query } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { first_name, last_name, email, password } = await req.json()

  if (!first_name || !last_name || !email || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const normalizedEmail  = email.toLowerCase().trim()
  const hash             = await bcrypt.hash(password, 12)
  const verifyToken      = randomBytes(32).toString('hex')
  const verifyExpires    = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  const existing = await query<{ id: string; password_hash: string }>(
    `SELECT id, password_hash FROM users WHERE email = $1 AND role = 'patient' LIMIT 1`,
    [normalizedEmail]
  )

  let userId: string
  let isNewUser = false

  if (existing.length > 0) {
    if (existing[0].password_hash !== 'GUEST_BOOKING') {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 409 })
    }
    await query(
      `UPDATE users
       SET password_hash = $1, first_name = $2, last_name = $3,
           verification_token = $4, verification_expires = $5, email_verified = false
       WHERE id = $6`,
      [hash, first_name.trim(), last_name.trim(), verifyToken, verifyExpires, existing[0].id]
    )
    userId = existing[0].id
  } else {
    const [newUser] = await query<{ id: string }>(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, verification_token, verification_expires)
       VALUES ($1, $2, 'patient', $3, $4, $5, $6) RETURNING id`,
      [normalizedEmail, hash, first_name.trim(), last_name.trim(), verifyToken, verifyExpires]
    )
    userId  = newUser.id
    isNewUser = true
  }

  // Fire emails (non-blocking)
  const emailData = { firstName: first_name.trim(), email: normalizedEmail }
  if (isNewUser) sendWelcomeEmail(emailData).catch(console.error)
  sendVerificationEmail({ ...emailData, token: verifyToken }).catch(console.error)

  const jwt = signToken({
    id: userId, email: normalizedEmail,
    first_name: first_name.trim(), last_name: last_name.trim(),
    role: 'patient',
  })

  const res = NextResponse.json({ ok: true })
  res.cookies.set('patient_token', jwt, {
    httpOnly: true, sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, path: '/',
  })
  return res
}
