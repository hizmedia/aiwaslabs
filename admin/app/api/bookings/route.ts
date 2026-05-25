import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const month = searchParams.get('month')     // 'YYYY-MM'
  const patient = searchParams.get('patient') // patient UUID

  let sql = `
    SELECT b.id, b.booking_date, b.booking_time, b.booking_type, b.status, b.notes,
           u.id AS patient_id, u.first_name, u.last_name, u.email, u.phone,
           p.id AS product_id, p.title AS product_title
    FROM bookings b
    JOIN users u ON u.id = b.patient_id
    JOIN products p ON p.id = b.product_id
  `
  const params: unknown[] = []
  const conditions: string[] = []

  if (month) {
    params.push(month + '-01')
    conditions.push(`b.booking_date >= $${params.length}::date AND b.booking_date < ($${params.length}::date + INTERVAL '1 month')`)
  }
  if (patient) {
    params.push(patient)
    conditions.push(`b.patient_id = $${params.length}`)
  }

  if (conditions.length) sql += ` WHERE ${conditions.join(' AND ')}`
  sql += ` ORDER BY b.booking_date, b.booking_time`

  const rows = await query(sql, params)
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const { patient_id, product_id, booking_date, booking_time, booking_type, notes } = await req.json()

  if (!patient_id || !product_id || !booking_date || !booking_time || !booking_type) {
    return NextResponse.json({ error: 'patient_id, product_id, booking_date, booking_time and booking_type are required' }, { status: 400 })
  }

  const VALID_TYPES = ['clinic', 'home']
  if (!VALID_TYPES.includes(booking_type)) {
    return NextResponse.json({ error: 'booking_type must be clinic or home' }, { status: 400 })
  }

  const [booking] = await query<{ id: string }>(
    `INSERT INTO bookings (patient_id, product_id, booking_date, booking_time, booking_type, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [patient_id, product_id, booking_date, booking_time, booking_type, notes || null]
  )

  return NextResponse.json({ id: booking.id }, { status: 201 })
}
