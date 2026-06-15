import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ARTICLES, formatDate } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Health Resources - Biomarker Guides',
  description: 'Evidence-based guides on cholesterol, testosterone, vitamin D, thyroid, HbA1c, ferritin, CRP, and more - written and reviewed by Dr. Tanzil, GMC-registered clinical director.',
  alternates: { canonical: 'https://aiwaslabs.co.uk/resources' },
  openGraph: {
    type: 'website',
    url: 'https://aiwaslabs.co.uk/resources',
    title: 'Health Resources - Biomarker Guides | AiwasLabs',
    description: 'Evidence-based guides on the biomarkers that matter most. Written by a GMC-registered doctor.',
  },
}

const CATEGORIES = ['All', ...Array.from(new Set(ARTICLES.map(a => a.category)))]


export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const active = category ?? 'All'
  const filtered = active === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === active)

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#02034a_0%,#011B50_60%,#010238_100%)] pb-16 pt-28 lg:pb-20 lg:pt-36">
        <div className="mx-auto max-w-[1320px] px-5">
          <span className="inline-block rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 px-3.5 py-1 font-poppins text-[11px] font-semibold uppercase tracking-[.12em] text-[#00B4D8]">
            Health Resources
          </span>
          <h1 className="mt-4 font-merriweather text-[36px] font-extrabold leading-tight text-white lg:text-[52px]">
            Know your numbers.<br />
            <span className="text-[#00B4D8]">Understand your health.</span>
          </h1>
          <p className="mt-4 max-w-[600px] font-poppins text-[15px] leading-relaxed text-white/70">
            Evidence-based guides on the biomarkers that matter most - written and reviewed by Dr. Tanzil, our GMC-registered clinical director.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-0 z-30 border-b border-[#dde4f0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1320px] gap-1 overflow-x-auto px-5 py-3 scrollbar-none">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={cat === 'All' ? '/resources' : `/resources?category=${encodeURIComponent(cat)}`}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 font-poppins text-[12px] font-semibold transition ${
                active === cat
                  ? 'bg-[#02034a] text-white'
                  : 'bg-[#F7F6FC] text-[#6b7280] hover:bg-[#dde4f0] hover:text-[#02034a]'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Article grid */}
      <main className="bg-[#F7F6FC] py-14 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-5">
          {filtered.length === 0 ? (
            <p className="py-20 text-center font-poppins text-[15px] text-[#6b7280]">No articles in this category yet.</p>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article, i) => (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_2px_12px_rgba(2,3,74,.06)] transition hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(2,3,74,.12)]"
                >
                  {/* Accent bar */}
                  <div
                    className="h-1.5 w-full flex-shrink-0"
                    style={{ background: `linear-gradient(90deg, ${article.accent} 0%, ${article.accent}99 100%)` }}
                  />

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 font-poppins text-[10px] font-semibold uppercase tracking-wide text-white"
                        style={{ background: article.accent }}
                      >
                        {article.category}
                      </span>
                      <span className="font-poppins text-[11px] font-semibold text-[#9ca3af]">{article.biomarker}</span>
                    </div>
                    <h2 className="font-merriweather text-[16px] font-extrabold leading-snug text-[#02034a] transition group-hover:text-[#0077b6]">
                      {article.title}
                    </h2>
                    <p className="mt-2.5 flex-1 font-poppins text-[13px] leading-relaxed text-[#6b7280] line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-[#f3f4f6] pt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#02034a]">
                          <span className="font-poppins text-[8px] font-bold text-white">Dr</span>
                        </div>
                        <span className="font-poppins text-[11px] text-[#9ca3af]">Dr. Tanzil</span>
                      </div>
                      <div className="flex items-center gap-3 font-poppins text-[11px] text-[#9ca3af]">
                        <span>{formatDate(article.date)}</span>
                        <span>·</span>
                        <span>{article.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <p className="mt-14 rounded-xl border border-[#dde4f0] bg-white p-5 font-poppins text-[12px] leading-relaxed text-[#9ca3af]">
            <strong className="text-[#6b7280]">Medical disclaimer:</strong> The information in these articles is for educational purposes only and does not constitute medical advice. It should not replace professional clinical assessment. If you have concerns about your health, speak to a qualified healthcare professional or contact us to arrange a consultation.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
