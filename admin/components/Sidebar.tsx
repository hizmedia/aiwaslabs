'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: string
  children?: { label: string; href: string }[]
}

const NAV: NavItem[] = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Patients',
    href: '/dashboard/patients',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    label: 'Products',
    href: '/dashboard/products',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    children: [
      { label: 'All Products',  href: '/dashboard/products' },
      { label: 'Categories',    href: '/dashboard/categories' },
    ],
  },
  {
    label: 'Calendar',
    href: '/dashboard/calendar',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className="flex h-full w-[220px] flex-shrink-0 flex-col bg-[#02034a]">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,.08)] px-5 py-4">
        <Image
          src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png"
          alt="AiwasLabs"
          width={120}
          height={40}
          className="h-9 w-auto object-contain brightness-0 invert"
          unoptimized
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-2 px-2 font-poppins text-[9px] font-bold uppercase tracking-[0.14em] text-[rgba(255,255,255,.3)]">
          Menu
        </p>
        {NAV.map(({ label, href, icon, children }) => {
          const groupActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          const showChildren = !!children && groupActive

          return (
            <div key={href} className="mb-0.5">
              <Link
                href={href}
                className={`flex items-center gap-3 rounded-[8px] px-3 py-[9px] font-poppins text-[12.5px] font-semibold transition ${
                  groupActive && !children
                    ? 'bg-[#00B4D8] text-white shadow-[0_4px_12px_rgba(0,180,216,.3)]'
                    : groupActive && children
                    ? 'text-white'
                    : 'text-[rgba(255,255,255,.6)] hover:bg-[rgba(255,255,255,.08)] hover:text-white'
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon}/>
                </svg>
                {label}
              </Link>

              {showChildren && (
                <div className="ml-[22px] mt-0.5 flex flex-col gap-0.5 border-l border-[rgba(255,255,255,.1)] pl-3">
                  {children.map(child => {
                    const childActive = pathname === child.href || (child.href !== '/dashboard/products' && pathname.startsWith(child.href))
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`rounded-[6px] px-2.5 py-[7px] font-poppins text-[12px] font-semibold transition ${
                          childActive
                            ? 'bg-[#00B4D8] text-white shadow-[0_2px_8px_rgba(0,180,216,.3)]'
                            : 'text-[rgba(255,255,255,.55)] hover:bg-[rgba(255,255,255,.08)] hover:text-white'
                        }`}
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[rgba(255,255,255,.08)] p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[8px] px-3 py-[9px] font-poppins text-[12.5px] font-semibold text-[rgba(255,255,255,.5)] transition hover:bg-[rgba(255,255,255,.08)] hover:text-white"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
