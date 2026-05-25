import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const [report] = await query<{
    id: string
    sample_date: string
    notes: string
    biomarkers: { name: string; value: string; unit: string; reference_range: string }[]
    pdf_url: string | null
    created_at: string
    patient_id: string
    first_name: string
    last_name: string
    email: string
    product_id: string
    product_title: string
    booking_id: string | null
  }>(`
    SELECT r.*, u.first_name, u.last_name, u.email, p.title AS product_title
    FROM reports r
    JOIN users u ON u.id = r.patient_id
    JOIN products p ON p.id = r.product_id
    WHERE r.id = $1
  `, [id])

  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(report)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { sample_date, notes, biomarkers } = body

  const [report] = await query<{ id: string }>(
    `UPDATE reports
     SET sample_date = COALESCE($1, sample_date),
         notes       = COALESCE($2, notes),
         biomarkers  = COALESCE($3, biomarkers)
     WHERE id = $4
     RETURNING id`,
    [
      sample_date ?? null,
      notes ?? null,
      biomarkers != null ? JSON.stringify(biomarkers) : null,
      id,
    ]
  )

  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ id: report.id })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await query('DELETE FROM reports WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
