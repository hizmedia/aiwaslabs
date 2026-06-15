import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getPatientSession } from '@/lib/auth'
import { sendBookingConfirmation, sendDoctorBookingAlert } from '@/lib/email'

export async function GET() {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const bookings = await query<{
    id: string; booking_date: string; booking_time: string
    booking_type: string; status: string; notes: string | null
    product_title: string; product_slug: string; product_price: string
    created_at: string
  }>(
    `SELECT b.id, b.booking_date, b.booking_time, b.booking_type, b.status, b.notes, b.created_at,
            p.title AS product_title, p.slug AS product_slug, p.price AS product_price
     FROM bookings b
     JOIN products p ON p.id = b.product_id
     WHERE b.patient_id = $1
     ORDER BY b.booking_date DESC, b.booking_time DESC`,
    [session.id]
  )

  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    first_name, last_name, email, phone,
    product_id, booking_date, booking_time, booking_type, notes,
  } = body

  if (!first_name || !last_name || !email || !phone || !product_id || !booking_date || !booking_time || !booking_type) {
    return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 })
  }

  if (!['clinic', 'home'].includes(booking_type)) {
    return NextResponse.json({ error: 'booking_type must be clinic or home' }, { status: 400 })
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  const timeRegex = /^\d{2}:\d{2}$/
  if (!dateRegex.test(booking_date) || !timeRegex.test(booking_time)) {
    return NextResponse.json({ error: 'Invalid date or time format' }, { status: 400 })
  }

  const sanitized = {
    first_name: String(first_name).slice(0, 100),
    last_name: String(last_name).slice(0, 100),
    email: String(email).slice(0, 254).toLowerCase().trim(),
    phone: String(phone).slice(0, 30),
    notes: notes ? String(notes).slice(0, 1000) : null,
  }

  const existing = await query<{ id: string }>(
    `SELECT id FROM users WHERE email = $1 AND role = 'patient' LIMIT 1`,
    [sanitized.email]
  )

  let patientId: string
  if (existing.length > 0) {
    patientId = existing[0].id
    await query(
      `UPDATE users SET first_name = $1, last_name = $2, phone = $3 WHERE id = $4`,
      [sanitized.first_name, sanitized.last_name, sanitized.phone, patientId]
    )
  } else {
    const [newPatient] = await query<{ id: string }>(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone)
       VALUES ($1, 'GUEST_BOOKING', 'patient', $2, $3, $4)
       RETURNING id`,
      [sanitized.email, sanitized.first_name, sanitized.last_name, sanitized.phone]
    )
    patientId = newPatient.id
  }

  const [[booking], [product]] = await Promise.all([
    query<{ id: string }>(
      `INSERT INTO bookings (patient_id, product_id, booking_date, booking_time, booking_type, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [patientId, product_id, booking_date, booking_time, booking_type, sanitized.notes]
    ),
    query<{ title: string }>(`SELECT title FROM products WHERE id = $1`, [product_id]),
  ])

  const emailPayload = {
    firstName: sanitized.first_name,
    lastName: sanitized.last_name,
    email: sanitized.email,
    phone: sanitized.phone,
    productTitle: product?.title ?? 'Blood Test',
    bookingDate: booking_date,
    bookingTime: booking_time,
    bookingType: booking_type,
    bookingId: booking.id,
  }

  await Promise.all([
    sendBookingConfirmation(emailPayload),
    sendDoctorBookingAlert(emailPayload),
  ])

  return NextResponse.json({ id: booking.id }, { status: 201 })
}
