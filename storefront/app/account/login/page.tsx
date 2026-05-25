'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PatientLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/account'

  const [tab, setTab]           = useState<'login' | 'register'>('login')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // Login state
  const [loginEmail, setLoginEmail]     = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register state
  const [regFirst, setRegFirst]     = useState('')
  const [regLast, setRegLast]       = useState('')
  const [regEmail, setRegEmail]     = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')

  useEffect(() => { setError('') }, [tab])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    })
    setLoading(false)
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Login failed')
      return
    }
    router.push(from)
    router.refresh()
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (regPassword !== regConfirm) { setError('Passwords do not match'); return }
    if (regPassword.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: regFirst, last_name: regLast, email: regEmail, password: regPassword }),
    })
    setLoading(false)
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Registration failed')
      return
    }
    router.push(from)
    router.refresh()
  }

  const inputCls = 'w-full rounded-[10px] border border-[#dde4f0] bg-[#F7F6FC] px-4 py-3 font-poppins text-[13.5px] text-[#02034a] placeholder-[#9ca3af] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.12)] transition'

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F6FC]">
      {/* Top bar */}
      <div className="border-b border-[#dde4f0] bg-white px-6 py-4">
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png"
            alt="AiwasLabs"
            width={130} height={42}
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">

          {/* Header */}
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
              Patient Portal
            </span>
            <h1 className="mt-2 font-merriweather text-[28px] font-extrabold tracking-[-0.02em] text-[#02034a]">
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="mt-1 font-poppins text-[13.5px] text-[#6b7280]">
              {tab === 'login'
                ? 'Sign in to view your bookings and results.'
                : 'Set up your account to track bookings and results.'}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_4px_20px_rgba(2,3,74,.08)]">
            {/* Tabs */}
            <div className="flex border-b border-[#dde4f0]">
              {(['login', 'register'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-3.5 font-poppins text-[13px] font-semibold transition-colors ${
                    tab === t
                      ? 'border-b-2 border-[#00B4D8] bg-white text-[#02034a]'
                      : 'bg-[#F7F6FC] text-[#6b7280] hover:text-[#02034a]'
                  }`}
                >
                  {t === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 font-poppins text-[12.5px] text-red-600">
                  {error}
                </div>
              )}

              {/* ── Login form ── */}
              {tab === 'login' && (
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Email</label>
                    <input
                      type="email" required value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Password</label>
                    <input
                      type="password" required value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputCls}
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="mt-2 w-full rounded-full bg-[#00B4D8] py-3.5 font-poppins text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(0,180,216,.35)] transition hover:bg-[#0077b6] disabled:opacity-60"
                  >
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* ── Register form ── */}
              {tab === 'register' && (
                <form onSubmit={handleRegister} className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">First Name</label>
                      <input type="text" required value={regFirst} onChange={e => setRegFirst(e.target.value)}
                        placeholder="Sarah" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Last Name</label>
                      <input type="text" required value={regLast} onChange={e => setRegLast(e.target.value)}
                        placeholder="Jones" className={inputCls} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Email</label>
                    <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      placeholder="you@example.com" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Password</label>
                    <input type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min. 8 characters" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Confirm Password</label>
                    <input type="password" required value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                      placeholder="••••••••" className={inputCls} />
                  </div>
                  <button type="submit" disabled={loading}
                    className="mt-2 w-full rounded-full bg-[#02034a] py-3.5 font-poppins text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(2,3,74,.25)] transition hover:bg-[#0077b6] disabled:opacity-60"
                  >
                    {loading ? 'Creating account…' : 'Create Account'}
                  </button>
                  <p className="text-center font-poppins text-[11.5px] text-[#6b7280]">
                    Already booked with us? Use the same email to claim your account.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link href="/" className="font-poppins text-[12.5px] text-[#00B4D8] hover:text-[#0077b6] transition">
              ← Back to AiwasLabs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
