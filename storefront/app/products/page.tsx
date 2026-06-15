import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { query } from '@/lib/db'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blood Tests & Home Kits',
  description: 'Browse our full range of private blood tests - cholesterol, hormones, diabetes, vitamins, thyroid and more. Clinic appointments in Stoke-on-Trent or home kits delivered to your door.',
  alternates: { canonical: 'https://aiwaslabs.co.uk/products' },
  openGraph: {
    type: 'website',
    url: 'https://aiwaslabs.co.uk/products',
    title: 'Blood Tests & Home Kits | AiwasLabs',
    description: 'Private blood tests with same-day results. Clinic or home kit. No GP referral needed.',
  },
}

async function getProducts(category?: string) {
  let sql = `
    SELECT id, title, slug, price, product_type, category_tags,
           biomarker_count, badge, images
    FROM products WHERE available = true
  `
  const params: unknown[] = []

  if (category) {
    params.push(category)
    sql += ` AND $${params.length} = ANY(category_tags)`
  }

  sql += ` ORDER BY created_at DESC`

  return query<{
    id: string
    title: string
    slug: string
    price: string
    product_type: string
    category_tags: string[]
    biomarker_count: number
    badge: string | null
    images: string[]
  }>(sql, params.length ? params : undefined)
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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const [products, categories] = await Promise.all([
    getProducts(category).catch(() => []),
    getCategories(),
  ])

  const activeCategory = categories.find(c => c.slug === category)

  const itemListSchema = products.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: activeCategory ? `${activeCategory.name} Blood Tests - AiwasLabs` : 'Blood Tests Available at AiwasLabs',
    url: `https://aiwaslabs.co.uk/products${category ? `?category=${category}` : ''}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://aiwaslabs.co.uk/products/${p.slug}`,
      name: p.title,
    })),
  } : null

  return (
    <>
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <main className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#011B50_0%,#02034a_55%,#010238_100%)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:52px_52px]"
          style={{ maskImage: 'radial-gradient(80% 100% at 50% 0%, #000, transparent)', WebkitMaskImage: 'radial-gradient(80% 100% at 50% 0%, #000, transparent)' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_80%_50%,rgba(0,180,216,.15),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pb-14">
          <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
            Private Blood Testing
          </span>
          <h1 className="mt-2 font-merriweather text-[clamp(24px,4vw,42px)] font-extrabold tracking-[-0.02em] text-white">
            {activeCategory ? activeCategory.name : 'All Blood Tests'}
          </h1>
          <p className="mt-2 font-poppins text-[14px] text-white/55">
            {activeCategory
              ? `Showing ${products.length} test${products.length !== 1 ? 's' : ''} in ${activeCategory.name}`
              : `${products.length} test${products.length !== 1 ? 's' : ''} available · Same-day results · No GP referral needed`}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Sidebar filter */}
        <aside className="hidden w-48 flex-shrink-0 lg:block">
          <p className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#6b7280] mb-3">
            Categories
          </p>
          <nav className="flex flex-col gap-0.5">
            <Link
              href="/products"
              className={`rounded-xl px-3 py-2 font-poppins text-[12.5px] font-semibold transition ${!category ? 'bg-[#CAF0F8] text-[#0077b6]' : 'text-[#02034a] hover:bg-[#F7F6FC]'}`}
            >
              All Tests
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`rounded-xl px-3 py-2 font-poppins text-[12.5px] font-semibold transition ${category === cat.slug ? 'bg-[#CAF0F8] text-[#0077b6]' : 'text-[#02034a] hover:bg-[#F7F6FC]'}`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile category pills */}
          {categories.length > 0 && (
            <div className="mb-6 flex gap-2 flex-wrap lg:hidden">
              <Link
                href="/products"
                className={`rounded-full border px-4 py-[6px] font-poppins text-[12px] font-semibold transition ${!category ? 'border-[#00B4D8] bg-[#CAF0F8] text-[#0077b6]' : 'border-[#dde4f0] text-[#6b7280] hover:border-[#00B4D8]'}`}
              >
                All
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`rounded-full border px-4 py-[6px] font-poppins text-[12px] font-semibold transition ${category === cat.slug ? 'border-[#00B4D8] bg-[#CAF0F8] text-[#0077b6]' : 'border-[#dde4f0] text-[#6b7280] hover:border-[#00B4D8]'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#dde4f0] bg-white py-16 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <p className="font-poppins text-[14px] text-[#6b7280]">No tests in this category yet.</p>
              <Link href="/products" className="font-poppins text-[13px] font-semibold text-[#00B4D8] hover:underline">
                View all tests →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
    </>
  )
}

function ProductCard({ product }: {
  product: {
    id: string
    title: string
    slug: string
    price: string
    product_type: string
    category_tags: string[]
    biomarker_count: number
    badge: string | null
    images: string[]
  }
}) {
  const typeLabel = { booking: 'Clinic Only', ship: 'Home Kit', both: 'Clinic + Home' }[product.product_type] ?? product.product_type
  const typeBg = {
    booking: 'bg-[rgba(0,119,182,.08)] text-[#0077b6]',
    ship: 'bg-[rgba(13,171,118,.08)] text-[#0DAB76]',
    both: 'bg-[rgba(0,180,216,.08)] text-[#00B4D8]',
  }[product.product_type] ?? 'bg-[#F7F6FC] text-[#6b7280]'
  const image = product.images?.[0]

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_4px_rgba(2,3,74,.04)] transition hover:shadow-[0_8px_32px_rgba(2,3,74,.10)] hover:-translate-y-0.5">
        <div className="relative aspect-[4/3] bg-[#F7F6FC] overflow-hidden">
          {image ? (
            <Image src={image} alt={product.title} fill className="object-cover transition group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
          )}
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-[#02034a] px-2.5 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-white">
              {product.badge}
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-merriweather text-[15px] font-extrabold text-[#02034a] leading-tight line-clamp-2">
              {product.title}
            </h3>
            <span className="font-merriweather text-[18px] font-black text-[#02034a] whitespace-nowrap">
              £{product.price}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span className="font-poppins text-[11px] text-[#6b7280]">
              {product.biomarker_count} biomarkers
            </span>
            <span className="text-[#dde4f0]">·</span>
            <span className={`rounded-full px-2.5 py-[3px] font-poppins text-[10px] font-bold ${typeBg}`}>
              {typeLabel}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-poppins text-[12px] font-semibold text-[#00B4D8] group-hover:text-[#0077b6] transition">
              View & Book →
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CAF0F8] text-[#0077b6] transition group-hover:bg-[#00B4D8] group-hover:text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
