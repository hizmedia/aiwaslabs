import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const rows = await query<{
    id: string
    sample_date: string
    notes: string
    created_at: string
    biomarker_count: number
    first_name: string
    last_name: string
    product_title: string
  }>(`
    SELECT r.id, r.sample_date, r.notes, r.created_at,
           jsonb_array_length(r.biomarkers) AS biomarker_count,
           u.first_name, u.last_name,
           p.title AS product_title
    FROM reports r
    JOIN users u ON u.id = r.patient_id
    JOIN products p ON p.id = r.product_id
    ORDER BY r.created_at DESC
  `)
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { patient_id, product_id, booking_id, sample_date, notes, biomarkers, source_file_url, status } = body

  if (!patient_id || !product_id || !sample_date) {
    return NextResponse.json({ error: 'patient_id, product_id and sample_date are required' }, { status: 400 })
  }

  const [report] = await query<{ id: string }>(
    `INSERT INTO reports (patient_id, product_id, booking_id, sample_date, notes, biomarkers, source_file_url, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      patient_id,
      product_id,
      booking_id || null,
      sample_date,
      notes || null,
      JSON.stringify(biomarkers ?? []),
      source_file_url || null,
      status || 'draft',
    ]
  )

  return NextResponse.json({ id: report.id }, { status: 201 })
}
