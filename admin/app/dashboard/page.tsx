import { query } from '@/lib/db'

async function getStats() {
  const [products, bookings, patients, reports] = await Promise.all([
    query<{ count: string }>('SELECT COUNT(*) FROM products WHERE available = true'),
    query<{ count: string }>('SELECT COUNT(*) FROM bookings WHERE status IN (\'pending\', \'confirmed\')'),
    query<{ count: string }>('SELECT COUNT(*) FROM users WHERE role = \'patient\''),
    query<{ count: string }>('SELECT COUNT(*) FROM reports'),
  ])
  return {
    products: products[0].count,
    bookings: bookings[0].count,
    patients: patients[0].count,
    reports: reports[0].count,
  }
}

async function getRecentBookings() {
  return query<{
    id: string
    booking_date: string
    booking_time: string
    booking_type: string
    status: string
    first_name: string
    last_name: string
    title: string
  }>(`
    SELECT b.id, b.booking_date, b.booking_time, b.booking_type, b.status,
           u.first_name, u.last_name, p.title
    FROM bookings b
    JOIN users u ON u.id = b.patient_id
    JOIN products p ON p.id = b.product_id
    ORDER BY b.created_at DESC
    LIMIT 5
  `)
}

const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-600',
  confirmed: 'bg-[rgba(0,180,216,.1)] text-[#0077b6]',
  completed: 'bg-[rgba(13,171,118,.1)] text-[#0DAB76]',
  cancelled: 'bg-red-50 text-red-500',
}

export default async function DashboardPage() {
  const [stats, recentBookings] = await Promise.all([getStats(), getRecentBookings()])

  const STAT_CARDS = [
    { label: 'Active Products',    value: stats.products, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: '#00B4D8' },
    { label: 'Upcoming Bookings',  value: stats.bookings, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: '#0DAB76' },
    { label: 'Registered Patients',value: stats.patients, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: '#0077b6' },
    { label: 'Reports Generated',  value: stats.reports,  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: '#02034a' },
  ]

  return (
    <div>
      {/* Page title */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
          Overview
        </span>
        <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">
          Good morning, Doctor.
        </h1>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2">
        {STAT_CARDS.map(({ label, value, icon, color }) => (
          <div key={label} className="rounded-2xl border border-[#dde4f0] bg-white p-5 shadow-[0_1px_3px_rgba(2,3,74,.06)]">
            <div className="flex items-center justify-between">
              <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">{label}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px]" style={{ backgroundColor: color + '18' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon}/>
                </svg>
              </div>
            </div>
            <p className="mt-3 font-merriweather text-[32px] font-black leading-none text-[#02034a]">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_3px_rgba(2,3,74,.06)]">
        <div className="flex items-center justify-between border-b border-[#dde4f0] px-5 py-4">
          <p className="font-poppins text-[12px] font-bold uppercase tracking-[0.12em] text-[#02034a]">Recent Bookings</p>
          <a href="/dashboard/calendar" className="font-poppins text-[11.5px] font-semibold text-[#00B4D8] hover:underline">
            View calendar →
          </a>
        </div>

        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p className="font-poppins text-[13px] text-[#6b7280]">No bookings yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#dde4f0]">
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-[8px] bg-[#02034a]">
                  <span className="font-jetbrains text-[7px] font-bold text-[rgba(255,255,255,.5)]">
                    {new Date(b.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="font-poppins text-[11px] font-bold text-[#00B4D8]">{b.booking_time.slice(0,5)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-[13px] font-semibold text-[#02034a] truncate">
                    {b.first_name} {b.last_name}
                  </p>
                  <p className="font-poppins text-[11.5px] text-[#6b7280] truncate">{b.title} · {b.booking_type}</p>
                </div>
                <span className={`rounded-full px-2.5 py-[3px] font-poppins text-[10px] font-bold uppercase tracking-[0.06em] ${STATUS_STYLE[b.status]}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
