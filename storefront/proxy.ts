import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/account') && !pathname.startsWith('/account/login')) {
    const token = req.cookies.get('patient_token')?.value
    if (!token || !verifyToken(token)) {
      const loginUrl = new URL('/account/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname === '/account/login') {
    const token = req.cookies.get('patient_token')?.value
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/account', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*'],
}
