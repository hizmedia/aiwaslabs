'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Login failed')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#02034a] flex items-center justify-center px-4">

      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(80% 80% at 50% 40%, #000, transparent)',
          WebkitMaskImage: 'radial-gradient(80% 80% at 50% 40%, #000, transparent)',
        }}
      />
      {/* Cyan glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(55%_50%_at_50%_30%,rgba(0,180,216,.14),transparent_70%)]" />

      <div className="relative z-10 w-full max-w-[380px]">

        {/* Logo area */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-[8px] font-poppins text-[10px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[1.5px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
            Admin Access
          </span>
          <h1 className="mt-2 font-merriweather text-[28px] font-black leading-tight text-white">
            AiwasLabs
          </h1>
          <p className="mt-1 font-poppins text-[12px] text-[rgba(255,255,255,.45)] uppercase tracking-[0.14em]">
            Doctor &amp; Admin Dashboard
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] p-7 backdrop-blur-sm shadow-[0_24px_48px_rgba(0,0,0,.3)]">

          {/* Protected badge */}
          <div className="mb-5 flex items-center gap-2 rounded-full border border-[rgba(255,165,0,.25)] bg-[rgba(255,165,0,.08)] px-3 py-[6px] w-fit">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="font-poppins text-[10.5px] font-semibold text-[#f97316]">
              Admin-only route — protected
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(255,255,255,.6)]">
                Email <span className="text-[#00B4D8]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@aiwas.co.uk"
                required
                className="w-full rounded-[10px] border border-[rgba(255,255,255,.15)] bg-[rgba(255,255,255,.08)] px-4 py-3 font-poppins text-[13.5px] text-white placeholder-[rgba(255,255,255,.3)] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.15)] transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(255,255,255,.6)]">
                Password <span className="text-[#00B4D8]">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                className="w-full rounded-[10px] border border-[rgba(255,255,255,.15)] bg-[rgba(255,255,255,.08)] px-4 py-3 font-poppins text-[13.5px] text-white placeholder-[rgba(255,255,255,.3)] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.15)] transition"
              />
            </div>

            {error && (
              <p className="rounded-[8px] bg-[rgba(194,39,45,.15)] border border-[rgba(194,39,45,.3)] px-3 py-2 font-poppins text-[12px] text-[#f87171]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-full bg-[#00B4D8] py-3 font-poppins text-[13.5px] font-bold text-white shadow-[0_6px_18px_rgba(0,180,216,.35)] transition hover:bg-[#0077b6] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-poppins text-[11px] text-[rgba(255,255,255,.3)]">
          AiwasLabs · Private Blood Testing · Stoke-on-Trent
        </p>
      </div>
    </div>
  )
}
