import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getPatientSession } from '@/lib/auth'

export async function GET() {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const reports = await query<{
    id: string
    sample_date: string
    status: string
    created_at: string
    biomarker_count: number
    product_title: string
    product_slug: string
  }>(
    `SELECT r.id, r.sample_date, r.status, r.created_at,
            jsonb_array_length(r.biomarkers) AS biomarker_count,
            p.title AS product_title, p.slug AS product_slug
     FROM reports r
     JOIN products p ON p.id = r.product_id
     WHERE r.patient_id = $1
       AND r.status = 'finalised'
     ORDER BY r.sample_date DESC, r.created_at DESC`,
    [session.id]
  )

  return NextResponse.json(reports)
}
