import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Returns booked time slots for a given date (non-cancelled bookings only)
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date param required (YYYY-MM-DD)' }, { status: 400 })
  }

  const rows = await query<{ booking_time: string }>(
    `SELECT booking_time FROM bookings
     WHERE booking_date = $1
       AND status IN ('pending', 'confirmed')`,
    [date]
  )

  // Return as "HH:MM" strings
  const booked = rows.map(r => String(r.booking_time).slice(0, 5))
  return NextResponse.json({ booked })
}
