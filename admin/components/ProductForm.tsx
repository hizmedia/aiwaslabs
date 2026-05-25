'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/ImageUploader'

interface Category { id: string; name: string; slug: string }
interface Faq { question: string; answer: string }
interface Measure { title: string; desc: string; bullets: string }
interface PrepStep { title: string; detail: string; important: boolean }
interface LimitFactor { factor: string; desc: string }

interface TestInfoRaw {
  what?: { introTitle?: string; intro?: string; measures?: { title: string; desc?: string; bullets?: string[] }[] }
  prepare?: { title: string; detail: string; important?: boolean }[]
  limits?: { poctNotes?: string[]; cautions?: string[]; factors?: { factor: string; desc: string }[] }
}

interface ProductFormProps {
  mode: 'new' | 'edit'
  id?: string
  categories: Category[]
  initial?: {
    title: string
    slug: string
    description: string
    price: string
    biomarker_count: string
    badge: string
    product_type: 'booking' | 'ship' | 'both'
    available: boolean
    category_tags: string[]
    images: string[]
    faqs: Faq[]
    test_info?: TestInfoRaw | null
  }
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ProductForm({ mode, id, categories, initial }: ProductFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle]             = useState(initial?.title ?? '')
  const [slug, setSlug]               = useState(initial?.slug ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice]             = useState(initial?.price ?? '')
  const [biomarkers, setBiomarkers]   = useState(initial?.biomarker_count ?? '')
  const [badge, setBadge]             = useState(initial?.badge ?? '')
  const [productType, setProductType] = useState<'booking' | 'ship' | 'both'>(initial?.product_type ?? 'booking')
  const [available, setAvailable]     = useState(initial?.available ?? true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initial?.category_tags ?? [])
  const [images, setImages]           = useState<string[]>(initial?.images ?? [])
  const [faqs, setFaqs]               = useState<Faq[]>(initial?.faqs ?? [{ question: '', answer: '' }])

  // test_info state
  const initTi = initial?.test_info
  const [tiTab, setTiTab]                   = useState<'what' | 'prepare' | 'limits'>('what')
  const [whatIntroTitle, setWhatIntroTitle]  = useState(initTi?.what?.introTitle ?? '')
  const [whatIntro, setWhatIntro]           = useState(initTi?.what?.intro ?? '')
  const [whatMeasures, setWhatMeasures]     = useState<Measure[]>(
    initTi?.what?.measures?.map(m => ({ title: m.title, desc: m.desc ?? '', bullets: m.bullets?.join('\n') ?? '' })) ?? [{ title: '', desc: '', bullets: '' }]
  )
  const [prepSteps, setPrepSteps]           = useState<PrepStep[]>(
    initTi?.prepare?.map(s => ({ title: s.title, detail: s.detail, important: s.important ?? false })) ?? [{ title: '', detail: '', important: false }]
  )
  const [limitsNotes, setLimitsNotes]       = useState(initTi?.limits?.poctNotes?.join('\n') ?? '')
  const [limitsCautions, setLimitsCautions] = useState(initTi?.limits?.cautions?.join('\n') ?? '')
  const [limitsFactors, setLimitsFactors]   = useState<LimitFactor[]>(
    initTi?.limits?.factors ?? [{ factor: '', desc: '' }]
  )

