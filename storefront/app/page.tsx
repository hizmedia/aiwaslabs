import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Private Blood Testing in Stoke-on-Trent - Same-Day Results',
  description: 'AiwasLabs offers same-day private blood tests at our Stoke-on-Trent clinic. Doctor-reviewed results, no GP referral needed. Cholesterol, hormones, diabetes, vitamins and more.',
  alternates: { canonical: 'https://aiwaslabs.co.uk' },
  openGraph: {
    type: 'website',
    url: 'https://aiwaslabs.co.uk',
    title: 'AiwasLabs - Private Blood Testing · Stoke-on-Trent',
    description: 'Same-day private blood tests. Doctor-reviewed results. No referral needed.',
  },
}
import { query } from '@/lib/db'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductShowcase from '@/components/ProductShowcase'
import ProcessFlow from '@/components/ProcessFlow'
import { TealUnderline } from '@/components/TealUnderline'
import { ARTICLES, formatDate } from '@/lib/articles'

type ShowcaseProduct = {
  id: string
  title: string
  slug: string
  price: string
  product_type: string
  biomarker_count: number
  badge: string | null
  images: string[]
  description: string | null
  category_tags: string[]
}

function parseTags(val: unknown): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val as string[]
  if (typeof val === 'string') return val.replace(/^\{|\}$/g, '').split(',').filter(Boolean)
  return []
}

