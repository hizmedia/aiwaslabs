'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SUBJECTS = [
  'Book a Test',
  'Test Results Enquiry',
  'Home Test Kit',
  'Pricing & Packages',
  'Corporate / Occupational Health',
  'General Enquiry',
]

const INFO = [
  {
    icon: (
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    ),
    label: 'Address',
    lines: ['Unit 6, Parkhall Business Village', 'Park Hall Road, Stoke-on-Trent', 'ST3 5XA'],
    action: { label: 'Get Directions', href: 'https://maps.google.com/?q=Unit+6,+Parkhall+Business+Village,+Park+Hall+Rd,+Stoke-on-Trent+ST3+5XA' },
  },
  {
    icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />,
    label: 'Phone',
    lines: ['01782 917963'],
    action: { label: 'Call Now', href: 'tel:01782917963' },
  },
  {
    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    label: 'Email',
    lines: ['Aiwas@aiwasmedical.com'],
    action: { label: 'Send Email', href: 'mailto:Aiwas@aiwasmedical.com' },
  },
  {
    icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    label: 'Opening Hours',
    lines: ['Mon – Fri: 9:00am – 6:00pm', 'Saturday: 9:00am – 2:00pm', 'Sunday: Closed'],
    action: null,
  },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus]   = useState<Status>('idle')
  const [errors, setErrors]   = useState<Record<string, string>>({})

  const inputCls = (field: string) =>
    `w-full rounded-xl border px-4 py-3 font-poppins text-[14px] text-[#02034a] placeholder-[#b0b8c8] outline-none transition focus:ring-2 focus:ring-[#00B4D8]/25 focus:border-[#00B4D8] bg-white ${
      errors[field] ? 'border-red-300' : 'border-[#dde4f0]'
    }`

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim())    e.name    = 'Required'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required'
    if (!message.trim()) e.message = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setStatus('loading')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, subject, message }),
    })
    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F6FC]">

        {/* Hero */}
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#011B50_0%,#02034a_60%,#010238_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_60%_40%,rgba(0,180,216,.18),transparent_70%)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
              Get in Touch
            </span>
            <h1 className="mt-3 font-merriweather text-[clamp(28px,4.5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
              We&apos;re here to help.
            </h1>
            <p className="mt-4 max-w-[480px] font-poppins text-[15px] leading-[1.65] text-white/65">
              Questions about a test, your results, or booking? Drop us a message and we&apos;ll get back to you within one working day.
            </p>

            {/* Quick contact chips */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="tel:01782917963"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-poppins text-[13px] font-semibold text-white transition hover:bg-white/18 backdrop-blur-sm"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
                </svg>
                01782 917963
              </a>
              <a href="mailto:Aiwas@aiwasmedical.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-poppins text-[13px] font-semibold text-white transition hover:bg-white/18 backdrop-blur-sm"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Aiwas@aiwasmedical.com
              </a>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">

            {/* ── Contact Form ── */}
            <div className="rounded-2xl border border-[#dde4f0] bg-white p-8 shadow-[0_4px_20px_rgba(2,3,74,.06)] lg:p-10">
              <h2 className="font-merriweather text-[22px] font-extrabold text-[#02034a]">Send us a message</h2>
              <p className="mt-1 font-poppins text-[13.5px] text-[#6b7280]">We typically respond within one working day.</p>

              {status === 'success' ? (
                <div className="mt-8 flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(13,171,118,.1)] border border-[rgba(13,171,118,.2)]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0DAB76" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-merriweather text-[19px] font-extrabold text-[#02034a]">Message sent!</p>
                    <p className="mt-1 font-poppins text-[13.5px] text-[#6b7280]">
                      We&apos;ve received your enquiry and will be in touch shortly. Check your inbox for a confirmation.
                    </p>
                  </div>
                  <button
                    onClick={() => { setStatus('idle'); setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('') }}
                    className="mt-2 font-poppins text-[13px] font-semibold text-[#00B4D8] hover:text-[#0077b6] transition"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input type="text" value={name} onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: '' })) }}
                        placeholder="Sarah Jones" className={inputCls('name')} />
                      {errors.name && <p className="mt-1 font-poppins text-[11.5px] text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(er => ({ ...er, email: '' })) }}
                        placeholder="you@example.com" className={inputCls('email')} />
                      {errors.email && <p className="mt-1 font-poppins text-[11.5px] text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">Phone</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+44 7..." className={inputCls('phone')} />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">Subject</label>
                      <div className="relative">
                        <select value={subject} onChange={e => setSubject(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-[#dde4f0] bg-white px-4 py-3 font-poppins text-[14px] text-[#02034a] outline-none transition focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/25 cursor-pointer"
                        >
                          <option value="">Select a subject…</option>
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea value={message} onChange={e => { setMessage(e.target.value); setErrors(er => ({ ...er, message: '' })) }}
                      rows={5} placeholder="Tell us how we can help…"
                      className={`${inputCls('message')} resize-none`}
                    />
                    {errors.message && <p className="mt-1 font-poppins text-[11.5px] text-red-500">{errors.message}</p>}
                  </div>

                  {status === 'error' && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-poppins text-[12.5px] text-red-600">
                      Something went wrong. Please try again or call us directly on 01782 917963.
                    </div>
                  )}

                  <button type="submit" disabled={status === 'loading'}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#02034a] py-4 font-poppins text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(2,3,74,.25)] transition hover:bg-[#0077b6] disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ── Info sidebar ── */}
            <div className="flex flex-col gap-4">
              {INFO.map(({ icon, label, lines, action }) => (
                <div key={label} className="rounded-2xl border border-[#dde4f0] bg-white p-5 shadow-[0_2px_12px_rgba(2,3,74,.05)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#CAF0F8]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0077b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {icon}
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9ca3af]">{label}</p>
                      {lines.map(l => (
                        <p key={l} className="mt-0.5 font-poppins text-[13.5px] font-semibold text-[#02034a]">{l}</p>
                      ))}
                      {action && (
                        <a href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 font-poppins text-[12px] font-semibold text-[#00B4D8] hover:text-[#0077b6] transition"
                        >
                          {action.label}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Book CTA */}
              <div className="rounded-2xl bg-[#02034a] p-6 text-center">
                <p className="font-merriweather text-[17px] font-extrabold text-white">Ready to book?</p>
                <p className="mt-1 font-poppins text-[13px] text-white/60">No referral needed - same-day results.</p>
                <Link href="/products"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00B4D8] px-6 py-3 font-poppins text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(0,180,216,.4)] transition hover:bg-[#0077b6]"
                >
                  View Tests &amp; Prices
                </Link>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-[#dde4f0] shadow-[0_4px_20px_rgba(2,3,74,.06)]">
            <iframe
              title="AiwasLabs location"
              src="https://maps.google.com/maps?q=Unit+6,+Parkhall+Business+Village,+Park+Hall+Rd,+Stoke-on-Trent+ST3+5XA&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="h-[340px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
