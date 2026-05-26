import { notFound } from 'next/navigation'
import { query } from '@/lib/db'
import ReportEditor from './ReportEditor'

interface Biomarker {
  name: string
  value: string | null
  unit: string | null
  reference_range: string | null
  flag: string | null
}

async function getReport(id: string) {
  const [report] = await query<{
    id: string
    patient_id: string
    product_id: string
    booking_id: string | null
    sample_date: string
    notes: string | null
    biomarkers: Biomarker[]
    source_file_url: string | null
    document_json: object | null
    status: string
    first_name: string
    last_name: string
    email: string
    product_title: string
  }>(`
    SELECT r.*, u.first_name, u.last_name, u.email, p.title AS product_title
    FROM reports r
    JOIN users u ON u.id = r.patient_id
    JOIN products p ON p.id = r.product_id
    WHERE r.id = $1
  `, [id])
  return report ?? null
}

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const report = await getReport(id)
  if (!report) notFound()
  return <ReportEditor report={report} />
}
