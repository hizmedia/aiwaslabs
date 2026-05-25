'use client'

import { useState, useEffect, useCallback } from 'react'
import NewBookingModal from '@/components/NewBookingModal'

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  booking_type: 'clinic' | 'home'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes: string | null
  patient_id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  product_id: string
  product_title: string
}

const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-600 border-amber-100',
  confirmed: 'bg-[rgba(0,180,216,.08)] text-[#0077b6] border-[rgba(0,119,182,.15)]',
  completed: 'bg-[rgba(13,171,118,.08)] text-[#0DAB76] border-[rgba(13,171,118,.15)]',
  cancelled: 'bg-red-50 text-red-400 border-red-100',
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function toLocalDate(dateStr: string) {
  // booking_date comes as 'YYYY-MM-DD' or ISO string — parse as local
  return dateStr.split('T')[0]
}

export default function CalendarPage() {
  const todayStr = new Date().toISOString().split('T')[0]
  const todayYear = new Date().getFullYear()
  const todayMonth = new Date().getMonth()

  const [year, setYear] = useState(todayYear)
  const [month, setMonth] = useState(todayMonth)
  const [selected, setSelected] = useState<string>(todayStr)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const [showNewBooking, setShowNewBooking] = useState(false)

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings?month=${monthKey}`)
      setBookings(await res.json())
    } finally {
      setLoading(false)
    }
  }, [monthKey])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }
  function goToday() {
    setYear(todayYear); setMonth(todayMonth); setSelected(todayStr)
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await fetchBookings()
    setUpdating(null)
  }

  // Build calendar grid (Mon–Sun)
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7 // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  // group bookings by local date string
  const byDate = bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    const d = toLocalDate(b.booking_date)
    ;(acc[d] ??= []).push(b)
    return acc
  }, {})

  const selectedBookings = byDate[selected] ?? []
  const selectedDisplay = selected
    ? new Date(selected + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    : ''

  function dayKey(d: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  return (
    <div>
      <NewBookingModal
        isOpen={showNewBooking}
        defaultDate={selected ?? undefined}
        onClose={() => setShowNewBooking(false)}
        onCreated={fetchBookings}
      />

      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
            Calendar
          </span>
          <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">Booking Calendar</h1>
        </div>
        <button
          onClick={() => setShowNewBooking(true)}
          className="inline-flex items-center gap-2 rounded-[8px] bg-[#02034a] px-4 py-2 font-poppins text-[12px] font-bold text-white shadow hover:bg-[#030466] transition"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          New Booking
        </button>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4 items-start max-[1024px]:grid-cols-1">
        {/* Left: calendar */}
        <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_3px_rgba(2,3,74,.06)] overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between border-b border-[#dde4f0] px-5 py-4">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#dde4f0] text-[#6b7280] hover:border-[#00B4D8] hover:text-[#00B4D8] transition">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <h2 className="font-merriweather text-[15px] font-bold text-[#02034a] min-w-[140px] text-center">
                {MONTH_NAMES[month]} {year}
              </h2>
              <button onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#dde4f0] text-[#6b7280] hover:border-[#00B4D8] hover:text-[#00B4D8] transition">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
            <button onClick={goToday} className="rounded-[6px] border border-[#dde4f0] px-3 py-1 font-poppins text-[11px] font-semibold text-[#6b7280] hover:border-[#00B4D8] hover:text-[#00B4D8] transition">
              Today
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 border-b border-[#dde4f0]">
            {DAY_LABELS.map(d => (
              <div key={d} className="py-2 text-center font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#6b7280] font-poppins text-[13px]">Loading…</div>
          ) : (
            <div className="grid grid-cols-7">
              {cells.map((day, i) => {
                if (!day) return <div key={i} className="h-14 border-b border-r border-[#f3f4f6] last:border-r-0" />
                const k = dayKey(day)
                const dayBookings = byDate[k] ?? []
                const isToday = k === todayStr
                const isSelected = k === selected
                const hasPending = dayBookings.some(b => b.status === 'pending')
                const hasConfirmed = dayBookings.some(b => b.status === 'confirmed')

                return (
                  <button
                    key={i}
                    onClick={() => setSelected(k)}
                    className={`h-14 flex flex-col items-center justify-start pt-2 gap-1 border-b border-r border-[#f3f4f6] last:border-r-0 transition hover:bg-[#f8faff] ${isSelected ? 'bg-[#02034a]' : ''}`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full font-poppins text-[12px] font-semibold transition
                      ${isSelected ? 'text-white' : isToday ? 'bg-[#00B4D8] text-white' : 'text-[#02034a]'}`}>
                      {day}
                    </span>
                    {dayBookings.length > 0 && (
                      <div className="flex gap-[3px]">
                        {hasPending && <span className="h-[5px] w-[5px] rounded-full bg-amber-400" />}
                        {hasConfirmed && <span className="h-[5px] w-[5px] rounded-full bg-[#00B4D8]" />}
                        {!hasPending && !hasConfirmed && <span className="h-[5px] w-[5px] rounded-full bg-[#0DAB76]" />}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 border-t border-[#dde4f0] px-5 py-3">
            {[['amber-400','Pending'],['#00B4D8','Confirmed'],['#0DAB76','Completed/Other']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="h-[7px] w-[7px] rounded-full flex-shrink-0" style={{ background: c.startsWith('#') ? c : undefined, backgroundColor: c.startsWith('amber') ? '#fbbf24' : undefined }} />
                <span className="font-poppins text-[10.5px] text-[#6b7280]">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: selected day panel */}
        <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_3px_rgba(2,3,74,.06)] overflow-hidden sticky top-4">
          <div className="border-b border-[#dde4f0] px-5 py-4">
            <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">Selected Day</p>
            <p className="mt-0.5 font-merriweather text-[14px] font-bold text-[#02034a]">{selectedDisplay || '—'}</p>
          </div>

          {selectedBookings.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center px-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p className="font-poppins text-[12.5px] text-[#6b7280]">No bookings on this day</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f3f4f6] max-h-[520px] overflow-y-auto">
              {selectedBookings
                .sort((a, b) => a.booking_time.localeCompare(b.booking_time))
                .map(b => (
                <div key={b.id} className="px-4 py-4">
                  {/* Time + type */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-poppins text-[12px] font-bold text-[#02034a]">
                      {b.booking_time.slice(0, 5)}
                    </span>
                    <span className="rounded-[4px] border px-2 py-[2px] font-poppins text-[10px] font-bold uppercase tracking-[0.06em] text-[#6b7280] border-[#dde4f0]">
                      {b.booking_type}
                    </span>
                  </div>

                  {/* Patient */}
                  <p className="font-poppins text-[13px] font-semibold text-[#02034a]">
                    {b.first_name} {b.last_name}
                  </p>
                  <p className="font-poppins text-[11.5px] text-[#6b7280] mb-2">{b.product_title}</p>

                  {/* Status badge */}
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-[3px] font-poppins text-[10px] font-bold uppercase tracking-[0.06em] ${STATUS_STYLE[b.status]}`}>
                    {b.status}
                  </span>

                  {/* Action buttons */}
                  {b.status === 'pending' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => updateStatus(b.id, 'confirmed')}
                        disabled={updating === b.id}
                        className="flex-1 rounded-[6px] bg-[#00B4D8] py-1.5 font-poppins text-[11px] font-bold text-white hover:bg-[#0094b3] transition disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, 'cancelled')}
                        disabled={updating === b.id}
                        className="flex-1 rounded-[6px] border border-red-200 py-1.5 font-poppins text-[11px] font-bold text-red-400 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {b.status === 'confirmed' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => updateStatus(b.id, 'completed')}
                        disabled={updating === b.id}
                        className="flex-1 rounded-[6px] bg-[#0DAB76] py-1.5 font-poppins text-[11px] font-bold text-white hover:bg-[#0a9465] transition disabled:opacity-50"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, 'cancelled')}
                        disabled={updating === b.id}
                        className="rounded-[6px] border border-red-200 px-3 py-1.5 font-poppins text-[11px] font-bold text-red-400 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {b.notes && (
                    <p className="mt-2 rounded-[6px] bg-[#f8faff] px-3 py-2 font-poppins text-[11.5px] text-[#6b7280] italic">
                      {b.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
