'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Session = { id: string; email: string; first_name: string; last_name: string }

type Booking = {
  id: string
  booking_date: string
  booking_time: string
  booking_type: string
  status: string
  notes: string | null
  product_title: string
  product_slug: string
  product_price: string
  created_at: string
}

type CartItem = {
  id: string
  product_id: string
  title: string
  price: string
  images: string[]
  slug: string
  created_at: string
}

type Tab = 'bookings' | 'cart' | 'account'

const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-600',
  confirmed: 'bg-[rgba(0,180,216,.1)] text-[#0077b6]',
  completed: 'bg-[rgba(13,171,118,.1)] text-[#0DAB76]',
  cancelled: 'bg-red-50 text-red-500',
}

export default function AccountDashboard() {
  const router = useRouter()
  const [session, setSession]   = useState<Session | null>(null)
  const [tab, setTab]           = useState<Tab>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [cart, setCart]         = useState<CartItem[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadingCart, setLoadingCart]         = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      if (!data) { router.replace('/account/login'); return }
      setSession(data)
    }).catch(() => router.replace('/account/login'))
  }, [router])

  const fetchBookings = useCallback(() => {
    setLoadingBookings(true)
    fetch('/api/bookings').then(r => r.json()).then(data => {
      setBookings(Array.isArray(data) ? data : [])
    }).finally(() => setLoadingBookings(false))
  }, [])

  const fetchCart = useCallback(() => {
    setLoadingCart(true)
    fetch('/api/cart').then(r => r.json()).then(data => {
      setCart(Array.isArray(data) ? data : [])
    }).finally(() => setLoadingCart(false))
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])
  useEffect(() => { fetchCart() }, [fetchCart])

  async function removeFromCart(id: string) {
    await fetch(`/api/cart/${id}`, { method: 'DELETE' })
    setCart(prev => prev.filter(i => i.id !== id))
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6FC]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00B4D8] border-t-transparent" />
      </div>
    )
  }

  const initials = `${session.first_name[0] ?? ''}${session.last_name[0] ?? ''}`.toUpperCase()

  const tabs: { key: Tab; label: string; icon: string; count?: number }[] = [
    {
      key: 'bookings', label: 'Bookings',
      icon: 'M8 2v4M16 2v4M3 10h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z',
      count: bookings.length || undefined,
    },
    {
      key: 'cart', label: 'Cart',
      icon: 'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6',
      count: cart.length || undefined,
    },
    {
      key: 'account', label: 'Profile',
      icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F6FC]">
      {/* Top bar */}
      <div className="border-b border-[#dde4f0] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <Link href="/">
            <Image
              src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png"
              alt="AiwasLabs"
              width={130} height={42}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <Link href="/" className="font-poppins text-[12px] text-[#6b7280] transition hover:text-[#02034a]">
            ← Back to site
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 py-10">
        <div className="w-full max-w-3xl">

          {/* Profile header */}
          <div className="mb-6 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#011B50_0%,#02034a_55%,#010238_100%)] px-6 py-5 shadow-[0_8px_30px_rgba(2,3,74,.2)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_80%_20%,rgba(0,180,216,.15),transparent_70%)]" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#00B4D8] shadow-[0_4px_12px_rgba(0,180,216,.4)]">
                  <span className="font-merriweather text-[18px] font-extrabold text-white">{initials}</span>
                </div>
                <div>
                  <p className="font-merriweather text-[17px] font-extrabold text-white">
                    {session.first_name} {session.last_name}
                  </p>
                  <p className="font-poppins text-[12px] text-white/50">{session.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex-shrink-0 rounded-full border border-white/20 px-4 py-[7px] font-poppins text-[11.5px] font-semibold text-white/70 transition hover:border-white/50 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-[14px] border border-[#dde4f0] bg-white p-1 shadow-[0_2px_8px_rgba(2,3,74,.05)]">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative flex flex-1 items-center justify-center gap-2 rounded-[10px] py-2.5 font-poppins text-[12.5px] font-semibold transition ${
                  tab === t.key
                    ? 'bg-[#02034a] text-white shadow-[0_2px_8px_rgba(2,3,74,.2)]'
                    : 'text-[#6b7280] hover:bg-[#F7F6FC] hover:text-[#02034a]'
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={t.icon} />
                </svg>
                {t.label}
                {t.count !== undefined && (
                  <span className={`ml-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 font-poppins text-[9px] font-bold ${
                    tab === t.key ? 'bg-white/20 text-white' : 'bg-[#CAF0F8] text-[#0077b6]'
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── BOOKINGS ── */}
          {tab === 'bookings' && (
            <div className="overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_4px_18px_rgba(2,3,74,.06)]">
              <div className="border-b border-[#dde4f0] bg-[#F7F6FC] px-5 py-3">
                <span className="font-poppins text-[11px] font-bold uppercase tracking-[0.14em] text-[#02034a]">My Bookings</span>
              </div>

              {loadingBookings ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00B4D8] border-t-transparent" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <p className="font-poppins text-[13px] text-[#6b7280]">No bookings yet</p>
                  <Link href="/products" className="mt-1 rounded-full bg-[#00B4D8] px-5 py-2 font-poppins text-[12.5px] font-bold text-white transition hover:bg-[#0077b6]">
                    Browse Tests
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#dde4f0]">
                  {bookings.map(b => {
                    const datePart = String(b.booking_date).slice(0, 10)
                    const dateObj  = new Date(`${datePart}T12:00:00`)
                    const dayNum   = dateObj.toLocaleDateString('en-GB', { day: '2-digit' })
                    const month    = dateObj.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
                    const rawTime  = String(b.booking_time).slice(0, 5)
                    const [hh, mm] = rawTime.split(':').map(Number)
                    const ampm     = hh >= 12 ? 'pm' : 'am'
                    const h12      = hh % 12 || 12
                    const timeStr  = `${h12}:${String(mm).padStart(2, '0')} ${ampm}`

                    return (
                      <div key={b.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                        <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-[10px] bg-[#02034a]">
                          <span className="font-jetbrains text-[8px] font-bold text-white/40">{month}</span>
                          <span className="font-jetbrains text-[15px] font-bold leading-none text-[#00B4D8]">{dayNum}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-merriweather text-[14px] font-extrabold text-[#02034a] truncate">{b.product_title}</p>
                          <p className="font-poppins text-[11.5px] text-[#6b7280]">
                            {timeStr} · {b.booking_type === 'clinic' ? 'Clinic Visit' : 'Home Visit'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-3 py-[4px] font-poppins text-[10px] font-bold uppercase tracking-[0.08em] ${STATUS_STYLE[b.status] ?? 'bg-[#F7F6FC] text-[#6b7280]'}`}>
                            {b.status}
                          </span>
                          <Link
                            href={`/products/${b.product_slug}`}
                            className="rounded-full border border-[#dde4f0] px-3 py-[5px] font-poppins text-[11px] font-semibold text-[#02034a] transition hover:border-[#00B4D8] hover:text-[#00B4D8]"
                          >
                            View test
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── CART ── */}
          {tab === 'cart' && (
            <div className="overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_4px_18px_rgba(2,3,74,.06)]">
              <div className="border-b border-[#dde4f0] bg-[#F7F6FC] px-5 py-3">
                <span className="font-poppins text-[11px] font-bold uppercase tracking-[0.14em] text-[#02034a]">My Cart</span>
              </div>

              {loadingCart ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00B4D8] border-t-transparent" />
                </div>
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <p className="font-poppins text-[13px] text-[#6b7280]">Your cart is empty</p>
                  <Link href="/products" className="mt-1 rounded-full bg-[#00B4D8] px-5 py-2 font-poppins text-[12.5px] font-bold text-white transition hover:bg-[#0077b6]">
                    Browse Tests
                  </Link>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-[#dde4f0]">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[10px] bg-[#F7F6FC]">
                          {item.images?.[0] ? (
                            <Image src={item.images[0]} alt={item.title} fill className="object-cover" sizes="56px" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-merriweather text-[14px] font-extrabold text-[#02034a] truncate">{item.title}</p>
                          <p className="font-poppins text-[12px] text-[#6b7280]">Home Collection Kit · £{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/products/${item.slug}`}
                            className="rounded-full border border-[#dde4f0] px-3 py-[5px] font-poppins text-[11px] font-semibold text-[#02034a] transition hover:border-[#00B4D8] hover:text-[#00B4D8]"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-red-50 hover:text-red-500"
                            aria-label="Remove"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#dde4f0] bg-[#F7F6FC] px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">Total</p>
                        <p className="font-jetbrains text-[22px] font-bold text-[#02034a]">
                          £{cart.reduce((s, i) => s + parseFloat(i.price), 0).toFixed(2)}
                        </p>
                      </div>
                      <button className="rounded-full bg-[#00B4D8] px-6 py-3 font-poppins text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(0,180,216,.35)] transition hover:bg-[#0077b6]">
                        Checkout
                      </button>
                    </div>
                    <p className="mt-2 font-poppins text-[10.5px] text-[#6b7280]">
                      After checkout, a confirmation email is sent and your kit is dispatched within 1 working day.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab === 'account' && (
            <div className="overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_4px_18px_rgba(2,3,74,.06)]">
              <div className="border-b border-[#dde4f0] bg-[#F7F6FC] px-5 py-3">
                <span className="font-poppins text-[11px] font-bold uppercase tracking-[0.14em] text-[#02034a]">Profile</span>
              </div>
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'First Name', value: session.first_name },
                    { label: 'Last Name',  value: session.last_name },
                    { label: 'Email',      value: session.email },
                  ].map(({ label, value }) => (
                    <div key={label} className={`flex flex-col gap-1 ${label === 'Email' ? 'sm:col-span-2' : ''}`}>
                      <span className="font-poppins text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">{label}</span>
                      <span className="font-poppins text-[13.5px] text-[#02034a]">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-[#dde4f0] pt-5">
                  <p className="mb-3 font-poppins text-[11px] font-bold uppercase tracking-[0.12em] text-[#02034a]">Account</p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-[8px] border border-red-100 px-4 py-2.5 font-poppins text-[12px] font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