  function toggleCategory(cat: string) {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    if (mode === 'new') setSlug(slugify(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const test_info = {
      what: {
        introTitle: whatIntroTitle,
        intro: whatIntro,
        measures: whatMeasures.filter(m => m.title).map(m => ({
          title: m.title,
          desc: m.desc,
          bullets: m.bullets.split('\n').map(b => b.trim()).filter(Boolean),
        })),
      },
      prepare: prepSteps.filter(s => s.title).map(s => ({ title: s.title, detail: s.detail, important: s.important })),
      limits: {
        poctNotes: limitsNotes.split('\n').map(l => l.trim()).filter(Boolean),
        cautions: limitsCautions.split('\n').map(l => l.trim()).filter(Boolean),
        factors: limitsFactors.filter(f => f.factor),
      },
    }

    const body = {
      title, slug, description,
      price: parseFloat(price),
      biomarker_count: parseInt(biomarkers as string) || 0,
      badge: badge || null,
      product_type: productType,
      available,
      category_tags: selectedCategories,
      images: images.filter(Boolean),
      faqs: faqs.filter(f => f.question && f.answer),
      test_info,
    }

    const url = mode === 'new' ? '/api/products' : `/api/products/${id}`
    const method = mode === 'new' ? 'POST' : 'PATCH'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setSaving(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
      return
    }

    router.push('/dashboard/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* Product type */}
      <div className="mb-6">
        <p className="mb-2 font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
          Product Type <span className="text-[#00B4D8]">*</span>
        </p>
        <div className="flex flex-wrap gap-3">
          {([
            { value: 'booking', label: 'Clinic Booking',  sub: 'Patient visits clinic',       icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { value: 'ship',    label: 'Ship Home Kit',   sub: 'Kit sent to patient',          icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01 20.73 6.96M12 22.08V12' },
            { value: 'both',    label: 'Clinic + Home',   sub: 'Patient chooses at booking',  icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          ] as const).map(({ value, label, sub, icon }) => {
            const active = productType === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setProductType(value)}
                className={`flex flex-col items-start gap-1.5 rounded-[12px] border p-4 text-left transition w-[180px] ${
                  active
                    ? 'border-[#00B4D8] bg-[rgba(0,180,216,.05)] shadow-[0_0_0_3px_rgba(0,180,216,.12)]'
                    : 'border-[#dde4f0] bg-white hover:border-[#00B4D8]'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${active ? 'bg-[#00B4D8]' : 'bg-[#F7F6FC]'}`}>
                  {value === 'both' ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#02034a'} strokeWidth="2" strokeLinecap="round">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      <circle cx="17" cy="17" r="4" fill={active ? 'rgba(255,255,255,.3)' : 'rgba(0,180,216,.15)'} stroke="none"/>
                      <path d="M15 17h4M17 15v4" stroke={active ? 'white' : '#00B4D8'} strokeWidth="1.5"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#02034a'} strokeWidth="2" strokeLinecap="round">
                      <path d={icon}/>
                    </svg>
                  )}
                </div>
                <span className="font-poppins text-[12.5px] font-bold text-[#02034a]">{label}</span>
                <span className="font-poppins text-[10.5px] text-[#6b7280]">{sub}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Core fields */}
      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
            Product Title <span className="text-[#00B4D8]">*</span>
          </label>
          <input value={title} onChange={e => handleTitleChange(e.target.value)} required placeholder="e.g. Essential Health Panel"
            className="rounded-[10px] border border-[#dde4f0] bg-[#F7F6FC] px-3 py-[9px] font-poppins text-[12.5px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.12)] transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
            Slug <span className="text-[#00B4D8]">*</span>
          </label>
          <input value={slug} onChange={e => setSlug(e.target.value)} required placeholder="essential-health-panel"
            className="rounded-[10px] border border-[#dde4f0] bg-[#F7F6FC] px-3 py-[9px] font-jetbrains text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.12)] transition"
          />
          <p className="font-poppins text-[10.5px] text-[#6b7280]">URL: /products/{slug || '…'}</p>
        </div>

        <div className="col-span-2 flex flex-col gap-1 max-[900px]:col-span-1">
          <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
            Description <span className="text-[#00B4D8]">*</span>
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} placeholder="Describe what this test covers, who it's for, and the key benefits…"
            className="rounded-[10px] border border-[#dde4f0] bg-[#F7F6FC] px-3 py-2 font-poppins text-[12.5px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.12)] transition resize-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
            Price (£) <span className="text-[#00B4D8]">*</span>
          </label>
          <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required placeholder="89.00"
            className="rounded-[10px] border border-[#dde4f0] bg-[#F7F6FC] px-3 py-[9px] font-jetbrains text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.12)] transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Biomarker Count</label>
          <input type="number" min="0" value={biomarkers} onChange={e => setBiomarkers(e.target.value)} placeholder="7"
            className="rounded-[10px] border border-[#dde4f0] bg-[#F7F6FC] px-3 py-[9px] font-jetbrains text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.12)] transition"
          />
          <p className="font-poppins text-[10.5px] text-[#6b7280]">Shown on product card</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Badge Label</label>
          <input value={badge} onChange={e => setBadge(e.target.value)} placeholder="e.g. Most Popular"
            className="rounded-[10px] border border-[#dde4f0] bg-[#F7F6FC] px-3 py-[9px] font-poppins text-[12.5px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,.12)] transition"
          />
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between rounded-[12px] border border-[#dde4f0] bg-[#F7F6FC] p-4">
          <div>
            <p className="font-poppins text-[12.5px] font-bold text-[#02034a]">Product Availability</p>
            <p className="font-poppins text-[11px] text-[#6b7280]">Toggle off to hide without deleting</p>
          </div>
          <button type="button" onClick={() => setAvailable(!available)}
            className={`relative flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${available ? 'bg-[#00B4D8]' : 'bg-[#dde4f0]'}`}
          >
            <span className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${available ? 'translate-x-6' : 'translate-x-1'}`}/>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-5">
        <p className="mb-2 font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Category Tags</p>
        <p className="mb-3 font-poppins text-[10.5px] text-[#6b7280]">Controls which navbar dropdown this product appears in</p>
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 && (
            <p className="font-poppins text-[12px] text-[#a0aec0]">No categories yet — <a href="/dashboard/categories" className="text-[#00B4D8] hover:underline">add some first</a>.</p>
          )}
          {categories.map(cat => (
            <button key={cat.slug} type="button" onClick={() => toggleCategory(cat.slug)}
              className={`rounded-full px-4 py-[7px] font-poppins text-[12px] font-semibold transition ${
                selectedCategories.includes(cat.slug)
                  ? 'bg-[#02034a] text-white shadow-[0_4px_12px_rgba(2,3,74,.25)]'
                  : 'border border-[#dde4f0] bg-white text-[#02034a] hover:border-[#00B4D8] hover:bg-[rgba(0,180,216,.05)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="mt-5">
        <p className="mb-2 font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Product Images</p>
        <ImageUploader value={images} onChange={setImages} />
      </div>

      {/* FAQs */}
      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">FAQ Questions &amp; Answers</p>
          <button type="button" onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#02034a] px-3 py-[6px] font-poppins text-[11px] font-bold text-white transition hover:bg-[#011B50]"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add FAQ
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="relative grid grid-cols-2 gap-2 rounded-[12px] border border-[#dde4f0] bg-[#F7F6FC] p-4 max-[700px]:grid-cols-1">
              <input value={faq.question} onChange={e => { const next = [...faqs]; next[i] = { ...next[i], question: e.target.value }; setFaqs(next) }}
                placeholder="Question"
                className="rounded-[8px] border border-[#dde4f0] bg-white px-3 py-2 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition"
              />
              <input value={faq.answer} onChange={e => { const next = [...faqs]; next[i] = { ...next[i], answer: e.target.value }; setFaqs(next) }}
                placeholder="Answer"
                className="rounded-[8px] border border-[#dde4f0] bg-white px-3 py-2 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition"
              />
              {faqs.length > 1 && (
                <button type="button" onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] hover:bg-red-50 hover:text-red-500 transition"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── KNOW WHAT YOU'RE TAKING ── */}
      <div className="mt-5">
        <div className="mb-3">
          <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
            Know What You&apos;re Taking
          </p>
          <p className="mt-0.5 font-poppins text-[10.5px] text-[#6b7280]">
            Displayed on the product page below the booking section — helps patients understand their test
          </p>
        </div>

        <div className="rounded-[12px] border border-[#dde4f0] bg-[#F7F6FC] overflow-hidden">
          {/* Sub-tabs */}
          <div className="flex border-b border-[#dde4f0]">
            {([
              { key: 'what',    label: "What's Included" },
              { key: 'prepare', label: 'Preparation' },
              { key: 'limits',  label: 'Limitations' },
            ] as const).map(({ key, label }) => (
              <button key={key} type="button" onClick={() => setTiTab(key)}
                className={`flex-1 px-3 py-2.5 font-poppins text-[11.5px] font-semibold transition-colors ${
                  tiTab === key
                    ? 'bg-white text-[#02034a] border-b-2 border-[#00B4D8]'
                    : 'text-[#6b7280] hover:text-[#02034a]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* ── What's Included ── */}
            {tiTab === 'what' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 max-[700px]:grid-cols-1">
                  <div className="flex flex-col gap-1">
                    <label className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
                      Intro Title
                    </label>
                    <input value={whatIntroTitle} onChange={e => setWhatIntroTitle(e.target.value)}
                      placeholder="e.g. What's included in this panel"
                      className="rounded-[8px] border border-[#dde4f0] bg-white px-3 py-2 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
                      Intro Text
                    </label>
                    <input value={whatIntro} onChange={e => setWhatIntro(e.target.value)}
                      placeholder="Brief overview paragraph…"
                      className="rounded-[8px] border border-[#dde4f0] bg-white px-3 py-2 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Measures / Biomarkers</p>
                    <button type="button" onClick={() => setWhatMeasures([...whatMeasures, { title: '', desc: '', bullets: '' }])}
                      className="inline-flex items-center gap-1 rounded-full bg-[#02034a] px-2.5 py-1 font-poppins text-[10px] font-bold text-white hover:bg-[#0077b6] transition"
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {whatMeasures.map((m, i) => (
                      <div key={i} className="relative rounded-[10px] border border-[#dde4f0] bg-white p-3">
                        <div className="grid grid-cols-2 gap-2 max-[600px]:grid-cols-1">
                          <input value={m.title} onChange={e => { const n=[...whatMeasures]; n[i]={...n[i],title:e.target.value}; setWhatMeasures(n) }}
                            placeholder="Marker name (e.g. Testosterone)"
                            className="rounded-[6px] border border-[#dde4f0] px-2.5 py-1.5 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition"
                          />
                          <input value={m.desc} onChange={e => { const n=[...whatMeasures]; n[i]={...n[i],desc:e.target.value}; setWhatMeasures(n) }}
                            placeholder="Short description"
                            className="rounded-[6px] border border-[#dde4f0] px-2.5 py-1.5 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition"
                          />
                          <textarea value={m.bullets} onChange={e => { const n=[...whatMeasures]; n[i]={...n[i],bullets:e.target.value}; setWhatMeasures(n) }}
                            placeholder={"Bullet points (one per line)\ne.g. May indicate hormone imbalance"}
                            rows={2}
                            className="col-span-2 rounded-[6px] border border-[#dde4f0] px-2.5 py-1.5 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition resize-none max-[600px]:col-span-1"
                          />
                        </div>
                        {whatMeasures.length > 1 && (
                          <button type="button" onClick={() => setWhatMeasures(whatMeasures.filter((_,idx) => idx !== i))}
                            className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[#6b7280] hover:bg-red-50 hover:text-red-500 transition"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Test Preparation ── */}
            {tiTab === 'prepare' && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Preparation Steps</p>
                  <button type="button" onClick={() => setPrepSteps([...prepSteps, { title: '', detail: '', important: false }])}
                    className="inline-flex items-center gap-1 rounded-full bg-[#02034a] px-2.5 py-1 font-poppins text-[10px] font-bold text-white hover:bg-[#0077b6] transition"
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Step
                  </button>
                </div>
                <div className="space-y-2">
                  {prepSteps.map((s, i) => (
                    <div key={i} className="relative rounded-[10px] border border-[#dde4f0] bg-white p-3">
                      <div className="grid grid-cols-2 gap-2 max-[600px]:grid-cols-1">
                        <input value={s.title} onChange={e => { const n=[...prepSteps]; n[i]={...n[i],title:e.target.value}; setPrepSteps(n) }}
                          placeholder="Step title (e.g. Fast for 8 hours)"
                          className="rounded-[6px] border border-[#dde4f0] px-2.5 py-1.5 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition"
                        />
                        <input value={s.detail} onChange={e => { const n=[...prepSteps]; n[i]={...n[i],detail:e.target.value}; setPrepSteps(n) }}
                          placeholder="Detail / explanation"
                          className="rounded-[6px] border border-[#dde4f0] px-2.5 py-1.5 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition"
                        />
                        <label className="flex items-center gap-2 col-span-2 max-[600px]:col-span-1">
                          <button type="button" onClick={() => { const n=[...prepSteps]; n[i]={...n[i],important:!n[i].important}; setPrepSteps(n) }}
                            className={`relative flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${s.important ? 'bg-[#00B4D8]' : 'bg-[#dde4f0]'}`}
                          >
                            <span className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${s.important ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                          </button>
                          <span className="font-poppins text-[11px] text-[#6b7280]">Highlight as important (cyan)</span>
                        </label>
                      </div>
                      {prepSteps.length > 1 && (
                        <button type="button" onClick={() => setPrepSteps(prepSteps.filter((_,idx) => idx !== i))}
                          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[#6b7280] hover:bg-red-50 hover:text-red-500 transition"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Test Limitations ── */}
            {tiTab === 'limits' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
                    POCT Notes <span className="font-normal text-[#6b7280] normal-case tracking-normal">(one per line)</span>
                  </label>
                  <textarea value={limitsNotes} onChange={e => setLimitsNotes(e.target.value)} rows={3}
                    placeholder={"Results may vary slightly from lab-processed values\nPoint-of-care tests are not suitable for diagnostic purposes alone"}
                    className="rounded-[8px] border border-[#dde4f0] bg-white px-3 py-2 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#02034a]">
                    Cautions <span className="font-normal text-[#6b7280] normal-case tracking-normal">(shown in amber, one per line)</span>
                  </label>
                  <textarea value={limitsCautions} onChange={e => setLimitsCautions(e.target.value)} rows={2}
                    placeholder={"Not a substitute for professional medical advice\nConsult your GP if results are abnormal"}
                    className="rounded-[8px] border border-[#dde4f0] bg-white px-3 py-2 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition resize-none"
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#02034a]">Affecting Factors</p>
                    <button type="button" onClick={() => setLimitsFactors([...limitsFactors, { factor: '', desc: '' }])}
                      className="inline-flex items-center gap-1 rounded-full bg-[#02034a] px-2.5 py-1 font-poppins text-[10px] font-bold text-white hover:bg-[#0077b6] transition"
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {limitsFactors.map((f, i) => (
                      <div key={i} className="relative grid grid-cols-2 gap-2 rounded-[10px] border border-[#dde4f0] bg-white p-3 max-[600px]:grid-cols-1">
                        <input value={f.factor} onChange={e => { const n=[...limitsFactors]; n[i]={...n[i],factor:e.target.value}; setLimitsFactors(n) }}
                          placeholder="Factor name (e.g. Medications)"
                          className="rounded-[6px] border border-[#dde4f0] px-2.5 py-1.5 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition"
                        />
                        <input value={f.desc} onChange={e => { const n=[...limitsFactors]; n[i]={...n[i],desc:e.target.value}; setLimitsFactors(n) }}
                          placeholder="How it affects results"
                          className="rounded-[6px] border border-[#dde4f0] px-2.5 py-1.5 font-poppins text-[12px] text-[#02034a] placeholder-[#6b7280] outline-none focus:border-[#00B4D8] transition"
                        />
                        {limitsFactors.length > 1 && (
                          <button type="button" onClick={() => setLimitsFactors(limitsFactors.filter((_,idx) => idx !== i))}
                            className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[#6b7280] hover:bg-red-50 hover:text-red-500 transition"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 font-poppins text-[12.5px] text-red-600">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[#00B4D8] px-6 py-3 font-poppins text-[13.5px] font-bold text-white shadow-[0_6px_18px_rgba(0,180,216,.35)] transition hover:bg-[#0077b6] disabled:opacity-60"
        >
          {saving ? 'Saving…' : mode === 'new' ? 'Publish Product' : 'Save Changes'}
        </button>
        <a href="/dashboard/products"
          className="inline-flex items-center gap-2 rounded-full border border-[#dde4f0] px-6 py-3 font-poppins text-[13.5px] font-bold text-[#02034a] transition hover:bg-[#F7F6FC]"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
