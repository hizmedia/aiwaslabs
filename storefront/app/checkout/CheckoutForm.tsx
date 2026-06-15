'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CartItem {
  cart_id: string
  product_id: string
  title: string
  price: string
  images: string[]
  slug: string
}

interface Props {
  cartItems: CartItem[]
  defaultName: string
  defaultEmail: string
  defaultPhone: string
  defaultDob: string
  defaultAddressLine1: string
  defaultCity: string
  defaultPostcode: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function CheckoutForm({
  cartItems,
  defaultEmail,
  defaultPhone,
  defaultDob,
  defaultAddressLine1,
  defaultCity,
  defaultPostcode,
}: Props) {
  const router = useRouter()

  const [title, setTitle]       = useState('Mr')
  const [gender, setGender]     = useState('Unknown')
  const [phone, setPhone]       = useState(defaultPhone)
  const [dob, setDob]           = useState(defaultDob)
  const [addressLine1, setAddrLine1] = useState(defaultAddressLine1)
  const [city, setCity]         = useState(defaultCity)
  const [postcode, setPostcode] = useState(defaultPostcode)
  const [country]               = useState('United Kingdom')

  const [consentTerms,  setConsentTerms]  = useState(false)
  const [consentData,   setConsentData]   = useState(false)
  const [consentKit,    setConsentKit]    = useState(false)
  const [consentAge,    setConsentAge]    = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [orderIds, setOrderIds] = useState<string[]>([])

  const inputBase = 'w-full px-4 py-3 rounded-xl border border-[#dde4f0] bg-white font-poppins text-[14px] text-[#02034a] placeholder-[#b0b8c8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 focus:border-[#00B4D8] transition'
  const selectBase = 'w-full px-4 py-3 rounded-xl border border-[#dde4f0] bg-white font-poppins text-[14px] text-[#02034a] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 focus:border-[#00B4D8] transition appearance-none cursor-pointer'
  const labelBase = 'block font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280] mb-1.5'

  const validate = () => {
    const next: Record<string, string> = {}
    if (!phone.trim())        next.phone        = 'Required'
    if (!addressLine1.trim()) next.addressLine1 = 'Required'
    if (!city.trim())         next.city         = 'Required'
    if (!consentTerms)        next.consentTerms = 'Required'
    if (!consentData)         next.consentData  = 'Required'
    if (!consentKit)          next.consentKit   = 'Required'
    if (!consentAge)          next.consentAge   = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          gender,
          delivery_phone: phone.trim(),
          date_of_birth: dob || null,
          address_line1: addressLine1.trim(),
          city: city.trim(),
          postcode: postcode.trim(),
          country,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Checkout failed')
      }
      const data = await res.json()
      setOrderIds(data.order_ids ?? [])
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="mx-auto max-w-lg text-center py-16">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#0DAB76]/15 border border-[#0DAB76]/30">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0DAB76" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="font-merriweather text-[28px] font-extrabold text-[#02034a]">Order Placed!</h2>
        <p className="mt-3 font-poppins text-[15px] text-[#6b7280] leading-relaxed max-w-sm mx-auto">
          Your home test kit{orderIds.length > 1 ? 's are' : ' is'} being prepared and will be dispatched to your delivery address. We'll email you once it ships.
        </p>
        {orderIds.length > 0 && (
          <div className="mt-4 space-y-1">
            {orderIds.map(id => (
              <p key={id} className="font-jetbrains text-[11px] text-[#b0b8c8]">
                Ref: {id.slice(0, 8).toUpperCase()}
              </p>
            ))}
          </div>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/account')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#02034a] px-6 py-3 font-poppins text-[14px] font-bold text-white hover:bg-[#011B50] transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => router.push('/products')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dde4f0] px-6 py-3 font-poppins text-[14px] font-semibold text-[#6b7280] hover:border-[#02034a] hover:text-[#02034a] transition"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    )
  }

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

        {/* ── Delivery form ── */}
        <div>
          <h2 className="font-merriweather text-[20px] font-extrabold text-[#02034a] mb-6">Your Details</h2>

          <div className="space-y-4">
            {/* Title + Gender row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>Title</label>
                <div className="relative">
                  <select value={title} onChange={e => setTitle(e.target.value)} className={selectBase}>
                    {['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label className={labelBase}>Gender</label>
                <div className="relative">
                  <select value={gender} onChange={e => setGender(e.target.value)} className={selectBase}>
                    <option value="Unknown">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className={labelBase}>Email</label>
              <input
                type="email"
                value={defaultEmail}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-[#dde4f0] bg-[#F7F6FC] font-poppins text-[14px] text-[#6b7280] cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className={labelBase}>Phone <span className="text-red-400">*</span></label>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setErrors(er => ({ ...er, phone: '' })) }}
                placeholder="+44 7..."
                className={`${inputBase} ${errors.phone ? 'border-red-300 focus:border-red-400' : ''}`}
              />
              {errors.phone && <p className="mt-1 font-poppins text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className={labelBase}>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className={`${inputBase} scheme-light`}
              />
              <p className="mt-1 font-poppins text-[11px] text-[#b0b8c8]">Required for laboratory processing</p>
            </div>

            <div className="pt-2">
              <h3 className="font-merriweather text-[16px] font-extrabold text-[#02034a] mb-4">Delivery Address</h3>

              {/* Address Line 1 */}
              <div className="mb-3">
                <label className={labelBase}>Address Line 1 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={e => { setAddrLine1(e.target.value); setErrors(er => ({ ...er, addressLine1: '' })) }}
                  placeholder="House number and street name"
                  className={`${inputBase} ${errors.addressLine1 ? 'border-red-300 focus:border-red-400' : ''}`}
                />
                {errors.addressLine1 && <p className="mt-1 font-poppins text-xs text-red-500">{errors.addressLine1}</p>}
              </div>

              {/* City + Postcode */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelBase}>City <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => { setCity(e.target.value); setErrors(er => ({ ...er, city: '' })) }}
                    placeholder="London"
                    className={`${inputBase} ${errors.city ? 'border-red-300 focus:border-red-400' : ''}`}
                  />
                  {errors.city && <p className="mt-1 font-poppins text-xs text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className={labelBase}>Postcode</label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={e => setPostcode(e.target.value)}
                    placeholder="SW1A 1AA"
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Country (read-only) */}
              <div>
                <label className={labelBase}>Country</label>
                <input
                  type="text"
                  value={country}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-[#dde4f0] bg-[#F7F6FC] font-poppins text-[14px] text-[#6b7280] cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_2px_16px_rgba(2,3,74,.05)] overflow-hidden">
            <div className="border-b border-[#dde4f0] px-5 py-4">
              <p className="font-poppins text-[12px] font-bold uppercase tracking-[0.12em] text-[#02034a]">Order Summary</p>
            </div>

            <div className="divide-y divide-[#f3f4f6]">
              {cartItems.map(item => (
                <div key={item.cart_id} className="flex items-center gap-3 px-5 py-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#F7F6FC] overflow-hidden">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins text-[13px] font-semibold text-[#02034a] truncate">{item.title}</p>
                    <p className="font-poppins text-[11px] text-[#6b7280] mt-0.5">Home Test Kit</p>
                  </div>
                  <p className="font-merriweather text-[15px] font-bold text-[#02034a] whitespace-nowrap">£{item.price}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#dde4f0] px-5 py-4 space-y-2">
              <div className="flex items-center justify-between font-poppins text-[13px] text-[#6b7280]">
                <span>Shipping</span>
                <span className="font-semibold text-[#0DAB76]">Free</span>
              </div>
              <div className="flex items-center justify-between font-poppins text-[13px] text-[#6b7280]">
                <span>Pre-paid return envelope</span>
                <span className="font-semibold text-[#0DAB76]">Included</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#f3f4f6]">
                <span className="font-merriweather text-[16px] font-extrabold text-[#02034a]">Total</span>
                <span className="font-merriweather text-[20px] font-extrabold text-[#02034a]">£{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[#F7F6FC] border-t border-[#dde4f0] px-5 py-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {[
                { text: 'Free delivery',    icon: 'M5 12h14M12 5l7 7-7 7' },
                { text: 'Pre-paid returns', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
                { text: 'Doctor-reviewed',  icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
              ].map(({ text, icon }) => (
                <span key={text} className="inline-flex items-center gap-1.5 font-poppins text-[11px] text-[#6b7280]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                  </svg>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Consent ── */}
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#dde4f0] bg-[#F7F6FC] p-4">
            <p className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9ca3af]">Agreements &amp; Consent</p>
            {([
              {
                key: 'consentTerms', state: consentTerms, set: setConsentTerms,
                label: <>I have read and agree to the <a href="/terms" target="_blank" className="text-[#00B4D8] underline hover:text-[#0077b6]">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-[#00B4D8] underline hover:text-[#0077b6]">Privacy Policy</a></>,
              },
              {
                key: 'consentData', state: consentData, set: setConsentData,
                label: 'I consent to AiwasLabs and its accredited laboratory partners processing my health and test result data for the purpose of providing diagnostic services (UK GDPR Article 9)',
              },
              {
                key: 'consentKit', state: consentKit, set: setConsentKit,
                label: 'I understand that home test kits are non-refundable once dispatched, and that samples must be returned within the timeframe stated in the kit instructions',
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
                    state ? 'border-[#02034a] bg-[#02034a]' : errors[key] ? 'border-red-400 bg-white' : 'border-[#dde4f0] bg-white'
                  }`}>
                    {state && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                </span>
                <span className={`font-poppins text-[12.5px] leading-[1.5] ${errors[key] ? 'text-red-600' : 'text-[#374151]'}`}>
                  {label} <span className="text-red-400">*</span>
                </span>
              </label>
            ))}
          </div>

          {status === 'error' && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-poppins text-[12.5px] text-red-600">
              Something went wrong. Please try again or contact support.
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#02034a] py-4 font-poppins font-bold text-[15px] text-white shadow-[0_6px_20px_rgba(2,3,74,.2)] hover:-translate-y-px hover:bg-[#011B50] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Placing Order…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                Place Order
              </>
            )}
          </button>

          <p className="mt-3 text-center font-poppins text-[11px] text-[#b0b8c8]">
            Secure &amp; private · Results reviewed by a doctor
          </p>
        </div>
      </div>
    </div>
  )
}
