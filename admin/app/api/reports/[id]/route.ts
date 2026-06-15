import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendReportReady } from '@/lib/email'

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
  const { sample_date, notes, biomarkers, document_json, status } = body

  const [report] = await query<{ id: string }>(
    `UPDATE reports
     SET sample_date   = COALESCE($1, sample_date),
         notes         = COALESCE($2, notes),
         biomarkers    = COALESCE($3, biomarkers),
         document_json = COALESCE($4, document_json),
         status        = COALESCE($5, status)
     WHERE id = $6
     RETURNING id`,
    [
      sample_date ?? null,
      notes ?? null,
      biomarkers != null ? JSON.stringify(biomarkers) : null,
      document_json != null ? JSON.stringify(document_json) : null,
      status ?? null,
      id,
    ]
  )

  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Send patient notification when report is finalised
  if (status === 'finalised') {
    const [full] = await query<{
      first_name: string; last_name: string; email: string
      product_title: string; sample_date: string | null
    }>(`
      SELECT u.first_name, u.last_name, u.email, p.title AS product_title, r.sample_date
      FROM reports r
      JOIN users u ON u.id = r.patient_id
      JOIN products p ON p.id = r.product_id
      WHERE r.id = $1
    `, [id])

    if (full) {
      sendReportReady({
        firstName: full.first_name,
        lastName: full.last_name,
        email: full.email,
        productTitle: full.product_title,
        reportId: id,
        sampleDate: full.sample_date,
      }).catch(console.error)
    }
  }

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
