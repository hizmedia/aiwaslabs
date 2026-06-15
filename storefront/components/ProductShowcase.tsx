'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

type Category = { id: string; name: string; slug: string }

export default function ProductShowcase({
  products,
  categories,
}: {
  products: ShowcaseProduct[]
  categories: Category[]
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category_tags?.includes(activeCategory))

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      {/* ── Background decoration (PAT-02) ── */}
      <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
        <div className="absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full bg-[#00B4D8] opacity-[0.09] blur-[100px]" />
        <div className="absolute -bottom-24 -left-20 h-[380px] w-[380px] rounded-full bg-[#0077b6] opacity-[0.10] blur-[90px]" />
        <div className="absolute left-[8%] top-[12%] h-[200px] w-[200px] rounded-full bg-[#00B4D8] opacity-[0.07] blur-[60px]" />
        <div className="absolute bottom-[10%] right-[10%] h-[220px] w-[220px] rounded-full bg-[#90E0EF] opacity-[0.10] blur-[65px]" />
        <div className="absolute left-[30%] top-[50%] h-[140px] w-[140px] rounded-full bg-[#00B4D8] opacity-[0.06] blur-[45px]" />
        <div className="absolute right-[25%] top-[18%] h-[120px] w-[120px] rounded-full bg-[#0077b6] opacity-[0.07] blur-[40px]" />

        <div className="absolute left-[5%] top-[16%] h-[52px] w-[52px] rounded-full border-[1.5px] border-[#00B4D8] bg-[#00B4D8] opacity-[0.13]" />
        <div className="absolute right-[6%] top-[20%] h-[38px] w-[38px] rounded-full border-[1.5px] border-[#00B4D8] bg-[#CAF0F8] opacity-[0.18]" />
        <div className="absolute bottom-[20%] left-[8%] h-[30px] w-[30px] rounded-full bg-[#0077b6] opacity-[0.14]" />
        <div className="absolute bottom-[16%] right-[7%] h-[46px] w-[46px] rounded-full border-[1.5px] border-[#90E0EF] bg-[#00B4D8] opacity-[0.12]" />
        <div className="absolute left-[42%] top-[6%] h-[24px] w-[24px] rounded-full bg-[#00B4D8] opacity-[0.14]" />
        <div className="absolute bottom-[8%] right-[40%] h-[20px] w-[20px] rounded-full bg-[#0077b6] opacity-[0.13]" />
        <div className="absolute left-[18%] top-[5%] h-[16px] w-[16px] rounded-full bg-[#90E0EF] opacity-[0.20]" />
        <div className="absolute right-[18%] bottom-[5%] h-[14px] w-[14px] rounded-full bg-[#00B4D8] opacity-[0.18]" />
        <div className="absolute left-[14%] top-[40%] h-[10px] w-[10px] rounded-full bg-[#00B4D8] opacity-[0.22]" />
        <div className="absolute right-[15%] top-[54%] h-[8px] w-[8px] rounded-full bg-[#00B4D8] opacity-[0.20]" />
        <div className="absolute bottom-[26%] left-[33%] h-[9px] w-[9px] rounded-full bg-[#90E0EF] opacity-[0.25]" />
        <div className="absolute bottom-[33%] right-[29%] h-[6px] w-[6px] rounded-full bg-[#00B4D8] opacity-[0.20]" />
        <div className="absolute left-[73%] top-[36%] h-[6px] w-[6px] rounded-full bg-[#00B4D8] opacity-[0.22]" />

        {/* Concentric rings + plus symbols */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          width="960" height="700" viewBox="0 0 960 700"
          fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="480" cy="350" r="90"  stroke="#00B4D8" strokeWidth="1.2" opacity="0.10" />
          <circle cx="480" cy="350" r="180" stroke="#02034a" strokeWidth="1.0" opacity="0.08" />
          <circle cx="480" cy="350" r="275" stroke="#00B4D8" strokeWidth="1.0" opacity="0.07" />
          <circle cx="480" cy="350" r="375" stroke="#02034a" strokeWidth="0.8" opacity="0.06" />
          <circle cx="480" cy="350" r="480" stroke="#00B4D8" strokeWidth="0.7" opacity="0.05" />
          <g transform="translate(90,70)"  opacity="0.10" fill="#02034a">
            <rect x="-14" y="-5"  width="28" height="10" rx="2.5" /><rect x="-5" y="-14" width="10" height="28" rx="2.5" />
          </g>
          <g transform="translate(858,100)" opacity="0.09" fill="#00B4D8">
            <rect x="-10" y="-3.5" width="20" height="7" rx="2" /><rect x="-3.5" y="-10" width="7" height="20" rx="2" />
          </g>
          <g transform="translate(110,610)" opacity="0.09" fill="#00B4D8">
            <rect x="-11" y="-4" width="22" height="8" rx="2" /><rect x="-4" y="-11" width="8" height="22" rx="2" />
          </g>
          <g transform="translate(870,590)" opacity="0.10" fill="#02034a">
            <rect x="-14" y="-5"  width="28" height="10" rx="2.5" /><rect x="-5" y="-14" width="10" height="28" rx="2.5" />
          </g>
          <g transform="translate(32,350)"  opacity="0.07" fill="#02034a">
            <rect x="-7" y="-2.5" width="14" height="5" rx="1.5" /><rect x="-2.5" y="-7" width="5" height="14" rx="1.5" />
          </g>
          <g transform="translate(928,345)" opacity="0.07" fill="#00B4D8">
            <rect x="-7" y="-2.5" width="14" height="5" rx="1.5" /><rect x="-2.5" y="-7" width="5" height="14" rx="1.5" />
          </g>
          <g transform="translate(630,155)" opacity="0.07" fill="#00B4D8">
            <rect x="-9" y="-3.5" width="18" height="7" rx="2" /><rect x="-3.5" y="-9" width="7" height="18" rx="2" />
          </g>
          <g transform="translate(330,545)" opacity="0.07" fill="#02034a">
            <rect x="-9" y="-3.5" width="18" height="7" rx="2" /><rect x="-3.5" y="-9" width="7" height="18" rx="2" />
          </g>
        </svg>

        {/* Logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png"
            alt=""
            width={380}
            height={130}
            className="h-auto w-[300px] opacity-[0.055]"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
            Our Blood Test Packages
          </span>
          <h2 className="mt-3 font-merriweather text-[clamp(20px,3vw,36px)] font-extrabold tracking-[-0.02em] text-[#02034a]">
            Choose the right panel for you.
          </h2>
          <p className="mt-2 max-w-[560px] font-poppins text-[14px] leading-[1.55] text-[#6b7280]">
            Select a category below - each card shows biomarkers, a description, and price. No referral needed.
          </p>
        </div>

        {/* Category filter tabs */}
        <div
          className="flex items-center gap-2 overflow-x-auto border-b border-[#dde4f0] pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 rounded-full px-4 py-[7px] font-poppins text-[12px] font-semibold whitespace-nowrap transition ${
              activeCategory === 'all'
                ? 'bg-[#02034a] text-white shadow-[0_4px_12px_rgba(2,3,74,.25)]'
                : 'border border-[#dde4f0] bg-white text-[#02034a] hover:bg-[#CAF0F8] hover:border-[#00B4D8]'
            }`}
          >
            All Tests
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`flex-shrink-0 rounded-full px-4 py-[7px] font-poppins text-[12px] font-semibold whitespace-nowrap transition ${
                activeCategory === cat.slug
                  ? 'bg-[#02034a] text-white shadow-[0_4px_12px_rgba(2,3,74,.25)]'
                  : 'border border-[#dde4f0] bg-white text-[#02034a] hover:bg-[#CAF0F8] hover:border-[#00B4D8]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Carousel */}
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#dde4f0] bg-[#F7F6FC] p-12 text-center">
            <p className="font-poppins text-[14px] text-[#6b7280]">No tests in this category yet.</p>
          </div>
        ) : (
          <div
            className="mt-6 flex gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {filtered.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group flex w-[260px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_2px_12px_rgba(2,3,74,.06)] transition hover:border-[#00B4D8] hover:shadow-[0_0_0_3px_rgba(0,180,216,.1)]"
              >
                {/* Image */}
                <div className="h-[148px] w-full overflow-hidden bg-[#F7F6FC]">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={260}
                      height={148}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  {/* Badge + Price */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#CAF0F8] px-2.5 py-[3px] font-poppins text-[9px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
                      {product.badge ?? 'Private Test'}
                    </span>
                    <span className="font-jetbrains text-[20px] font-bold text-[#02034a]">£{product.price}</span>
                  </div>

                  {/* Name */}
                  <h4 className="mt-3 font-merriweather text-[15px] font-extrabold leading-[1.2] text-[#02034a]">
                    {product.title}
                  </h4>

                  <div className="my-3 h-px bg-[#dde4f0]" />

                  {/* Description */}
                  <p className="flex-1 font-poppins text-[12px] leading-[1.6] text-[#6b7280] line-clamp-3">
                    {product.description ?? 'Private blood testing panel with same-day results.'}
                  </p>

                  {/* Biomarker count */}
                  {product.biomarker_count > 0 && (
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-[6px] rounded-full border border-[#dde4f0] bg-[#F7F6FC] px-3 py-[5px] font-poppins text-[11px] font-semibold text-[#02034a]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2.2" strokeLinecap="round">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                        {product.biomarker_count} Biomarkers
                      </span>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-4 w-full rounded-full bg-[#00B4D8] py-[10px] text-center font-poppins text-[12.5px] font-bold text-white shadow-[0_4px_12px_rgba(0,180,216,.3)] transition group-hover:bg-[#0077b6]">
                    Book This Test →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer hint */}
        <div className="mt-2 border-t border-[#dde4f0] pt-4">
          <p className="font-poppins text-[11.5px] text-[#6b7280]">
            All results reviewed by Dr. Tanzil - a qualified GMC-registered physician. Same-day delivery guaranteed.
          </p>
        </div>
      </div>
    </section>
  )
}
