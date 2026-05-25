'use client'

import { useState } from 'react'

export default function FAQSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number[]>([])
  const toggle = (i: number) =>
    setOpen(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  return (
    <div>
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
          Got Questions?
        </span>
        <h2 className="mt-3 font-merriweather text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-[-0.02em] text-[#02034a]">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => {
          const isOpen = open.includes(i)
          return (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className={`w-full bg-white border rounded-[14px] px-5 py-[15px] flex justify-between items-center gap-3 transition-all ${
                  isOpen
                    ? 'border-[#00B4D8] shadow-[0_0_0_3px_rgba(0,180,216,.1)]'
                    : 'border-[#dde4f0] hover:border-[#02034a]'
                }`}
              >
                <span className="font-merriweather font-bold text-[clamp(13px,1.5vw,15px)] text-[#02034a] text-left">
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-white text-[18px] leading-none transition-all ${
                  isOpen ? 'bg-[#02034a]' : 'bg-[#00B4D8]'
                }`}>
                  {isOpen ? '−' : '+'}
                </div>
              </button>
              {isOpen && (
                <div className="px-5 py-3 font-poppins text-[13.5px] text-[#6b7280] leading-[1.65]">
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
