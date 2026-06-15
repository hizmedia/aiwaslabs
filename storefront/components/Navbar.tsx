'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import CartDrawer from './CartDrawer'

type Category = { id: string; name: string; slug: string }
type Product  = { id: string; title: string; slug: string; price: string; biomarker_count: number; images: string[] }

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownProducts, setDropdownProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [cartOpen, setCartOpen]   = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const lastCatSlugRef = useRef<string | null>(null)
  if (activeDropdown) lastCatSlugRef.current = activeDropdown

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        setAuthed(!!data?.id)
        if (data?.id) {
          fetch('/api/cart')
            .then(r => r.json())
            .then(items => setCartCount(Array.isArray(items) ? items.length : 0))
            .catch(() => {})
        } else {
          setCartCount(0)
        }
      })
      .catch(() => setAuthed(false))
  }, [pathname])

  useEffect(() => { setMobileOpen(false); setMobileExpanded(null); setActiveDropdown(null) }, [pathname])

  const toggleDropdown = (slug: string) => {
    const next = activeDropdown === slug ? null : slug
    setActiveDropdown(next)
    if (next) {
      fetch(`/api/products?category=${next}`)
        .then(r => r.json())
        .then(setDropdownProducts)
        .catch(() => setDropdownProducts([]))
    }
  }

  return (
    <>
    <header className="sticky top-0 z-50 shadow-[0_2px_16px_rgba(2,3,74,.08)]">

      {/* ── TOP BAR ── */}
      <div className="border-b border-[#dde4f0] bg-[rgba(247,246,252,0.97)] backdrop-blur-[10px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-[10px]">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png"
              alt="AiwasLabs"
              width={140}
              height={44}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop right links */}
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { label: 'Home', href: '/' },
              { label: 'Resources', href: '/resources' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className={`rounded-full px-[10px] py-[7px] font-poppins text-[12px] font-semibold text-[#02034a] transition hover:bg-[#CAF0F8] hover:text-[#0077b6] ${pathname === href || (href !== '/' && pathname.startsWith(href)) ? 'bg-[#CAF0F8] text-[#0077b6]' : ''}`}
              >
                {label}
              </Link>
            ))}
            <div className="mx-2 h-5 w-px bg-[#dde4f0]" />
            <Link href={authed ? '/account' : '/account/login'}
              className="rounded-full border border-[#dde4f0] px-3 py-[7px] font-poppins text-[12px] font-semibold text-[#02034a] transition hover:border-[#00B4D8] hover:text-[#0077b6]"
            >
              {authed ? 'My Account' : 'Login'}
            </Link>

            {/* Cart - desktop */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Cart${cartCount ? ` (${cartCount} items)` : ''}`}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#dde4f0] text-[#02034a] transition hover:border-[#00B4D8] hover:text-[#0077b6]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#00B4D8] px-[3px] font-poppins text-[9px] font-bold text-white shadow-[0_2px_6px_rgba(0,180,216,.5)]">
                  {cartCount}
                </span>
              )}
            </button>

            <Link href="/products"
              className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-[#00B4D8] px-4 py-[8px] font-poppins text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(0,180,216,.35)] transition hover:bg-[#0077b6]"
            >
              Book a Test
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(o => !o)}
            className="flex flex-col gap-[5px] p-2 md:hidden"
          >
            <span className={`block h-[2px] w-[22px] rounded-[2px] bg-[#02034a] transition-all duration-200 ${mobileOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-[2px] w-[22px] rounded-[2px] bg-[#02034a] transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] w-[22px] rounded-[2px] bg-[#02034a] transition-all duration-200 ${mobileOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── BOTTOM BAR (desktop categories) ── */}
      <div className="relative hidden bg-[#02034a] md:block" ref={dropdownRef}>
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8 py-2">

          {/* Find Your Test */}
          <Link
            href="/products"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border-2 border-[#00B4D8] bg-[#00B4D8] px-4 py-[7px] font-poppins text-[12px] font-bold text-white transition hover:bg-[#0077b6] whitespace-nowrap"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            All Tests
          </Link>

          <span className="h-5 w-px flex-shrink-0 bg-white/15" />

          {/* Category buttons */}
          <div className="flex flex-1 items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button key={cat.id}
                onClick={() => toggleDropdown(cat.slug)}
                className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-[6px] font-poppins text-[12px] font-semibold whitespace-nowrap transition ${
                  activeDropdown === cat.slug || (pathname.startsWith('/products') && new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('category') === cat.slug)
                    ? 'bg-white text-[#02034a]'
                    : 'text-white/80 hover:bg-white/12 hover:text-white'
                }`}
              >
                {cat.name}
                <svg width="10" height="10" viewBox="0 0 10 6" fill="none"
                  className={`transition-transform duration-200 ${activeDropdown === cat.slug ? 'rotate-180' : ''}`}
                >
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-shrink-0 flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-3 py-[6px] focus-within:border-[#00B4D8] focus-within:bg-[rgba(0,180,216,.1)] transition">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tests…"
              className="w-[110px] bg-transparent font-poppins text-[12px] text-white placeholder-white/40 outline-none"
            />
          </div>
        </div>

        {/* Category dropdown — absolutely positioned overlay, GPU-composited animation */}
        {(() => {
          const cat = categories.find(c => c.slug === (activeDropdown ?? lastCatSlugRef.current))
          const isVisible = !!activeDropdown
          return (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 40,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-6px)',
                pointerEvents: isVisible ? 'auto' : 'none',
                transition: 'opacity 180ms ease, transform 180ms ease',
              }}
            >
              {cat && (
                <div className="border-t border-[#02034a] bg-white shadow-[0_8px_32px_rgba(2,3,74,.14)]">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-poppins text-[11px] font-bold uppercase tracking-[0.14em] text-[#00B4D8]">
                        {cat.name}
                      </span>
                      <button
                        onClick={() => setActiveDropdown(null)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] transition-colors hover:bg-[#F7F6FC]"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {dropdownProducts.map(p => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          onClick={() => setActiveDropdown(null)}
                          className="flex w-[160px] flex-shrink-0 flex-col gap-2 rounded-[10px] border border-[#dde4f0] bg-white p-3 transition hover:border-[#00B4D8] hover:shadow-[0_2px_10px_rgba(0,180,216,.12)]"
                        >
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#CAF0F8]">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.title} className="h-8 w-8 rounded-[6px] object-cover" />
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-poppins text-[12px] font-semibold leading-tight text-[#02034a]">{p.title}</p>
                            <p className="mt-0.5 font-poppins text-[11px] text-[#6b7280]">£{p.price} · {p.biomarker_count} markers</p>
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="flex w-[160px] flex-shrink-0 flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#dde4f0] bg-[#F7F6FC] p-3 text-center transition hover:border-[#00B4D8]"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#CAF0F8]">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                        <span className="font-poppins text-[11px] font-bold text-[#02034a]">View all {cat.name}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })()}
      </div>

      {/* ── MOBILE DRAWER ── */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`fixed inset-0 z-40 bg-[#02034a]/40 backdrop-blur-[2px] transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        />

        {/* Drawer panel - slides in from right, leaves ~20% of screen visible on left */}
        <div
          className={`fixed right-0 top-0 z-50 flex h-full w-[82vw] max-w-[340px] flex-col bg-white shadow-[-8px_0_40px_rgba(2,3,74,.18)] transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)] ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-[#dde4f0] px-5 py-4">
            <Image
              src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png"
              alt="AiwasLabs"
              width={110}
              height={36}
              className="h-7 w-auto object-contain"
            />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#F7F6FC] hover:text-[#02034a]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Scrollable nav links */}
          <nav className="flex-1 overflow-y-auto py-2">

            {/* Main links */}
            {[
              { label: 'Home',      href: '/',          icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
              { label: 'Resources', href: '/resources', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { label: 'Contact',   href: '/contact',   icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z' },
            ].map(({ label, href, icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-5 py-[13px] font-poppins text-[13px] font-semibold transition ${pathname === href ? 'text-[#0077b6]' : 'text-[#02034a] hover:text-[#0077b6]'}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
                {label}
              </Link>
            ))}

            <div className="mx-5 my-2 h-px bg-[#f0f2f7]" />

            {/* Blood Tests accordion */}
            <div>
              <button
                onClick={() => setMobileExpanded(prev => prev === 'tests' ? null : 'tests')}
                className="flex w-full items-center justify-between px-5 py-[13px] font-poppins text-[13px] font-semibold text-[#02034a] transition hover:text-[#0077b6]"
              >
                <span className="flex items-center gap-3">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                  Blood Tests
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  className={`transition-transform duration-200 ${mobileExpanded === 'tests' ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${mobileExpanded === 'tests' ? 'max-h-[400px]' : 'max-h-0'}`}>
                <Link href="/products"
                  className="flex items-center gap-2 px-5 py-[10px] pl-[46px] font-poppins text-[12.5px] font-semibold text-[#02034a] hover:text-[#0077b6]"
                >
                  All Tests
                  <span className="ml-auto rounded-full bg-[#CAF0F8] px-2 py-0.5 font-poppins text-[9px] font-bold text-[#0077b6]">Browse</span>
                </Link>
                {categories.map(cat => (
                  <Link key={cat.id} href={`/products?category=${cat.slug}`}
                    className="block py-[9px] pl-[46px] pr-5 font-poppins text-[12px] text-[#6b7280] hover:text-[#02034a]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mx-5 my-2 h-px bg-[#f0f2f7]" />

            {/* Account */}
            <Link href={authed ? '/account' : '/account/login'}
              className="flex items-center gap-3 px-5 py-[13px] font-poppins text-[13px] font-semibold text-[#02034a] transition hover:text-[#0077b6]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
              </svg>
              {authed ? 'My Account' : 'Login'}
            </Link>
          </nav>

          {/* CTA pinned to bottom */}
          <div className="border-t border-[#dde4f0] p-4">
            <Link href="/products"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#00B4D8] px-5 py-3 font-poppins text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(0,180,216,.35)] transition hover:bg-[#0077b6]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M8 2v4M16 2v4M3 10h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
              </svg>
              Book a Test
            </Link>
          </div>
        </div>
      </div>

      {/* ── FLOATING CART - mobile only ── */}
      <button
        onClick={() => setCartOpen(true)}
        aria-label={`Cart${cartCount ? ` (${cartCount} items)` : ''}`}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#02034a] shadow-[0_6px_24px_rgba(2,3,74,.35)] transition-transform hover:scale-105 active:scale-95 md:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#00B4D8] px-1 font-poppins text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(0,180,216,.55)]">
            {cartCount}
          </span>
        )}
      </button>
    </header>

    <CartDrawer
      isOpen={cartOpen}
      onClose={() => setCartOpen(false)}
      onCountChange={setCartCount}
    />
    </>
  )
}
