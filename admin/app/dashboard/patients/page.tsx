import { query } from '@/lib/db'

async function getPatients() {
  return query<{
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    date_of_birth: string | null
    created_at: string
    booking_count: string
    report_count: string
  }>(`
    SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.date_of_birth, u.created_at,
           COUNT(DISTINCT b.id) AS booking_count,
           COUNT(DISTINCT r.id) AS report_count
    FROM users u
    LEFT JOIN bookings b ON b.patient_id = u.id
    LEFT JOIN reports  r ON r.patient_id = u.id
    WHERE u.role = 'patient'
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `)
}

function initials(first: string, last: string) {
  return (first[0] ?? '') + (last[0] ?? '')
}

function age(dob: string | null) {
  if (!dob) return '—'
  const birth = new Date(dob)
  const today = new Date()
  let a = today.getFullYear() - birth.getFullYear()
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) a--
  return `${a} yrs`
}

const AVATAR_COLOURS = [
  'bg-[rgba(0,180,216,.15)] text-[#0077b6]',
  'bg-[rgba(13,171,118,.12)] text-[#0DAB76]',
  'bg-[rgba(2,3,74,.1)] text-[#02034a]',
  'bg-amber-50 text-amber-600',
]

export default async function PatientsPage() {
  const patients = await getPatients()

  return (
    <div>
      <div className="mb-6">
        <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
          Patients
        </span>
        <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">Patients</h1>
      </div>

      <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_3px_rgba(2,3,74,.06)] overflow-hidden">
        {patients.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <p className="font-poppins text-[13px] text-[#6b7280]">No registered patients yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#dde4f0] bg-[#f8faff]">
                {['Patient', 'Email', 'Phone', 'Age', 'Joined', 'Bookings', 'Reports', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {patients.map((p, i) => (
                <tr key={p.id} className="hover:bg-[#fafbff] transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-poppins text-[11px] font-bold ${AVATAR_COLOURS[i % AVATAR_COLOURS.length]}`}>
                        {initials(p.first_name, p.last_name)}
                      </div>
                      <p className="font-poppins text-[13px] font-semibold text-[#02034a] whitespace-nowrap">
                        {p.first_name} {p.last_name}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-poppins text-[12.5px] text-[#6b7280]">{p.email}</td>
                  <td className="px-4 py-3 font-poppins text-[12.5px] text-[#6b7280]">{p.phone ?? '—'}</td>
                  <td className="px-4 py-3 font-poppins text-[12.5px] text-[#6b7280]">{age(p.date_of_birth)}</td>
                  <td className="px-4 py-3 font-poppins text-[12.5px] text-[#6b7280] whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-[rgba(0,180,216,.08)] px-2.5 py-[3px] font-poppins text-[11px] font-bold text-[#0077b6]">
                      {p.booking_count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-[rgba(13,171,118,.08)] px-2.5 py-[3px] font-poppins text-[11px] font-bold text-[#0DAB76]">
                      {p.report_count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/dashboard/patients/${p.id}`}
                      className="font-poppins text-[11.5px] font-semibold text-[#00B4D8] hover:underline whitespace-nowrap">
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
  )
}
