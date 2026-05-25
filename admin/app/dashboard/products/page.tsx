import Link from 'next/link'
import { query } from '@/lib/db'
import ProductActions from './ProductActions'

async function getProducts() {
  return query<{
    id: string
    title: string
    slug: string
    price: string
    product_type: string
    category_tags: string[]
    biomarker_count: number
    available: boolean
    badge: string | null
  }>('SELECT id, title, slug, price, product_type, category_tags, biomarker_count, available, badge FROM products ORDER BY created_at DESC')
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
            Products
          </span>
          <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">
            Product Management
          </h1>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#00B4D8] px-5 py-3 font-poppins text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(0,180,216,.35)] transition hover:bg-[#0077b6]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_3px_rgba(2,3,74,.06)] overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <p className="font-poppins text-[13px] text-[#6b7280]">No products yet</p>
            <Link href="/dashboard/products/new" className="font-poppins text-[12px] font-semibold text-[#00B4D8] hover:underline">
              Add your first product →
            </Link>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[1fr_100px_110px_120px_80px_100px] gap-4 border-b border-[#dde4f0] bg-[#F7F6FC] px-5 py-3 font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">
              <span>Product</span>
              <span>Price</span>
              <span>Type</span>
              <span>Categories</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {products.map(p => (
              <div key={p.id} className="grid grid-cols-[1fr_100px_110px_120px_80px_100px] items-center gap-4 border-b border-[#dde4f0] px-5 py-4 last:border-b-0 hover:bg-[#F7F6FC] transition">

                {/* Title + badge */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-merriweather text-[13.5px] font-extrabold text-[#02034a] truncate">{p.title}</p>
                    {p.badge && (
                      <span className="flex-shrink-0 rounded-full bg-[#CAF0F8] px-2 py-[2px] font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#02034a]">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-poppins text-[11px] text-[#6b7280]">{p.biomarker_count} biomarkers · /{p.slug}</p>
                </div>

                {/* Price */}
                <span className="font-jetbrains text-[14px] font-bold text-[#02034a]">£{p.price}</span>

                {/* Type */}
                {{
                  booking: <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(0,119,182,.08)] px-2.5 py-[3px] font-poppins text-[10px] font-bold text-[#0077b6]">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Clinic
                  </span>,
                  ship: <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(13,171,118,.08)] px-2.5 py-[3px] font-poppins text-[10px] font-bold text-[#0DAB76]">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                    Home Kit
                  </span>,
                  both: <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(0,180,216,.08)] px-2.5 py-[3px] font-poppins text-[10px] font-bold text-[#00B4D8]">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                    Both
                  </span>,
                }[p.product_type]}

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {p.category_tags.slice(0, 2).map(tag => (
                    <span key={tag} className="rounded-full bg-[#F7F6FC] border border-[#dde4f0] px-2 py-[2px] font-poppins text-[9px] text-[#6b7280]">
                      {tag}
                    </span>
                  ))}
                  {p.category_tags.length > 2 && (
                    <span className="font-poppins text-[9px] text-[#6b7280]">+{p.category_tags.length - 2}</span>
                  )}
                </div>

                {/* Status */}
                <span className={`w-fit rounded-full px-2.5 py-[3px] font-poppins text-[10px] font-bold uppercase ${p.available ? 'bg-[rgba(13,171,118,.1)] text-[#0DAB76]' : 'bg-[#F7F6FC] text-[#6b7280]'}`}>
                  {p.available ? 'Live' : 'Hidden'}
                </span>

                {/* Actions */}
                <ProductActions id={p.id} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