async function getProducts(): Promise<ShowcaseProduct[]> {
  try {
    const rows = await query<Omit<ShowcaseProduct, 'category_tags'> & { category_tags: unknown }>(
      `SELECT id, title, slug, price, product_type, biomarker_count, badge, images, description, category_tags
       FROM products WHERE available = true ORDER BY created_at DESC`
    )
    return rows.map(r => ({ ...r, category_tags: parseTags(r.category_tags) }))
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    return query<{ id: string; name: string; slug: string }>(
      'SELECT id, name, slug FROM categories ORDER BY sort_order, name'
    )
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── PAT-01 HERO ── */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#011B50_0%,#02034a_60%,#010238_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_30%,rgba(0,180,216,.2),transparent_70%)]" />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{
            maskImage: 'radial-gradient(80% 60% at 50% 60%, #000, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(80% 60% at 50% 60%, #000, transparent 100%)',
          }}
        />

        <div className="relative z-[2] mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">

            {/* LEFT - copy */}
            <div className="max-w-[620px]">
              <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
                Private Blood Testing · Stoke-on-Trent
              </span>
              <h1 className="mt-5 font-merriweather text-[clamp(32px,5vw,72px)] font-black leading-[1.05] tracking-[-0.045em] text-white">
                We Help You Get Your{' '}
                <TealUnderline>Health Back.</TealUnderline>
              </h1>
              <p className="mt-5 max-w-[480px] font-poppins text-[clamp(14px,1.8vw,17px)] leading-[1.55] text-[rgba(255,255,255,.75)]">
                Doctor-Led blood testing in Stoke-on-Trent. Same-day results, reviewed by Dr. Tanzil.
                No referral. No NHS wait. Private &amp; discreet.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Doctor-Led', 'Same-Day Results', 'Private & Discreet', 'Stoke-on-Trent'].map(p => (
                  <span
                    key={p}
                    className="rounded-full border border-[rgba(255,255,255,.15)] bg-[rgba(255,255,255,.08)] px-3 py-[5px] font-poppins text-[11px] font-semibold text-[rgba(255,255,255,.8)]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT - video + CTAs */}
            <div className="flex w-full max-w-[500px] flex-col gap-4">
              <div className="overflow-hidden rounded-[20px] shadow-[0_18px_48px_rgba(0,0,0,.35)]">
                <video autoPlay muted loop playsInline className="block h-auto w-full">
                  <source
                    src="https://res.cloudinary.com/dofjvdrkz/video/upload/v1767975484/Video_Desktop_Site_ro1pac_n83vcq.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-transparent bg-[#00B4D8] px-6 py-[15px] font-poppins text-[15px] font-bold tracking-[0.04em] text-white shadow-[0_6px_18px_rgba(0,180,216,.35)] transition-all hover:-translate-y-px hover:bg-[#0077b6]"
                >
                  Book a Test
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[rgba(255,255,255,.4)] bg-transparent px-6 py-[15px] font-poppins text-[15px] font-bold tracking-[0.04em] text-white transition-all hover:bg-[rgba(255,255,255,.08)]"
                >
                  View Packages
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="relative border-t border-[rgba(255,255,255,.06)] bg-[#011B50]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(0,180,216,.07),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-y divide-[rgba(255,255,255,.06)] sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
            {([
              {
                stat: '5,000+', label: 'Tests Completed',
                icon: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
              },
              {
                stat: '4.9 / 5', label: 'Patient Rating',
                icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
              },
              {
                stat: 'Same-Day', label: 'Results',
                icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
              },
              {
                stat: 'GMC', label: 'Registered Doctor',
                icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
              },
              {
                stat: '100%', label: 'Private & Discreet',
                icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
              },
              {
                stat: 'No GP', label: 'Referral Needed',
                icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /></>,
              },
            ] as const).map(({ stat, label, icon }) => (
              <div key={stat} className="flex items-center gap-3 px-5 py-4 lg:justify-center">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[rgba(0,180,216,.14)] ring-1 ring-[rgba(0,180,216,.2)]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {icon}
                  </svg>
                </div>
                <div>
                  <p className="font-merriweather text-[15px] font-black leading-none text-white">{stat}</p>
                  <p className="mt-[3px] font-poppins text-[10.5px] leading-none text-[rgba(255,255,255,.42)]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PAT-02 PACKAGE SHOWCASE ── */}
      <ProductShowcase products={products} categories={categories} />

      {/* ── PAT-08 TRUST & ABOUT ── */}
      <section className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] items-stretch">

          {/* Left - full-bleed doctor image */}
          <div className="relative min-h-[380px] lg:min-h-[520px]">
            <Image
              src="https://res.cloudinary.com/dky6bti4g/image/upload/v1755098367/IMG_3348_vnvxge.png"
              alt="Doctor consultation at AiwasLabs"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            {/* gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(to_top,rgba(2,3,74,.92),transparent)]" />

            {/* clinic badge */}
            <div className="absolute left-5 top-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,180,216,.35)] bg-[rgba(2,3,74,.75)] px-4 py-2 font-poppins text-[11px] font-bold uppercase tracking-[0.15em] text-[#00B4D8] backdrop-blur-sm">
                AiwasLabs · Stoke-on-Trent
              </span>
            </div>

            {/* stats */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
              {[
                { value: '5,000+', label: 'Tests done' },
                { value: '4.9/5',  label: 'Avg. rating' },
                { value: 'Same day', label: 'Results' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-xl border border-[rgba(0,180,216,.2)] bg-[rgba(2,3,74,.75)] py-3.5 text-center backdrop-blur-md">
                  <p className="font-merriweather text-[17px] font-black leading-none text-white">{value}</p>
                  <p className="mt-1 font-poppins text-[10px] font-medium uppercase tracking-wide text-[rgba(255,255,255,.55)]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - dark navy content panel */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-[#02034a] px-9 py-12 lg:px-12 lg:py-14">
            {/* grid texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            {/* cyan ambient glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00B4D8] opacity-[0.1] blur-[72px]" />

            <div className="relative">
              <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
                About AiwasLabs
              </span>

              <h2 className="mt-4 font-merriweather text-[clamp(28px,3.2vw,44px)] font-black leading-[1.1] tracking-[-0.02em] text-white">
                Private Testing<br />You Can <TealUnderline>Trust</TealUnderline>
              </h2>

              <p className="mt-5 font-poppins text-[14px] leading-[1.8] text-[rgba(255,255,255,.62)]">
                AiwasLabs is Stoke-on-Trent's private blood testing clinic. Every result is personally
                reviewed by Dr. Tanzil - a GMC-registered physician - before it reaches you.
              </p>

              <ul className="mt-7 space-y-3">
                {[
                  'Every result reviewed by a qualified physician',
                  'No GP referral - book directly online',
                  'Same-day results for all clinic visits',
                  'UK GDPR compliant · your data stays private',
                ].map(point => (
                  <li key={point} className="flex items-center gap-3 font-poppins text-[13px] text-[rgba(255,255,255,.8)]">
                    <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border border-[rgba(0,180,216,.3)] bg-[rgba(0,180,216,.18)]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dr. Tanzil card */}
            <div className="relative mt-8 flex items-center gap-4 rounded-2xl border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.05)] p-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#00B4D8] shadow-[0_0_24px_rgba(0,180,216,.55)]">
                <span className="font-merriweather text-[18px] font-black text-white">T</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-merriweather text-[15px] font-extrabold text-white">Dr. Tanzil</p>
                <p className="font-poppins text-[12px] text-[rgba(255,255,255,.48)]">GMC Registered · Clinical Director</p>
              </div>
              <span className="flex-shrink-0 inline-flex items-center rounded-full border border-[rgba(0,180,216,.3)] bg-[rgba(0,180,216,.15)] px-3 py-1 font-poppins text-[10.5px] font-bold text-[#00B4D8]">
                Doctor-Led
              </span>
            </div>

            {/* CTAs */}
            <div className="relative mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#00B4D8] px-6 py-3 font-poppins text-[13px] font-bold text-white shadow-[0_4px_22px_rgba(0,180,216,.5)] transition-all hover:-translate-y-px hover:bg-[#0077b6]"
              >
                Book Your Test
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/products?type=home"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,.22)] px-6 py-3 font-poppins text-[13px] font-bold text-white transition-all hover:bg-[rgba(255,255,255,.08)]"
              >
                Order Home Kit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t border-[#dde4f0] bg-[#F7F6FC] py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-5">
          <div className="mb-12 max-w-[580px]">
            <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
              How It Works
            </span>
            <h2 className="mt-3 font-merriweather text-[clamp(26px,3.4vw,42px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#02034a]">
              From booking to results -{' '}
              <TealUnderline>five steps, same day.</TealUnderline>
            </h2>
            <p className="mt-3 font-poppins text-[14px] leading-[1.65] text-[#6b7280]">
              No referrals, no chasing. Book online, get tested, and receive a doctor-reviewed report - all on the same day. Scroll to follow the journey.
            </p>
          </div>
          <ProcessFlow />
        </div>
      </section>

      {/* ── GOOGLE REVIEWS ── */}
      <section className="border-t border-[#dde4f0] bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
              Patient Reviews
            </span>
            <h2 className="mt-3 font-merriweather text-[clamp(22px,3vw,36px)] font-extrabold tracking-[-0.02em] text-[#02034a]">
              The Good Doctor
            </h2>
          </div>
          <div className="elfsight-app-0d86ebe1-f76d-4218-a66c-8b22ad5c356c" data-elfsight-app-lazy />
        </div>
      </section>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />

      {/* ── HEALTH RESOURCES ── */}
      <section className="border-t border-[#dde4f0] bg-[#F7F6FC] py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
                Health Resources
              </span>
              <h2 className="mt-2 font-merriweather text-[clamp(22px,3vw,36px)] font-extrabold tracking-[-0.02em] text-[#02034a]">
                Know your <TealUnderline>biomarkers</TealUnderline>
              </h2>
              <p className="mt-2 font-poppins text-[14px] text-[#6b7280]">
                Evidence-based guides written and reviewed by Dr. Tanzil.
              </p>
            </div>
            <Link
              href="/resources"
              className="inline-flex shrink-0 items-center gap-1.5 font-poppins text-[13px] font-semibold text-[#00B4D8] transition hover:text-[#0077b6]"
            >
              View all guides
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Article cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.slice(0, 3).map(article => (
              <Link key={article.slug} href={`/resources/${article.slug}`} className="group block">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_4px_rgba(2,3,74,.04)] transition hover:shadow-[0_8px_32px_rgba(2,3,74,.10)] hover:-translate-y-0.5">
                  {/* Accent bar */}
                  <div className="h-[6px] w-full" style={{ background: article.accent }} />

                  <div className="flex flex-1 flex-col p-5">
                    {/* Category + biomarker */}
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-[#F7F6FC] px-2.5 py-[3px] font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">
                        {article.category}
                      </span>
                      <span className="font-poppins text-[10px] text-[#6b7280]">·</span>
                      <span className="font-poppins text-[10px] font-semibold" style={{ color: article.accent }}>
                        {article.biomarker}
                      </span>
                    </div>

                    <h3 className="font-merriweather text-[15px] font-extrabold leading-snug text-[#02034a] line-clamp-2 group-hover:text-[#0077b6] transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex-1 font-poppins text-[13px] leading-[1.65] text-[#6b7280] line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#dde4f0] pt-3">
                      <span className="font-poppins text-[11px] text-[#9ca3af]">{formatDate(article.date)}</span>
                      <span className="font-poppins text-[11px] text-[#9ca3af]">{article.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAT-06 CTA BANNER ── */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#011B50_0%,#02034a_60%,#010238_100%)] px-10 py-12 text-center sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_50%,rgba(255,255,255,.12),transparent_70%)]" />
        <div className="relative z-[2] mx-auto max-w-3xl">
          <h2 className="font-merriweather text-[clamp(24px,4vw,44px)] font-black leading-[1] text-white">
            Ready to take control of your <TealUnderline>health?</TealUnderline>
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] font-poppins text-[15px] leading-[1.55] text-[rgba(255,255,255,.85)]">
            Book a same-day blood test with AiwasLabs - Doctor-Led, private, and reviewed by Dr. Tanzil the same day you come in.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-transparent bg-white px-6 py-[15px] font-poppins text-[15px] font-bold tracking-[0.04em] text-[#02034a] shadow-[0_6px_18px_rgba(0,0,0,.15)] transition-all hover:-translate-y-px hover:bg-[#F7F6FC]"
            >
              Book a Test Today
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[rgba(255,255,255,.4)] bg-transparent px-6 py-[15px] font-poppins text-[15px] font-bold tracking-[0.04em] text-white transition-all hover:bg-[rgba(255,255,255,.08)]"
            >
              View All Packages
            </Link>
          </div>
          <p className="mt-4 font-poppins text-[11.5px] text-[rgba(255,255,255,.65)]">
            We Help You Get Your Health Back · Same-Day Results · Stoke-on-Trent
          </p>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section className="border-t border-[#dde4f0] bg-[#F7F6FC] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-center">

            {/* Left - info */}
            <div>
              <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
                Find Us
              </span>
              <h2 className="mt-3 font-merriweather text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-[-0.02em] text-[#02034a]">
                Based in Stoke-on-Trent
              </h2>
              <p className="mt-3 max-w-[460px] font-poppins text-[14px] leading-[1.7] text-[#6b7280]">
                AiwasLabs is a private blood testing clinic conveniently located in Stoke-on-Trent.
                Walk-in and pre-booked appointments available - no GP referral needed.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />,
                    label: 'Location',
                    text: 'Unit 6, Parkhall Business Village, Park Hall Rd, Stoke-on-Trent ST3 5XA',
                  },
                  {
                    icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
                    label: 'Opening Hours',
                    text: 'Mon–Fri: 9am – 6pm · Sat: 9am – 2pm',
                  },
                  {
                    icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    label: 'No GP Referral',
                    text: 'Book directly - we see you the same day',
                  },
                ].map(({ icon, label, text }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#CAF0F8]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0077b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {icon}
                      </svg>
                    </div>
                    <div>
                      <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">{label}</p>
                      <p className="mt-0.5 font-poppins text-[13.5px] font-semibold text-[#02034a]">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#02034a] px-6 py-[13px] font-poppins text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(2,3,74,.25)] transition hover:bg-[#0077b6]"
                >
                  Get in Touch →
                </Link>
                <Link
                  href="https://maps.google.com/?q=Unit+6,+Parkhall+Business+Village,+Park+Hall+Rd,+Stoke-on-Trent+ST3+5XA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#dde4f0] bg-white px-6 py-[13px] font-poppins text-[13px] font-bold text-[#02034a] transition hover:border-[#00B4D8] hover:bg-[#CAF0F8]"
                >
                  Get Directions
                </Link>
              </div>
            </div>

            {/* Right - embedded Google Map */}
            <div className="overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_4px_24px_rgba(2,3,74,.08)]">
              <div className="h-[340px] w-full">
                <iframe
                  title="AiwasLabs location"
                  src="https://maps.google.com/maps?q=Unit+6,+Parkhall+Business+Village,+Park+Hall+Rd,+Stoke-on-Trent+ST3+5XA&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex items-center justify-between border-t border-[#dde4f0] px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-[6px] w-[6px] rounded-full bg-[#0DAB76]" />
                  <p className="font-poppins text-[12px] text-[#6b7280]">Unit 6, Parkhall Business Village, ST3 5XA</p>
                </div>
                <Link
                  href="https://maps.google.com/?q=Unit+6,+Parkhall+Business+Village,+Park+Hall+Rd,+Stoke-on-Trent+ST3+5XA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 font-poppins text-[11px] font-bold text-[#00B4D8] hover:text-[#0077b6] transition"
                >
                  Open in Maps →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
