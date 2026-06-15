import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#02034a] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:px-8 py-14 md:grid-cols-[1.5fr_1fr_1fr]">

        {/* Brand */}
        <div>
          <Image
            src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png"
            alt="AiwasLabs"
            width={160}
            height={52}
            className="h-9 w-auto object-contain brightness-0 invert"
          />
          <p className="mt-3 font-poppins text-[12px] font-bold uppercase tracking-[0.12em] text-[#00B4D8]">
            We Help You Get Your Health Back
          </p>
          <p className="mt-2 max-w-[360px] font-poppins text-[13.5px] leading-[1.7] text-white/70">
            Private blood testing clinic based in Stoke-on-Trent. Doctor-led, same-day results, no GP referral needed. Private &amp; discreet.
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            {['Same-Day Results', 'Doctor-Led', 'No Referral'].map(badge => (
              <span key={badge} className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 font-poppins text-[10px] font-medium text-white/70">
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <a
              href="https://www.instagram.com/aiwaslabs/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AiwasLabs on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/60 transition hover:border-[#00B4D8] hover:bg-[#00B4D8]/10 hover:text-[#00B4D8]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61578599641656"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AiwasLabs on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/60 transition hover:border-[#00B4D8] hover:bg-[#00B4D8]/10 hover:text-[#00B4D8]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h6 className="mb-4 font-poppins text-[11px] font-bold uppercase tracking-[0.16em] text-[#90E0EF]">
            Blood Tests
          </h6>
          <nav className="flex flex-col gap-1">
            {[
              { label: 'All Tests', href: '/products' },
              { label: 'Best Sellers', href: '/products?category=best-sellers' },
              { label: "Men's Health", href: '/products?category=mens-health' },
              { label: "Women's Health", href: '/products?category=womens-health' },
              { label: 'Same-Day Results', href: '/products?category=same-day' },
              { label: 'Advanced Packages', href: '/products?category=advanced' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="rounded-[10px] px-3 py-[6px] font-poppins text-[12px] text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h6 className="mb-4 font-poppins text-[11px] font-bold uppercase tracking-[0.16em] text-[#90E0EF]">
            Contact
          </h6>
          <ul className="space-y-3 font-poppins text-[13.5px] text-white/70">
            <li className="flex flex-col">
              <span className="font-bold text-white">AiwasLabs</span>
              <span>Private Blood Testing</span>
              <span>Stoke-on-Trent</span>
            </li>
            <li>
              <Link href="/contact" className="text-[#00B4D8] transition hover:text-white">
                Book a Test →
              </Link>
            </li>
            <li>
              <Link href="/account" className="text-[#00B4D8] transition hover:text-white">
                Patient Portal →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-5 font-jetbrains text-[10.5px] text-white/40">
          <span>© {new Date().getFullYear()} AIWAS LABS · ALL RIGHTS RESERVED · PRIVATE BLOOD TESTING · STOKE-ON-TRENT</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/70 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white/70 transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
