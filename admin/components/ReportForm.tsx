'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Patient { id: string; first_name: string; last_name: string; email: string }
interface Product { id: string; title: string }
interface Booking { id: string; booking_date: string; booking_time: string; product_title: string }
interface Biomarker { name: string; value: string; unit: string; reference_range: string }

interface ReportFormProps {
  mode: 'new' | 'edit'
  id?: string
  patients: Patient[]
  products: Product[]
  initial?: {
    patient_id: string
    product_id: string
    booking_id: string
    sample_date: string
    notes: string
    biomarkers: Biomarker[]
  }
}

const EMPTY_BIOMARKER: Biomarker = { name: '', value: '', unit: '', reference_range: '' }

export default function ReportForm({ mode, id, patients, products, initial }: ReportFormProps) {
  const router = useRouter()

  const [patientId, setPatientId] = useState(initial?.patient_id ?? '')
  const [productId, setProductId] = useState(initial?.product_id ?? '')
  const [bookingId, setBookingId] = useState(initial?.booking_id ?? '')
  const [sampleDate, setSampleDate] = useState(initial?.sample_date ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(
    initial?.biomarkers?.length ? initial.biomarkers : [{ ...EMPTY_BIOMARKER }]
  )
  const [patientBookings, setPatientBookings] = useState<Booking[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadPatientBookings(pid: string) {
    if (!pid) { setPatientBookings([]); return }
    const res = await fetch(`/api/bookings?patient=${pid}`)
    if (res.ok) setPatientBookings(await res.json())
  }

  function handlePatientChange(pid: string) {
    setPatientId(pid)
    setBookingId('')
    loadPatientBookings(pid)
  }

  function setBiomarker(i: number, field: keyof Biomarker, val: string) {
    setBiomarkers(prev => prev.map((b, idx) => idx === i ? { ...b, [field]: val } : b))
  }
  function addBiomarker() { setBiomarkers(prev => [...prev, { ...EMPTY_BIOMARKER }]) }
  function removeBiomarker(i: number) { setBiomarkers(prev => prev.filter((_, idx) => idx !== i)) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      patient_id: patientId,
      product_id: productId,
      booking_id: bookingId || null,
      sample_date: sampleDate,
      notes: notes || null,
      biomarkers: biomarkers.filter(b => b.name.trim()),
    }

    const url = mode === 'new' ? '/api/reports' : `/api/reports/${id}`
    const method = mode === 'new' ? 'POST' : 'PATCH'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
      setSaving(false)
      return
    }

    const data = await res.json()
    router.push(`/dashboard/reports/${data.id ?? id}`)
  }

  const INPUT = 'w-full rounded-[8px] border border-[#dde4f0] bg-white px-3 py-2 font-poppins text-[13px] text-[#02034a] placeholder-[#a0aec0] focus:border-[#00B4D8] focus:outline-none transition'
  const LABEL = 'mb-1 block font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-[8px] bg-red-50 border border-red-100 px-4 py-3 font-poppins text-[12.5px] text-red-500">
          {error}
        </div>
      )}

      {/* Patient + Product */}
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={LABEL}>Patient</label>
          <select value={patientId} onChange={e => handlePatientChange(e.target.value)} required className={INPUT}>
            <option value="">Select patient…</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.first_name} {p.last_name} — {p.email}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Test / Product</label>
          <select value={productId} onChange={e => setProductId(e.target.value)} required className={INPUT}>
            <option value="">Select test…</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Booking + Sample date */}
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label className={LABEL}>Link to Booking (optional)</label>
          <select value={bookingId} onChange={e => setBookingId(e.target.value)} className={INPUT} disabled={!patientId}>
            <option value="">No linked booking</option>
            {patientBookings.map(b => (
              <option key={b.id} value={b.id}>
                {b.booking_date.split('T')[0]} {b.booking_time.slice(0,5)} — {b.product_title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Sample Date</label>
          <input type="date" value={sampleDate} onChange={e => setSampleDate(e.target.value)} required className={INPUT} />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={LABEL}>Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className={INPUT + ' resize-none'} placeholder="Internal notes for this report…" />
      </div>

      {/* Biomarkers */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className={LABEL + ' mb-0'}>Biomarker Results</label>
          <button type="button" onClick={addBiomarker} className="font-poppins text-[11px] font-bold text-[#00B4D8] hover:underline">
            + Add marker
          </button>
        </div>

        {/* Column headers */}
        <div className="mb-1 grid grid-cols-[2fr_1fr_1fr_2fr_28px] gap-2 px-1">
          {['Marker Name','Value','Unit','Reference Range',''].map(h => (
            <span key={h} className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">{h}</span>
          ))}
        </div>

        <div className="space-y-2">
          {biomarkers.map((b, i) => (
            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_2fr_28px] gap-2 items-center">
              <input
                value={b.name} onChange={e => setBiomarker(i, 'name', e.target.value)}
                placeholder="e.g. Haemoglobin" className={INPUT}
              />
              <input
                value={b.value} onChange={e => setBiomarker(i, 'value', e.target.value)}
                placeholder="13.5" className={INPUT}
              />
              <input
                value={b.unit} onChange={e => setBiomarker(i, 'unit', e.target.value)}
                placeholder="g/dL" className={INPUT}
              />
              <input
                value={b.reference_range} onChange={e => setBiomarker(i, 'reference_range', e.target.value)}
                placeholder="12.0–16.0" className={INPUT}
              />
              <button
                type="button" onClick={() => removeBiomarker(i)}
                className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#dde4f0] text-[#6b7280] hover:border-red-300 hover:text-red-400 transition"
                aria-label="Remove"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit" disabled={saving}
          className="rounded-[8px] bg-[#02034a] px-6 py-2.5 font-poppins text-[12px] font-bold text-white shadow hover:bg-[#030466] transition disabled:opacity-50"
        >
          {saving ? 'Saving…' : mode === 'new' ? 'Create Report' : 'Save Changes'}
        </button>
        <a href="/dashboard/reports" className="font-poppins text-[12px] text-[#6b7280] hover:text-[#02034a] transition">
          Cancel
        </a>
      </div>
    </form>
  )
}
