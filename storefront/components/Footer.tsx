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
