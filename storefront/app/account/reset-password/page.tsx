'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPasswordPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const token        = searchParams.get('token') ?? ''

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const inputCls = 'w-full rounded-[10px] border border-[#dde4f0] bg-[#F7F6FC] px-4 py-3 font-poppins text-[13.5px] text-[#02034a] placeholder-[#9ca3af] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.12)] transition'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters'); return }

    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    setLoading(false)

    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Failed to reset password.')
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/account/login'), 3000)
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6FC] px-4">
        <div className="text-center">
          <p className="font-merriweather text-[18px] font-extrabold text-[#02034a]">Invalid link</p>
          <p className="mt-2 font-poppins text-[13px] text-[#6b7280]">This reset link is missing or malformed.</p>
          <Link href="/account/forgot-password" className="mt-4 inline-block font-poppins text-[13px] font-semibold text-[#00B4D8] hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

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
              Choose a new password
            </h1>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_4px_20px_rgba(2,3,74,.08)]">
            <div className="p-6">
              {success ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(13,171,118,.1)]">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0DAB76" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-merriweather text-[17px] font-extrabold text-[#02034a]">Password updated</p>
                    <p className="mt-1 font-poppins text-[13px] text-[#6b7280]">
                      Redirecting you to sign in…
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {error && (
                    <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 font-poppins text-[12.5px] text-red-600">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
                      New password
                    </label>
                    <input
                      type="password" required value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
                      Confirm new password
                    </label>
                    <input
                      type="password" required value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className={inputCls}
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full rounded-full bg-[#02034a] py-3.5 font-poppins text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(2,3,74,.25)] transition hover:bg-[#0077b6] disabled:opacity-60"
                  >
                    {loading ? 'Updating…' : 'Update password'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link href="/account/forgot-password" className="font-poppins text-[12.5px] text-[#6b7280] hover:text-[#02034a] transition">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
