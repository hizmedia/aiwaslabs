import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const rows = await query<{
    id: string
    first_name: string
    last_name: string
    email: string
  }>(
    `SELECT id, first_name, last_name, email FROM users WHERE role = 'patient' ORDER BY last_name, first_name`
  )
  return NextResponse.json(rows)
}
