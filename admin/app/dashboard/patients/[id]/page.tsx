import { notFound } from 'next/navigation'
import { query } from '@/lib/db'

const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-600',
  confirmed: 'bg-[rgba(0,180,216,.08)] text-[#0077b6]',
  completed: 'bg-[rgba(13,171,118,.08)] text-[#0DAB76]',
  cancelled: 'bg-red-50 text-red-400',
}

async function getData(id: string) {
  const [patients, bookings, reports] = await Promise.all([
    query<{
      id: string
      first_name: string
      last_name: string
      email: string
      phone: string | null
      date_of_birth: string | null
      address: string | null
      created_at: string
    }>('SELECT id, first_name, last_name, email, phone, date_of_birth, address, created_at FROM users WHERE id = $1 AND role = \'patient\'', [id]),

    query<{
      id: string
      booking_date: string
      booking_time: string
      booking_type: string
      status: string
      product_title: string
    }>(`
      SELECT b.id, b.booking_date, b.booking_time, b.booking_type, b.status, p.title AS product_title
      FROM bookings b
      JOIN products p ON p.id = b.product_id
      WHERE b.patient_id = $1
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `, [id]),

    query<{
      id: string
      sample_date: string
      created_at: string
      biomarker_count: number
      product_title: string
    }>(`
      SELECT r.id, r.sample_date, r.created_at, jsonb_array_length(r.biomarkers) AS biomarker_count, p.title AS product_title
      FROM reports r
      JOIN products p ON p.id = r.product_id
      WHERE r.patient_id = $1
      ORDER BY r.sample_date DESC
    `, [id]),
  ])

  return { patient: patients[0] ?? null, bookings, reports }
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">{label}</p>
      <p className="mt-0.5 font-poppins text-[13px] text-[#02034a]">{value}</p>
    </div>
  )
}

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { patient, bookings, reports } = await getData(id)

  if (!patient) notFound()

  const initials = (patient.first_name[0] ?? '') + (patient.last_name[0] ?? '')

  return (
    <div>
      <div className="mb-6">
        <a href="/dashboard/patients" className="inline-flex items-center gap-1.5 font-poppins text-[11.5px] font-semibold text-[#6b7280] hover:text-[#02034a] transition mb-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          All Patients
        </a>
        <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
          Patients / Profile
        </span>
        <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">
          {patient.first_name} {patient.last_name}
        </h1>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-4 items-start max-[900px]:grid-cols-1">
        {/* Patient info card */}
        <div className="rounded-2xl border border-[#dde4f0] bg-white p-5 shadow-[0_1px_3px_rgba(2,3,74,.06)]">
          {/* Avatar */}
          <div className="mb-4 flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#02034a] font-merriweather text-[22px] font-extrabold text-white">
              {initials}
            </div>
            <p className="font-merriweather text-[15px] font-bold text-[#02034a]">{patient.first_name} {patient.last_name}</p>
            <p className="font-poppins text-[12px] text-[#6b7280]">{patient.email}</p>
          </div>

          <div className="border-t border-[#f3f4f6] pt-4 space-y-3">
            <InfoRow label="Phone" value={patient.phone ?? '—'} />
            <InfoRow
              label="Date of Birth"
              value={patient.date_of_birth
                ? new Date(patient.date_of_birth + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            />
            <InfoRow label="Address" value={patient.address ?? '—'} />
            <InfoRow
              label="Registered"
              value={new Date(patient.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            />
          </div>

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#f3f4f6] pt-4">
            <div className="rounded-[10px] bg-[rgba(0,180,216,.06)] p-3 text-center">
              <p className="font-merriweather text-[22px] font-black text-[#02034a]">{bookings.length}</p>
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">Bookings</p>
            </div>
            <div className="rounded-[10px] bg-[rgba(13,171,118,.06)] p-3 text-center">
              <p className="font-merriweather text-[22px] font-black text-[#02034a]">{reports.length}</p>
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">Reports</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Bookings */}
          <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_3px_rgba(2,3,74,.06)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#dde4f0] px-5 py-4">
              <p className="font-poppins text-[12px] font-bold uppercase tracking-[0.12em] text-[#02034a]">Bookings</p>
              <a href="/dashboard/calendar" className="font-poppins text-[11.5px] font-semibold text-[#00B4D8] hover:underline">View calendar →</a>
            </div>
            {bookings.length === 0 ? (
              <p className="px-5 py-8 text-center font-poppins text-[13px] text-[#6b7280]">No bookings yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8faff]">
                    {['Date', 'Time', 'Test', 'Type', 'Status'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-[#fafbff]">
                      <td className="px-4 py-3 font-poppins text-[12.5px] text-[#02034a] whitespace-nowrap">
                        {new Date(b.booking_date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 font-poppins text-[12.5px] text-[#6b7280]">{b.booking_time.slice(0, 5)}</td>
                      <td className="px-4 py-3 font-poppins text-[12.5px] text-[#02034a]">{b.product_title}</td>
                      <td className="px-4 py-3 font-poppins text-[12px] text-[#6b7280] capitalize">{b.booking_type}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-[3px] font-poppins text-[10px] font-bold uppercase tracking-[0.06em] ${STATUS_STYLE[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Reports */}
          <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_3px_rgba(2,3,74,.06)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#dde4f0] px-5 py-4">
              <p className="font-poppins text-[12px] font-bold uppercase tracking-[0.12em] text-[#02034a]">Lab Reports</p>
              <a href="/dashboard/reports/new" className="font-poppins text-[11.5px] font-semibold text-[#00B4D8] hover:underline">New report →</a>
            </div>
            {reports.length === 0 ? (
              <p className="px-5 py-8 text-center font-poppins text-[13px] text-[#6b7280]">No reports yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8faff]">
                    {['Sample Date', 'Test', 'Biomarkers', 'Created', ''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {reports.map(r => (
                    <tr key={r.id} className="hover:bg-[#fafbff]">
                      <td className="px-4 py-3 font-poppins text-[12.5px] text-[#02034a] whitespace-nowrap">
                        {new Date(r.sample_date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 font-poppins text-[12.5px] text-[#02034a]">{r.product_title}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-[rgba(0,180,216,.08)] px-2.5 py-[3px] font-poppins text-[11px] font-bold text-[#0077b6]">
                          {r.biomarker_count} markers
                        </span>
                      </td>
                      <td className="px-4 py-3 font-poppins text-[12px] text-[#6b7280] whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-3">
                        <a href={`/dashboard/reports/${r.id}`} className="font-poppins text-[11.5px] font-semibold text-[#00B4D8] hover:underline">
                          View →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
