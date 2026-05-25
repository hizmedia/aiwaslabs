import { query } from '@/lib/db'
import ReportActions from './ReportActions'

async function getReports() {
  return query<{
    id: string
    sample_date: string
    notes: string | null
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
}

export default async function ReportsPage() {
  const reports = await getReports()

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
            Reports
          </span>
          <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">Lab Reports</h1>
        </div>
        <a
          href="/dashboard/reports/new"
          className="inline-flex items-center gap-2 rounded-[8px] bg-[#02034a] px-4 py-2 font-poppins text-[12px] font-bold text-white shadow hover:bg-[#030466] transition"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          New Report
        </a>
      </div>

      <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_3px_rgba(2,3,74,.06)] overflow-hidden">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p className="font-poppins text-[13px] text-[#6b7280]">No reports yet</p>
            <a href="/dashboard/reports/new" className="font-poppins text-[12px] font-semibold text-[#00B4D8] hover:underline">
              Create the first report →
            </a>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#dde4f0] bg-[#f8faff]">
                {['Patient','Test','Sample Date','Biomarkers','Created',''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-[#fafbff] transition">
                  <td className="px-4 py-3">
                    <p className="font-poppins text-[13px] font-semibold text-[#02034a]">
                      {r.first_name} {r.last_name}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-poppins text-[12.5px] text-[#6b7280] max-w-[200px] truncate">
                    {r.product_title}
                  </td>
                  <td className="px-4 py-3 font-poppins text-[12.5px] text-[#02034a]">
                    {new Date(r.sample_date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(0,180,216,.08)] px-2.5 py-[3px] font-poppins text-[11px] font-bold text-[#0077b6]">
                      {r.biomarker_count} markers
                    </span>
                  </td>
                  <td className="px-4 py-3 font-poppins text-[12px] text-[#6b7280]">
                    {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-4 py-3">
                    <ReportActions id={r.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
