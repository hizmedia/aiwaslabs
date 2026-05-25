'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

type Category = { id: string; name: string; slug: string }

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [authed, setAuthed] = useState<boolean | null>(null)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => setAuthed(!!data))
      .catch(() => setAuthed(false))
  }, [pathname])

  useEffect(() => { setMobileOpen(false); setMobileExpanded(null); setActiveDropdown(null) }, [pathname])

  const toggleDropdown = (slug: string) =>
    setActiveDropdown(prev => prev === slug ? null : slug)

  return (
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
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className={`rounded-full px-[10px] py-[7px] font-poppins text-[12px] font-semibold text-[#02034a] transition hover:bg-[#CAF0F8] hover:text-[#0077b6] ${pathname === href ? 'bg-[#CAF0F8] text-[#0077b6]' : ''}`}
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
      <div className="hidden bg-[#02034a] md:block" ref={dropdownRef}>
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

        {/* Category dropdown panel */}
        {activeDropdown && (() => {
          const cat = categories.find(c => c.slug === activeDropdown)
          return cat ? (
            <div className="border-t border-white/10 bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-poppins text-[11px] font-bold uppercase tracking-[0.14em] text-[#00B4D8]">
                    {cat.name}
                  </span>
                  <button onClick={() => setActiveDropdown(null)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#F7F6FC]"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setActiveDropdown(null)}
                    className="flex w-[140px] flex-shrink-0 flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#dde4f0] bg-[#F7F6FC] p-4 text-center transition hover:border-[#00B4D8]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CAF0F8]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                    <span className="font-poppins text-[11px] font-bold text-[#02034a]">View All {cat.name}</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : null
        })()}
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="border-b border-[#dde4f0] bg-[rgba(247,246,252,0.98)] md:hidden">
          <nav className="divide-y divide-[#dde4f0]">
            {[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map(({ label, href }) => (
              <Link key={href} href={href} className="block px-5 py-[13px] font-poppins text-[13px] font-bold text-[#02034a] hover:bg-[#CAF0F8]">
                {label}
              </Link>
            ))}

            {/* Blood Tests accordion */}
            <div>
              <button
                onClick={() => setMobileExpanded(prev => prev === 'tests' ? null : 'tests')}
                className="flex w-full items-center justify-between px-5 py-[13px] font-poppins text-[13px] font-bold text-[#02034a] hover:bg-[#CAF0F8]"
              >
                Blood Tests
                <svg className={`w-4 h-4 transition-transform ${mobileExpanded === 'tests' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileExpanded === 'tests' && (
                <div className="bg-[#F7F6FC] pl-5">
                  <Link href="/products" className="block px-5 py-[10px] font-poppins text-[13px] font-semibold text-[#02034a] hover:bg-[#CAF0F8]">
                    All Tests
                  </Link>
                  {categories.map(cat => (
                    <Link key={cat.id} href={`/products?category=${cat.slug}`}
                      className="block px-5 py-[10px] font-poppins text-[12px] text-[#6b7280] hover:bg-[#CAF0F8] hover:text-[#02034a]"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href={authed ? '/account' : '/account/login'} className="block px-5 py-[13px] font-poppins text-[13px] font-bold text-[#02034a] hover:bg-[#CAF0F8]">
              {authed ? 'My Account' : 'Login'}
            </Link>
          </nav>

          <div className="border-t border-[#dde4f0] p-4">
            <Link href="/products"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#00B4D8] px-5 py-3 font-poppins text-[13.5px] font-bold text-white shadow-[0_4px_14px_rgba(0,180,216,.35)]"
            >
              Book a Test
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
