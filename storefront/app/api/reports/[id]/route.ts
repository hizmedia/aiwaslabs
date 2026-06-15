import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getPatientSession } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params

  const [report] = await query<{
    id: string
    sample_date: string
    notes: string | null
    status: string
    biomarkers: { name: string; value: string | null; unit: string | null; reference_range: string | null; flag: string | null }[]
    document_json: { personalized_enabled?: boolean; personalized_content?: string; category_notes?: Record<string, string> } | null
    product_title: string
    first_name: string
    last_name: string
    email: string
  }>(
    `SELECT r.id, r.sample_date, r.notes, r.status, r.biomarkers, r.document_json,
            p.title AS product_title,
            u.first_name, u.last_name, u.email
     FROM reports r
     JOIN products p ON p.id = r.product_id
     JOIN users u ON u.id = r.patient_id
     WHERE r.id = $1
       AND r.patient_id = $2
       AND r.status = 'finalised'`,
    [id, session.id]
  )

  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(report)
}
