'use client'

import { useRef, useState } from 'react'

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  const innerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={`rounded-[14px] border bg-white transition-shadow duration-200 ${
        isOpen
          ? 'border-[#00B4D8] shadow-[0_0_0_3px_rgba(0,180,216,.1)]'
          : 'border-[#dde4f0] hover:border-[#b0bcd4]'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-5 py-[15px] text-left"
      >
        <span className="font-merriweather font-bold text-[clamp(13px,1.5vw,15px)] text-[#02034a]">
          {question}
        </span>

        <div
          className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
            isOpen ? 'bg-[#02034a]' : 'bg-[#00B4D8]'
          }`}
        >
          <span className="absolute h-[2px] w-3 rounded-full bg-white" />
          <span
            className="absolute h-3 w-[2px] rounded-full bg-white"
            style={{
              transform: isOpen ? 'scaleY(0)' : 'scaleY(1)',
              transition: 'transform 250ms ease',
            }}
          />
        </div>
      </button>

      {/* Height animates to the inner div's natural scrollHeight */}
      <div
        style={{
          height: isOpen ? (innerRef.current?.scrollHeight ?? 0) : 0,
          overflow: 'hidden',
          transition: 'height 280ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div ref={innerRef}>
          <div
            className="px-5 pb-4 pt-1 font-poppins text-[13.5px] leading-[1.7] text-[#6b7280]"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      </div>
    </div>
  )
}

export default function FAQSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
          Got Questions?
        </span>
        <h2 className="mt-3 font-merriweather text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-[-0.02em] text-[#02034a]">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            question={faq.question}
            answer={faq.answer}
            isOpen={open === i}
            onToggle={() => setOpen(prev => (prev === i ? null : i))}
          />
        ))}
      </div>
    </div>
  )
}
