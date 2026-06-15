'use client'

import { useState, useRef, useEffect } from 'react'

interface TimeSlot {
  display: string  // e.g. "6:00 pm"
  value: string    // e.g. "18:00"
  booked: boolean
}

function generateTimeSlots(dateString: string): TimeSlot[] {
  if (!dateString) return []
  const date = new Date(dateString + 'T12:00:00')
  const day = date.getDay()
  const startHour = day === 0 || day === 6 ? 9 : 18
  const slots: TimeSlot[] = []
  for (let h = startHour; h < 21; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      const value = `${hh}:${mm}`
      const ampm = h >= 12 ? 'pm' : 'am'
      const h12 = h % 12 || 12
      const display = `${h12}:${mm} ${ampm}`
      slots.push({ display, value, booked: false })
    }
  }
  return slots
}


function ToggleRow({
  label, price, desc, active, onToggle,
}: {
  label: string; price?: string; desc?: string; active: boolean; onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all text-left ${
        active ? 'bg-white text-[#02034A] border-white shadow-sm' : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
      }`}
    >
      <div className="flex-1">
        <p className={`font-poppins text-[13px] font-semibold ${active ? 'text-[#02034A]' : 'text-white'}`}>{label}</p>
        {desc && <p className={`font-poppins text-[11px] mt-0.5 ${active ? 'text-[#02034A]/65' : 'text-white/60'}`}>{desc}</p>}
      </div>
      {price && <span className={`font-poppins text-[13px] font-bold whitespace-nowrap ${active ? 'text-[#02034A]' : 'text-white'}`}>{price}</span>}
      <span className={`font-poppins text-[10px] font-bold px-2.5 py-1 rounded-full border ${active ? 'border-[#02034A] text-[#02034A] bg-white' : 'border-white/30 text-white/70'}`}>
        {active ? 'Added ✓' : 'Add'}
      </span>
    </button>
  )
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function BookingCard({
  productName,
  productId,
  productType,
}: {
  productName: string
  productId: string
  productType: 'booking' | 'ship' | 'both'
}) {
  const services = productType === 'booking'
    ? [{ key: 'clinic', label: 'Clinic Visit +£29' }]
    : productType === 'ship'
    ? [{ key: 'home', label: 'Home Visit with a Doctor +£49' }]
    : [{ key: 'clinic', label: 'Clinic Visit +£29' }, { key: 'home', label: 'Home Visit with a Doctor +£49' }]

  const [selectedService, setSelectedService] = useState(services[0].key as 'clinic' | 'home')
  const [measurements, setMeasurements] = useState(false)
  const [b12, setB12] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  const [consentTerms,   setConsentTerms]   = useState(false)
  const [consentMedical, setConsentMedical] = useState(false)
  const [consentData,    setConsentData]    = useState(false)
  const [consentAge,     setConsentAge]     = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [bookingId, setBookingId] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const timeDisplayRef = useRef('')

  useEffect(() => {
    if (!preferredDate) { setTimeSlots([]); return }
    const base = generateTimeSlots(preferredDate)
    setTimeSlots(base)
    setLoadingSlots(true)
    fetch(`/api/availability?date=${preferredDate}`)
      .then(r => r.json())
      .then(({ booked }: { booked: string[] }) => {
        setTimeSlots(base.map(s => ({ ...s, booked: booked.includes(s.value) })))
      })
      .catch(() => {})
      .finally(() => setLoadingSlots(false))
  }, [preferredDate])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!firstName.trim()) next.firstName = 'Required'
    if (!lastName.trim()) next.lastName = 'Required'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Valid email required'
    if (!phone.trim()) next.phone = 'Required'
    if (!preferredDate) next.date = 'Please choose a date'
    if (!preferredTime) next.time = 'Please choose a time'
    if (!consentTerms)   next.consentTerms   = 'Required'
    if (!consentMedical) next.consentMedical = 'Required'
    if (!consentData)    next.consentData    = 'Required'
    if (!consentAge)     next.consentAge     = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const buildNotes = () => {
    const parts: string[] = []
    if (measurements) parts.push('+ Personal health measurements (BMI, Heart Rate, Blood Pressure) +£10')
    if (b12) parts.push('+ Vitamin B12 Injections +£30')
    return parts.join('\n') || null
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          product_id: productId,
          booking_date: preferredDate,
          booking_time: preferredTime,
          booking_type: selectedService,
          notes: buildNotes(),
        }),
      })
      if (!res.ok) throw new Error('Booking failed')
      const data = await res.json()
      setBookingId(data.id)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const inputBase = 'w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/35 font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-white/50 transition'
  const labelBase = 'block font-poppins text-[10px] font-bold uppercase tracking-[0.12em] text-white/45 mb-1.5'

  if (status === 'success') {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#011B50_0%,#02034a_55%,#010238_100%)] p-8 shadow-[0_20px_50px_rgba(2,3,74,.3)] text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_80%_20%,rgba(0,180,216,.14),transparent_70%)]" />
        <div className="relative z-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#0DAB76]/20 border border-[#0DAB76]/40">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0DAB76" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="font-merriweather text-[22px] font-extrabold text-white">Booking Received!</h2>
          <p className="mt-3 font-poppins text-[14px] text-white/65 leading-relaxed max-w-sm mx-auto">
            Your booking request for <strong className="text-white">{productName}</strong> has been sent. We'll confirm your appointment shortly.
          </p>
          {bookingId && (
            <p className="mt-3 font-jetbrains text-[11px] text-white/30">
              Ref: {bookingId.slice(0, 8).toUpperCase()}
            </p>
          )}
          <p className="mt-4 font-poppins text-[12px] text-white/40">
            Check your email for confirmation details.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#011B50_0%,#02034a_55%,#010238_100%)] p-6 shadow-[0_20px_50px_rgba(2,3,74,.3)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_80%_20%,rgba(0,180,216,.14),transparent_70%)]" />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:40px_40px]"
        style={{ maskImage: 'radial-gradient(70% 60% at 50% 50%, #000, transparent 100%)', WebkitMaskImage: 'radial-gradient(70% 60% at 50% 50%, #000, transparent 100%)' }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-merriweather text-[17px] font-extrabold text-white">Book Your Appointment</h2>
          <div className="flex items-center gap-1.5 font-poppins text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0DAB76] shadow-[0_0_0_3px_rgba(13,171,118,.2)]" />
            Available Now
          </div>
        </div>

        {/* Service type */}
        {services.length > 1 && (
          <div className="mb-4">
            <label className={labelBase}>Service Type</label>
            <div className="flex flex-wrap gap-2">
              {services.map(s => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSelectedService(s.key as 'clinic' | 'home')}
                  className={`rounded-full px-3 py-1.5 font-poppins text-xs font-semibold border transition ${
                    selectedService === s.key
                      ? 'bg-white text-[#02034A] border-white shadow-sm'
                      : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/15'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons */}
        <div className="mb-4">
          <label className={labelBase}>Additional Services</label>
          <div className="space-y-2">
            <ToggleRow label="Personal health measurements" desc="BMI, Heart Rate / Blood Pressure" price="+£10" active={measurements} onToggle={() => setMeasurements(m => !m)} />
            <ToggleRow label="Vitamin B12 Injections" desc="Optional B12 booster shot" price="+£30" active={b12} onToggle={() => setB12(b => !b)} />
          </div>
        </div>

        <div className="my-4 h-px bg-white/7" />

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelBase}>First Name <span className="text-red-400">*</span></label>
            <input type="text" value={firstName} onChange={e => { setFirstName(e.target.value); setErrors(er => ({ ...er, firstName: '' })) }}
              placeholder="First name"
              className={`${inputBase} ${errors.firstName ? 'border-red-400' : 'border-white/20'}`}
            />
            {errors.firstName && <p className="mt-1 font-poppins text-xs text-red-300">{errors.firstName}</p>}
          </div>
          <div>
            <label className={labelBase}>Last Name <span className="text-red-400">*</span></label>
            <input type="text" value={lastName} onChange={e => { setLastName(e.target.value); setErrors(er => ({ ...er, lastName: '' })) }}
              placeholder="Last name"
              className={`${inputBase} ${errors.lastName ? 'border-red-400' : 'border-white/20'}`}
            />
            {errors.lastName && <p className="mt-1 font-poppins text-xs text-red-300">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelBase}>Email <span className="text-red-400">*</span></label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(er => ({ ...er, email: '' })) }}
              placeholder="your@email.com"
              className={`${inputBase} ${errors.email ? 'border-red-400' : 'border-white/20'}`}
            />
            {errors.email && <p className="mt-1 font-poppins text-xs text-red-300">{errors.email}</p>}
          </div>
          <div>
            <label className={labelBase}>Phone <span className="text-red-400">*</span></label>
            <input type="tel" value={phone} onChange={e => { setPhone(e.target.value); setErrors(er => ({ ...er, phone: '' })) }}
              placeholder="+44 7..."
              className={`${inputBase} ${errors.phone ? 'border-red-400' : 'border-white/20'}`}
            />
            {errors.phone && <p className="mt-1 font-poppins text-xs text-red-300">{errors.phone}</p>}
          </div>
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className={labelBase}>Date <span className="text-red-400">*</span></label>
            <input
              type="date"
              value={preferredDate}
              onChange={e => {
                setPreferredDate(e.target.value)
                setPreferredTime('')
                timeDisplayRef.current = ''
                setShowTimeDropdown(false)
                setErrors(er => ({ ...er, date: '', time: '' }))
              }}
              min={today}
              className={`${inputBase} scheme-dark ${errors.date ? 'border-red-400' : 'border-white/20'}`}
            />
            {errors.date && <p className="mt-1 font-poppins text-xs text-red-300">{errors.date}</p>}
          </div>

          <div className="relative">
            <label className={labelBase}>Time <span className="text-red-400">*</span></label>
            <button
              type="button"
              onClick={() => preferredDate && setShowTimeDropdown(v => !v)}
              disabled={!preferredDate}
              className={`w-full text-left px-4 py-3 rounded-xl border font-poppins text-sm flex items-center justify-between transition ${
                !preferredDate
                  ? 'bg-white/5 border-white/10 text-white/25 cursor-not-allowed'
                  : `bg-white/10 ${errors.time ? 'border-red-400' : 'border-white/20'} text-white/60 hover:text-white`
              }`}
            >
              <span className={preferredTime ? 'text-white' : 'text-white/35'}>{timeDisplayRef.current || 'Choose Time'}</span>
              <svg className={`w-4 h-4 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showTimeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl z-20 border border-[#dde4f0] max-h-44 overflow-y-auto">
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-4">
                    <svg className="animate-spin h-4 w-4 text-[#00B4D8]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  </div>
                ) : (
                  timeSlots.map(slot => (
                    <button key={slot.value} type="button"
                      disabled={slot.booked}
                      onClick={() => {
                        setPreferredTime(slot.value)
                        timeDisplayRef.current = slot.display
                        setShowTimeDropdown(false)
                        setErrors(er => ({ ...er, time: '' }))
                      }}
                      className={`w-full text-left px-4 py-2.5 font-poppins text-[13px] first:rounded-t-xl last:rounded-b-xl transition-colors flex items-center justify-between ${
                        slot.booked
                          ? 'text-[#b0b8c8] cursor-not-allowed bg-[#f8faff]'
                          : 'text-[#02034a] hover:bg-[#F7F6FC]'
                      }`}
                    >
                      {slot.display}
                      {slot.booked && (
                        <span className="font-poppins text-[10px] font-bold text-[#b0b8c8]">Booked</span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
            {errors.time && <p className="mt-1 font-poppins text-xs text-red-300">{errors.time}</p>}
          </div>
        </div>

        {/* ── Consent ── */}
        <div className="mb-4 flex flex-col gap-2.5 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="font-poppins text-[9.5px] font-bold uppercase tracking-[0.16em] text-white/35">Agreements &amp; Consent</p>
          {([
            {
              key: 'consentTerms', state: consentTerms, set: setConsentTerms,
              label: <>I agree to the <a href="/terms" target="_blank" className="text-[#00B4D8] underline">Terms of Service</a> including the cancellation policy</>,
            },
            {
              key: 'consentMedical', state: consentMedical, set: setConsentMedical,
              label: 'I understand AiwasLabs provides private diagnostic testing only - not a substitute for NHS or GP care. In an emergency I will call 999',
            },
            {
              key: 'consentData', state: consentData, set: setConsentData,
              label: <>I consent to AiwasLabs processing my health and test result data as described in the <a href="/privacy" target="_blank" className="text-[#00B4D8] underline">Privacy Policy</a> (UK GDPR Article 9)</>,
            },
            {
              key: 'consentAge', state: consentAge, set: setConsentAge,
              label: 'I confirm I am 18 years of age or older (or have parental/guardian consent)',
            },
          ] as const).map(({ key, state, set, label }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <span className="relative mt-[2px] flex-shrink-0">
                <input
                  type="checkbox" checked={state}
                  onChange={e => { set(e.target.checked); setErrors(er => ({ ...er, [key]: '' })) }}
                  className="sr-only"
                />
                <span className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                  state ? 'border-[#00B4D8] bg-[#00B4D8]' : errors[key] ? 'border-red-400 bg-white/10' : 'border-white/25 bg-white/10'
                }`}>
                  {state && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </span>
              <span className={`font-poppins text-[11.5px] leading-[1.5] ${errors[key] ? 'text-red-300' : 'text-white/65'}`}>
                {label} <span className="text-red-400">*</span>
              </span>
            </label>
          ))}
        </div>

        {status === 'error' && (
          <p className="mb-3 rounded-xl bg-red-500/20 border border-red-400/30 px-4 py-2.5 font-poppins text-[12px] text-red-300">
            Something went wrong. Please try again.
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-poppins font-bold text-[15px] tracking-[0.03em] transition-all bg-[#00B4D8] text-white shadow-[0_6px_20px_rgba(0,180,216,.4)] hover:-translate-y-px hover:bg-[#0077b6] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Booking...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Confirm Booking
            </>
          )}
        </button>

        <p className="mt-3 text-center font-poppins text-[10px] text-white/30">
          No referral needed · Doctor-reviewed · Same-day results
        </p>
      </div>
    </div>
  )
}
