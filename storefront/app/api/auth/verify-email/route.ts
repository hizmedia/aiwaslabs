import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/account?verify=invalid', req.url))
  }

  const [user] = await query<{ id: string }>(
    `UPDATE users
     SET email_verified = true, verification_token = NULL, verification_expires = NULL
     WHERE verification_token = $1
       AND verification_expires > NOW()
       AND email_verified = false
     RETURNING id`,
    [token]
  )

  if (!user) {
    return NextResponse.redirect(new URL('/account?verify=invalid', req.url))
  }

  return NextResponse.redirect(new URL('/account?verify=success', req.url))
}
