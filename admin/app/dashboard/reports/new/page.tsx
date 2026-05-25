import { query } from '@/lib/db'
import ReportForm from '@/components/ReportForm'

async function getData() {
  const [patients, products] = await Promise.all([
    query<{ id: string; first_name: string; last_name: string; email: string }>(
      `SELECT id, first_name, last_name, email FROM users WHERE role = 'patient' ORDER BY last_name, first_name`
    ),
    query<{ id: string; title: string }>(
      `SELECT id, title FROM products WHERE available = true ORDER BY title`
    ),
  ])
  return { patients, products }
}

export default async function NewReportPage() {
  const { patients, products } = await getData()

  return (
    <div>
      <div className="mb-6">
        <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
          Reports / New
        </span>
        <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">Create Report</h1>
      </div>

      <div className="rounded-2xl border border-[#dde4f0] bg-white p-6 shadow-[0_1px_3px_rgba(2,3,74,.06)]">
        <ReportForm mode="new" patients={patients} products={products} />
      </div>
    </div>
  )
}
