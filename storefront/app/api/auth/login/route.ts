import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const [user] = await query<{
    id: string; email: string; first_name: string; last_name: string
    password_hash: string; role: string
  }>(
    `SELECT id, email, first_name, last_name, password_hash, role
     FROM users WHERE email = $1 AND role = 'patient' LIMIT 1`,
    [email.toLowerCase().trim()]
  )

  if (!user || user.password_hash === 'GUEST_BOOKING') {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const token = signToken({
    id: user.id, email: user.email,
    first_name: user.first_name ?? '', last_name: user.last_name ?? '',
    role: 'patient',
  })

  const res = NextResponse.json({ ok: true })
  res.cookies.set('patient_token', token, {
    httpOnly: true, sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, path: '/',
  })
  return res
}
