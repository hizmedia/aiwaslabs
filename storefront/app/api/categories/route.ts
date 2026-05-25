import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const categories = await query<{ id: string; name: string; slug: string }>(
      'SELECT id, name, slug FROM categories ORDER BY sort_order, name'
    )
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
