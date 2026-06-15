import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <section className="flex flex-1 items-center justify-center bg-[linear-gradient(135deg,#011B50_0%,#02034a_55%,#010238_100%)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:52px_52px]"
          style={{ maskImage: 'radial-gradient(60% 60% at 50% 50%, #000, transparent)', WebkitMaskImage: 'radial-gradient(60% 60% at 50% 50%, #000, transparent)' }}
        />

        <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[rgba(0,180,216,.15)] ring-1 ring-[#00B4D8]/30">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>

          <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
            404 Error
          </span>

          <h1 className="mt-3 font-merriweather text-[clamp(36px,5vw,64px)] font-black leading-[1.05] tracking-[-0.025em] text-white">
            Page not found
          </h1>

          <p className="mt-5 font-poppins text-[15px] leading-[1.7] text-white/60">
            The page you are looking for does not exist or has been moved. Head back to browse our blood tests or contact us for help.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#00B4D8] px-6 py-3 font-poppins text-[13px] font-bold text-white transition hover:bg-[#0077b6]"
            >
              Browse Blood Tests
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-poppins text-[13px] font-bold text-white transition hover:bg-white/10"
            >
              Go Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
