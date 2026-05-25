import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('admin_token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  if (pathname === '/login') {
    const token = req.cookies.get('admin_token')?.value
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
