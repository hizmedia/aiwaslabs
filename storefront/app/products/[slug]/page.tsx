import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { query } from '@/lib/db'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingCard from '@/components/BookingCard'
import HomeKitCTA from '@/components/HomeKitCTA'
import FAQSection from '@/components/FAQSection'
import TestInfoShowcase, { type TestInfo } from '@/components/TestInfoShowcase'

async function getProduct(slug: string) {
  const rows = await query<{
    id: string
    title: string
    slug: string
    description: string
    price: string
    biomarker_count: number
    badge: string | null
    product_type: 'booking' | 'ship' | 'both'
    available: boolean
    category_tags: string[]
    images: string[]
    faqs: { question: string; answer: string }[]
    test_info: TestInfo | null
  }>(`
    SELECT p.*,
           COALESCE(json_agg(f ORDER BY f.sort_order) FILTER (WHERE f.id IS NOT NULL), '[]') AS faqs
    FROM products p
    LEFT JOIN faqs f ON f.product_id = p.id
    WHERE p.slug = $1 AND p.available = true
    GROUP BY p.id
  `, [slug])
  return rows[0] ?? null
}

async function getRelatedProducts(slug: string, categoryTags: string[]) {
  if (!categoryTags?.length) return []
  return query<{
    id: string; title: string; slug: string; price: string;
    biomarker_count: number; badge: string | null; images: string[]
  }>(`
    SELECT id, title, slug, price, biomarker_count, badge, images
    FROM products
    WHERE available = true AND slug != $1 AND category_tags && $2::text[]
    ORDER BY created_at DESC LIMIT 3
  `, [slug, categoryTags])
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}

  const description = product.description
    ? product.description.replace(/<[^>]+>/g, '').slice(0, 160)
    : `Private ${product.title} blood test in Stoke-on-Trent. Same-day results reviewed by a GMC-registered doctor.`

  const image = product.images?.[0]
  const pageUrl = `https://aiwaslabs.co.uk/products/${slug}`

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description,
    image: image ? [image] : undefined,
    url: pageUrl,
    brand: { '@type': 'Brand', name: 'AiwasLabs' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'AiwasLabs' },
      url: pageUrl,
    },
  }

  return {
    title: product.title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: `${product.title} | AiwasLabs`,
      description,
      images: image ? [{ url: image, alt: product.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | AiwasLabs`,
      description,
      images: image ? [image] : undefined,
    },
    other: {
      'script:ld+json': JSON.stringify(productSchema),
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(slug, product.category_tags).catch(() => [])
  const heroImage = product.images?.[0]
  const typeLabel = { booking: 'Clinic Visit', ship: 'Home Kit', both: 'Clinic + Home Kit' }[product.product_type]

  const validFaqs = product.faqs?.filter(f => f.question && f.answer) ?? []
  const faqSchema = validFaqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFaqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(/<[^>]+>/g, '') },
    })),
  } : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiwaslabs.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Blood Tests', item: 'https://aiwaslabs.co.uk/products' },
      { '@type': 'ListItem', position: 3, name: product.title, item: `https://aiwaslabs.co.uk/products/${slug}` },
    ],
  }

  return (
    <>
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#011B50_0%,#02034a_55%,#010238_100%)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:52px_52px]"
          style={{ maskImage: 'radial-gradient(75% 70% at 50% 50%, #000, transparent 100%)', WebkitMaskImage: 'radial-gradient(75% 70% at 50% 50%, #000, transparent 100%)' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_75%_40%,rgba(0,180,216,.18),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pb-20">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 flex-wrap font-poppins text-[12px] text-white/40" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition">Blood Tests</Link>
            <span>/</span>
            <span className="text-white/70">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
            {/* Left */}
            <div className="order-2 lg:order-1">
              {product.category_tags[0] && (
                <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
                  {product.category_tags[0]}
                </span>
              )}

              <h1 className="mt-4 font-merriweather text-[clamp(28px,4vw,52px)] font-black leading-[1.05] tracking-[-0.025em] text-white">
                {product.title}
              </h1>

              {product.description && (
                <p className="mt-5 max-w-[540px] font-poppins text-[15px] leading-[1.7] text-white/65">
                  {product.description}
                </p>
              )}

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-poppins text-[13px] text-white/40">From</span>
                <span className="font-merriweather text-[46px] font-black leading-none text-white">£{product.price}</span>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {product.badge && (
                  <span className="inline-flex items-center rounded-full bg-[#00B4D8] px-3 py-[6px] font-poppins text-[11px] font-bold text-white">
                    {product.badge}
                  </span>
                )}
                <span className="inline-flex items-center rounded-full border border-white/18 bg-white/7 px-3 py-[6px] font-poppins text-[11px] font-medium text-white/80">
                  {typeLabel}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/18 bg-white/7 px-3 py-[6px] font-poppins text-[11px] font-medium text-white/80">
                  Same-Day Results
                </span>
                <span className="inline-flex items-center rounded-full border border-white/18 bg-white/7 px-3 py-[6px] font-poppins text-[11px] font-medium text-white/80">
                  Doctor-Led
                </span>
              </div>

              {/* Biomarkers */}
              {product.biomarker_count > 0 && (
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#00B4D8] bg-[rgba(0,180,216,.12)] px-4 py-2 font-poppins text-[12px] font-bold text-[#00B4D8]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    {product.biomarker_count} BIOMARKER{product.biomarker_count !== 1 ? 'S' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Right - Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[#00B4D8] opacity-[0.12] blur-[70px]" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_28px_64px_rgba(0,0,0,.4)]">
                {heroImage ? (
                  <div className="relative aspect-square">
                    <Image src={heroImage} alt={product.title} fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" priority />
                  </div>
                ) : (
                  <div className="aspect-square bg-[rgba(255,255,255,.05)] flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                )}
                {/* Trust badges overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 justify-center">
                  {[
                    { text: 'Same-Day Results', d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
                    { text: 'Doctor-Led', d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
                    { text: '100% Private', d: 'M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10' },
                  ].map(({ text, d }) => (
                    <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[rgba(2,3,74,.75)] px-3 py-1 font-poppins text-[10px] font-semibold text-white backdrop-blur-md">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
                      {text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOOKING SECTION ── */}
      <section className="bg-[#F7F6FC] border-t border-[#dde4f0] py-16 lg:py-20">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${product.product_type === 'both' ? 'max-w-6xl' : 'max-w-xl'}`}>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
              {product.product_type === 'both' ? 'Book or Order' : 'Reserve Your Slot'}
            </span>
            <h2 className="mt-3 font-merriweather text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-[-0.02em] text-[#02034a]">
              {product.product_type === 'both' ? 'Choose How You Test' : 'Book Your Test'}
            </h2>
            <p className="mt-2 font-poppins text-[14px] text-[#6b7280]">
              {product.product_type === 'both'
                ? 'Visit our clinic for a same-day appointment, or order a kit and test at your convenience.'
                : 'No GP referral needed · Same-day results · Doctor-reviewed report'}
            </p>
          </div>

          {product.product_type === 'both' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* Left - Clinic booking */}
              <div className="flex flex-col">
                <div className="mb-5">
                  <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
                    Clinic Visit
                  </span>
                  <h3 className="mt-2 font-merriweather text-[22px] font-extrabold text-[#02034a]">Book Your Appointment</h3>
                  <p className="mt-1 font-poppins text-[13.5px] text-[#6b7280]">Come in, get tested, receive your doctor-reviewed results the same day.</p>
                </div>
                <div className="flex-1 flex flex-col">
                  <BookingCard productName={product.title} productId={product.id} productType={product.product_type} />
                </div>
              </div>

              {/* Right - Home kit */}
              <div className="flex flex-col">
                <div className="mb-5">
                  <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
                    Home Test Kit
                  </span>
                  <h3 className="mt-2 font-merriweather text-[22px] font-extrabold text-[#02034a]">Prefer to Test at Home?</h3>
                  <p className="mt-1 font-poppins text-[13.5px] text-[#6b7280]">Order your kit online, take the sample at your own pace, post it back, and get your results.</p>
                </div>
                <div className="flex-1 flex flex-col">
                  <HomeKitCTA productId={product.id} price={product.price} />
                </div>
              </div>
            </div>
          ) : product.product_type === 'ship' ? (
            <>
              <div className="mb-5 text-center">
                <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
                  Home Test Kit
                </span>
              </div>
              <HomeKitCTA productId={product.id} price={product.price} />
            </>
          ) : (
            <BookingCard productName={product.title} productId={product.id} productType={product.product_type} />
          )}
        </div>
      </section>

      {/* ── HEALTH INSIGHTS BANNER ── */}
      <section className="relative overflow-hidden min-h-[320px] flex items-center bg-[linear-gradient(135deg,#011B50_0%,#02034a_55%,#010238_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_80%_40%,rgba(0,180,216,.15),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
              Your Results, Explained
            </span>
            <h2 className="mt-4 font-merriweather text-[clamp(24px,3.5vw,40px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-white">
              Health Insights,{' '}
              <em className="not-italic text-[#00B4D8]">Made Personal</em>
            </h2>
            <p className="mt-4 font-poppins text-[15px] leading-[1.7] text-white/70">
              Every result is reviewed and signed off by Dr. Tanzil - a GMC-registered physician. You'll receive a personalised report with clear next steps the same day.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                'Practical, easy-to-follow advice from your physician',
                'Personalised health recommendations based on your results',
                'Doctor-signed report delivered the same day',
              ].map(t => (
                <li key={t} className="flex items-start gap-3 font-poppins text-[13.5px] text-white/80">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#00B4D8] flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── KNOW WHAT YOU'RE TAKING ── */}
      {product.test_info && (product.test_info.what?.introTitle || product.test_info.what?.measures?.length || product.test_info.prepare?.length || product.test_info.limits?.factors?.length) && (
        <section className="border-t border-[#dde4f0] bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <TestInfoShowcase testInfo={product.test_info} />
          </div>
        </section>
      )}

      {/* ── FAQs ── */}
      {product.faqs && product.faqs.length > 0 && product.faqs[0].question && (
        <section className="bg-[#F7F6FC] border-t border-[#dde4f0] py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={product.faqs} />
          </div>
        </section>
      )}

      {/* ── RELATED ── */}
      {related.length > 0 && (
        <section className="bg-white border-t border-[#dde4f0] py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
                  You May Also Like
                </span>
                <h2 className="mt-2 font-merriweather text-[clamp(20px,3vw,30px)] font-extrabold tracking-[-0.02em] text-[#02034a]">
                  Related Blood Tests
                </h2>
              </div>
              <Link href="/products" className="hidden font-poppins text-[13px] font-semibold text-[#00B4D8] hover:text-[#0077b6] transition sm:block">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group block">
                  <div className="overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_4px_rgba(2,3,74,.04)] transition hover:shadow-[0_8px_32px_rgba(2,3,74,.10)] hover:-translate-y-0.5">
                    <div className="relative aspect-[4/3] bg-[#F7F6FC] overflow-hidden">
                      {p.images?.[0] ? (
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover transition group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
                        </div>
                      )}
                      {p.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#02034a] px-2.5 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-white">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-merriweather text-[15px] font-extrabold text-[#02034a] leading-tight">{p.title}</h3>
                        <span className="font-merriweather text-[17px] font-black text-[#02034a] whitespace-nowrap">£{p.price}</span>
                      </div>
                      <p className="mt-1.5 font-poppins text-[11px] text-[#6b7280]">{p.biomarker_count} biomarkers</p>
                      <span className="mt-3 inline-flex font-poppins text-[12px] font-semibold text-[#00B4D8] group-hover:text-[#0077b6] transition">
                        View & Book →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
    </>
  )
}
