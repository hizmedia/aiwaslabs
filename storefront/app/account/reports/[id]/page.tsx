import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { query } from '@/lib/db'
import { getPatientSession } from '@/lib/auth'
import ReportViewer from './ReportViewer'

interface Biomarker {
  name: string
  value: string | null
  unit: string | null
  reference_range: string | null
  flag: string | null
}

interface DocumentJson {
  personalized_enabled?: boolean
  personalized_content?: string
  category_notes?: Record<string, string>
}

async function getReport(id: string, patientId: string) {
  const [report] = await query<{
    id: string
    sample_date: string
    notes: string | null
    biomarkers: Biomarker[]
    document_json: DocumentJson | null
    product_title: string
    first_name: string
    last_name: string
    email: string
  }>(
    `SELECT r.id, r.sample_date, r.notes, r.biomarkers, r.document_json,
            p.title AS product_title,
            u.first_name, u.last_name, u.email
     FROM reports r
     JOIN products p ON p.id = r.product_id
     JOIN users u ON u.id = r.patient_id
     WHERE r.id = $1
       AND r.patient_id = $2
       AND r.status = 'finalised'`,
    [id, patientId]
  )
  return report ?? null
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getPatientSession()
  if (!session) redirect('/account/login')

  const { id } = await params
  const report = await getReport(id, session.id)
  if (!report) notFound()

  return <ReportViewer report={report} />
}
