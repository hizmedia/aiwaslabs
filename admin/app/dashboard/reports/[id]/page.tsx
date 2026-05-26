import { notFound } from 'next/navigation'
import { query } from '@/lib/db'
import ReportForm from '@/components/ReportForm'

interface Biomarker {
  name: string
  value: string
  unit: string
  reference_range: string
}

async function getData(id: string) {
  const [report, patients, products] = await Promise.all([
    query<{
      id: string
      patient_id: string
      product_id: string
      booking_id: string | null
      sample_date: string
      notes: string | null
      biomarkers: Biomarker[]
      first_name: string
      last_name: string
      product_title: string
    }>(`
      SELECT r.*, u.first_name, u.last_name, p.title AS product_title
      FROM reports r
      JOIN users u ON u.id = r.patient_id
      JOIN products p ON p.id = r.product_id
      WHERE r.id = $1
    `, [id]),
    query<{ id: string; first_name: string; last_name: string; email: string }>(
      `SELECT id, first_name, last_name, email FROM users WHERE role = 'patient' ORDER BY last_name, first_name`
    ),
    query<{ id: string; title: string }>(
      `SELECT id, title FROM products WHERE available = true ORDER BY title`
    ),
  ])

  return { report: report[0] ?? null, patients, products }
}

export default async function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { report, patients, products } = await getData(id)

  if (!report) notFound()

  return (
    <div>
      <div className="mb-6">
        <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
          Reports / Edit
        </span>
        <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">
          {report.first_name} {report.last_name} — {report.product_title}
        </h1>
      </div>

      <div className="rounded-2xl border border-[#dde4f0] bg-white p-6 shadow-[0_1px_3px_rgba(2,3,74,.06)]">
        <ReportForm
          mode="edit"
          id={report.id}
          patients={patients}
          products={products}
          initial={{
            patient_id: report.patient_id,
            product_id: report.product_id,
            booking_id: report.booking_id ?? '',
            sample_date: String(report.sample_date).slice(0, 10),
            notes: report.notes ?? '',
            biomarkers: report.biomarkers?.length ? report.biomarkers : [{ name: '', value: '', unit: '', reference_range: '' }],
          }}
        />
      </div>
    </div>
  )
}
