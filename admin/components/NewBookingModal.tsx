'use client'

import { useState, useEffect } from 'react'

interface Patient { id: string; first_name: string; last_name: string; email: string }
interface Product { id: string; title: string; product_type: string }

interface Props {
  isOpen: boolean
  defaultDate?: string
  onClose: () => void
  onCreated: () => void
}

export default function NewBookingModal({ isOpen, defaultDate, onClose, onCreated }: Props) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [patientId, setPatientId] = useState('')
  const [productId, setProductId] = useState('')
  const [date, setDate] = useState(defaultDate ?? '')
  const [time, setTime] = useState('09:00')
  const [type, setType] = useState<'clinic' | 'home'>('clinic')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    Promise.all([
      fetch('/api/patients').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]).then(([p, pr]) => { setPatients(p); setProducts(pr) })
    setDate(defaultDate ?? '')
    setPatientId(''); setProductId(''); setNotes(''); setError('')
  }, [isOpen, defaultDate])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId, product_id: productId, booking_date: date, booking_time: time, booking_type: type, notes }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error'); setSaving(false); return }
    onCreated()
    onClose()
    setSaving(false)
  }

  const INPUT = 'w-full rounded-[8px] border border-[#dde4f0] bg-white px-3 py-2 font-poppins text-[13px] text-[#02034a] placeholder-[#a0aec0] focus:border-[#00B4D8] focus:outline-none transition'
  const LABEL = 'mb-1 block font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#6b7280]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[rgba(2,3,74,.4)] backdrop-blur-[2px]" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[480px] rounded-2xl bg-white shadow-[0_24px_60px_rgba(2,3,74,.2)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dde4f0] px-6 py-4">
          <div>
            <p className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#00B4D8]">Calendar</p>
            <h2 className="font-merriweather text-[17px] font-extrabold text-[#02034a]">New Booking</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#f3f4f6] transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-[8px] bg-red-50 border border-red-100 px-3 py-2 font-poppins text-[12px] text-red-500">{error}</div>
          )}

          {/* Patient */}
          <div>
            <label className={LABEL}>Patient</label>
            <select value={patientId} onChange={e => setPatientId(e.target.value)} required className={INPUT}>
              <option value="">Select patient…</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.first_name} {p.last_name} — {p.email}</option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div>
            <label className={LABEL}>Test / Product</label>
            <select value={productId} onChange={e => setProductId(e.target.value)} required className={INPUT}>
              <option value="">Select test…</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} required className={INPUT} />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className={LABEL}>Appointment Type</label>
            <div className="flex gap-2">
              {(['clinic', 'home'] as const).map(t => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`flex-1 rounded-[8px] border py-2 font-poppins text-[12px] font-bold transition capitalize ${
                    type === t
                      ? 'border-[#00B4D8] bg-[rgba(0,180,216,.07)] text-[#0077b6]'
                      : 'border-[#dde4f0] text-[#6b7280] hover:border-[#00B4D8]'
                  }`}>
                  {t === 'clinic' ? '🏥 Clinic Visit' : '📦 Home Kit'}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={LABEL}>Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              className={INPUT + ' resize-none'} placeholder="Any special instructions…" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 rounded-[8px] bg-[#02034a] py-2.5 font-poppins text-[12.5px] font-bold text-white hover:bg-[#030466] transition disabled:opacity-50">
              {saving ? 'Booking…' : 'Create Booking'}
            </button>
            <button type="button" onClick={onClose}
              className="rounded-[8px] border border-[#dde4f0] px-5 py-2.5 font-poppins text-[12.5px] font-semibold text-[#6b7280] hover:text-[#02034a] transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
