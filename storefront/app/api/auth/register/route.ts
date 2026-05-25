import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { first_name, last_name, email, password } = await req.json()

  if (!first_name || !last_name || !email || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const hash = await bcrypt.hash(password, 12)

  const existing = await query<{ id: string; password_hash: string }>(
    `SELECT id, password_hash FROM users WHERE email = $1 AND role = 'patient' LIMIT 1`,
    [normalizedEmail]
  )

  let userId: string

  if (existing.length > 0) {
    if (existing[0].password_hash !== 'GUEST_BOOKING') {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 409 })
    }
    await query(
      `UPDATE users SET password_hash = $1, first_name = $2, last_name = $3 WHERE id = $4`,
      [hash, first_name.trim(), last_name.trim(), existing[0].id]
    )
    userId = existing[0].id
  } else {
    const [newUser] = await query<{ id: string }>(
      `INSERT INTO users (email, password_hash, role, first_name, last_name)
       VALUES ($1, $2, 'patient', $3, $4) RETURNING id`,
      [normalizedEmail, hash, first_name.trim(), last_name.trim()]
    )
    userId = newUser.id
  }

  const token = signToken({
    id: userId, email: normalizedEmail,
    first_name: first_name.trim(), last_name: last_name.trim(),
    role: 'patient',
  })

  const res = NextResponse.json({ ok: true })
  res.cookies.set('patient_token', token, {
    httpOnly: true, sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, path: '/',
  })
  return res
}
