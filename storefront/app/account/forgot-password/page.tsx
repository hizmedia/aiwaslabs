'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSubmitted(true)
  }

  const inputCls = 'w-full rounded-[10px] border border-[#dde4f0] bg-[#F7F6FC] px-4 py-3 font-poppins text-[13.5px] text-[#02034a] placeholder-[#9ca3af] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.12)] transition'

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F6FC]">
      <div className="border-b border-[#dde4f0] bg-white px-6 py-4">
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png"
            alt="AiwasLabs" width={130} height={42}
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">

          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
              Patient Portal
            </span>
            <h1 className="mt-2 font-merriweather text-[28px] font-extrabold tracking-[-0.02em] text-[#02034a]">
              Reset password
            </h1>
            <p className="mt-1 font-poppins text-[13.5px] text-[#6b7280]">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_4px_20px_rgba(2,3,74,.08)]">
            <div className="p-6">
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(13,171,118,.1)]">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0DAB76" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-merriweather text-[17px] font-extrabold text-[#02034a]">Check your inbox</p>
                    <p className="mt-1 font-poppins text-[13px] text-[#6b7280]">
                      If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link. It expires in 1 hour.
                    </p>
                  </div>
                  <Link
                    href="/account/login"
                    className="mt-2 font-poppins text-[13px] font-semibold text-[#00B4D8] hover:text-[#0077b6] transition"
                  >
                    Back to sign in
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
                      Email address
                    </label>
                    <input
                      type="email" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full rounded-full bg-[#00B4D8] py-3.5 font-poppins text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(0,180,216,.35)] transition hover:bg-[#0077b6] disabled:opacity-60"
                  >
                    {loading ? 'Sending…' : 'Send reset link'}
                  </button>
                  <Link
                    href="/account/login"
                    className="text-center font-poppins text-[12.5px] text-[#6b7280] hover:text-[#02034a] transition"
                  >
                    Back to sign in
                  </Link>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
