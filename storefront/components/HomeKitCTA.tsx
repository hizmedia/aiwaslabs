'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function HomeKitCTA({
  productId,
  price,
}: {
  productId: string
  price: string
}) {
  const [session, setSession] = useState<{ first_name: string } | null | undefined>(undefined)
  const [status, setStatus] = useState<'idle' | 'loading' | 'added' | 'error'>('idle')
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => setSession(data))
      .catch(() => setSession(null))
  }, [])

  async function handleAddToCart() {
    setStatus('loading')
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    })
    setStatus(res.ok ? 'added' : 'error')
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_4px_24px_rgba(2,3,74,.07)] flex flex-col h-full">
      <div className="p-6 flex flex-col flex-1">

        {/* ── Flow diagram banner ── */}
        <div className="relative rounded-xl overflow-hidden bg-[linear-gradient(135deg,#011B50_0%,#02034a_55%,#010238_100%)] aspect-[16/8] mb-6">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:32px_32px]"
            style={{ maskImage: 'radial-gradient(70% 60% at 50% 50%, #000, transparent 100%)', WebkitMaskImage: 'radial-gradient(70% 60% at 50% 50%, #000, transparent 100%)' }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_30%_50%,rgba(0,180,216,.2),transparent_70%)]" />
          <div className="relative z-10 h-full flex items-center justify-center gap-6">
            {[
              { label: 'Kit',     icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></> },
              { label: 'Sample',  icon: <><path d="M9 3H7a2 2 0 0 0-2 2v11a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2h-2z"/><path d="M5 9h8"/></> },
              { label: 'Results', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></> },
            ].map(({ label, icon }, i, arr) => (
              <div key={label} className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-xl bg-[rgba(0,180,216,.15)] border border-[rgba(0,180,216,.3)] flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                  </div>
                  <span className="font-poppins text-[10px] font-semibold text-[rgba(255,255,255,.6)]">{label}</span>
                </div>
                {i < arr.length - 1 && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,180,216,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 4-step grid ── */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { step: '01', title: 'Order Online',  icon: <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></> },
            { step: '02', title: 'Test at Home',  icon: <><path d="M9 3H7a2 2 0 0 0-2 2v11a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2h-2z"/><path d="M5 9h8"/></> },
            { step: '03', title: 'Post Sample',   icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></> },
            { step: '04', title: 'Get Results',   icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></> },
          ].map(({ step, title, icon }, i, arr) => (
            <div key={step} className="relative flex flex-col items-center text-center gap-2">
              {i < arr.length - 1 && (
                <div className="absolute top-[18px] left-[calc(50%+18px)] w-full h-px bg-[#dde4f0]" />
              )}
              <div className="relative z-10 w-9 h-9 rounded-full bg-[#F7F6FC] border border-[#dde4f0] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0077b6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
              </div>
              <span className="font-jetbrains text-[9px] font-bold text-[#00B4D8]">{step}</span>
              <p className="font-poppins font-semibold text-[11px] text-[#02034a] leading-tight">{title}</p>
            </div>
          ))}
        </div>

        {/* ── Price + CTA ── */}
        <div className="mt-auto pt-5 border-t border-[#dde4f0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">Home Kit Price</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-poppins text-[12px] text-[#6b7280]">From</span>
                <span className="font-merriweather text-[32px] font-black text-[#02034a] leading-none">£{price}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dde4f0] bg-[#F7F6FC] px-3 py-1 font-poppins text-[10.5px] font-medium text-[#6b7280]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Free delivery
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dde4f0] bg-[#F7F6FC] px-3 py-1 font-poppins text-[10.5px] font-medium text-[#6b7280]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Pre-paid return
              </span>
            </div>
          </div>

          {status === 'error' && (
            <p className="mb-2 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 font-poppins text-[11.5px] text-red-600">
              Something went wrong — please try again.
            </p>
          )}

          {status === 'added' ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#0DAB76] bg-[rgba(13,171,118,.08)] px-6 py-[14px] font-poppins text-[14px] font-bold text-[#0DAB76]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Added to cart
            </div>
          ) : session === undefined ? (
            <div className="h-[52px] animate-pulse rounded-xl bg-[#F7F6FC]" />
          ) : session ? (
            <button
              onClick={handleAddToCart}
              disabled={status === 'loading'}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#02034a] bg-[#02034a] px-6 py-[14px] font-poppins text-[14px] font-bold tracking-[0.03em] text-white shadow-[0_6px_20px_rgba(2,3,74,.18)] transition-all hover:-translate-y-px hover:bg-[#011B50] disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                  Order Home Kit
                </>
              )}
            </button>
          ) : (
            <Link
              href={`/account/login?from=${encodeURIComponent(pathname)}`}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#02034a] bg-[#02034a] px-6 py-[14px] font-poppins text-[14px] font-bold tracking-[0.03em] text-white shadow-[0_6px_20px_rgba(2,3,74,.18)] transition-all hover:-translate-y-px hover:bg-[#011B50]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Sign in to Order Home Kit
            </Link>
          )}

          <p className="mt-3 text-center font-poppins text-[11px] text-[#6b7280]">
            Results reviewed by a doctor · Secure &amp; private
          </p>
        </div>
      </div>
    </div>
  )
}
