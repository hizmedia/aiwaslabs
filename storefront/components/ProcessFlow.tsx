'use client'

import { useEffect, useRef, useState } from 'react'

const STEPS = [
  {
    n: '01',
    title: 'Book Online',
    desc: 'Choose your test, pick a date, and confirm your slot in under two minutes. No referral letter, no waiting room phone calls.',
  },
  {
    n: '02',
    title: 'Attend or Collect',
    desc: 'Visit our Stoke-on-Trent clinic for a quick blood draw, or request a home kit sent directly to your door.',
  },
  {
    n: '03',
    title: 'Lab Analysis',
    desc: 'Your sample is processed in an accredited UK laboratory under strict clinical standards, typically within hours.',
  },
  {
    n: '04',
    title: 'Doctor Review',
    desc: 'Dr. Tanzil personally reviews every result before it is released - not automated, not outsourced.',
  },
  {
    n: '05',
    title: 'Results Delivered',
    desc: 'Access your full report online the same day, with plain-English explanations and next steps where relevant.',
  },
]

export default function ProcessFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setProgress(1)
      return
    }

    let raf = 0
    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh   = window.innerHeight || 1
      const start   = vh * 0.55
      const end     = vh * 0.2
      const total   = rect.height - (start - end)
      const scrolled = start - rect.top
      const p = total > 0 ? scrolled / total : rect.top < start ? 1 : 0
      setProgress(Math.min(1, Math.max(0, p)))
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const N = STEPS.length

  return (
    <div ref={ref} className="relative mx-auto max-w-[1000px]">

      {/* Rail track */}
      <div className="pointer-events-none absolute bottom-0 top-0 w-[3px] bg-[#dde4f0] max-[900px]:left-[21px] min-[901px]:left-1/2 min-[901px]:-translate-x-1/2" />

      {/* Rail fill */}
      <div
        className="pointer-events-none absolute top-0 w-[3px] bg-[linear-gradient(#00B4D8,#0077b6)] max-[900px]:left-[21px] min-[901px]:left-1/2 min-[901px]:-translate-x-1/2"
        style={{ height: `${progress * 100}%` }}
      >
        {/* moving head */}
        <span className="absolute -bottom-[7px] left-1/2 flex h-[18px] w-[18px] -translate-x-1/2 items-center justify-center rounded-full bg-[#00B4D8] shadow-[0_0_0_6px_rgba(0,180,216,.18)]">
          <svg viewBox="0 0 10 6" fill="none" className="h-[6px] w-[10px]">
            <path d="M1 1l4 4 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Steps */}
      <div className="relative flex flex-col">
        {STEPS.map((s, i) => {
          const nodeAt = (i + 0.5) / N
          const active = progress >= nodeAt - 0.001
          const left   = i % 2 === 0

          const wallMobile  = 'shadow-[5px_5px_0_0_#0a0c2e,11px_11px_0_0_#02034a,16px_28px_34px_-12px_rgba(2,3,74,.28)]'
          const wallDesktop = left
            ? 'min-[901px]:shadow-[-5px_5px_0_0_#0a0c2e,-11px_11px_0_0_#02034a,-16px_28px_34px_-12px_rgba(2,3,74,.28)]'
            : 'min-[901px]:shadow-[5px_5px_0_0_#0a0c2e,11px_11px_0_0_#02034a,16px_28px_34px_-12px_rgba(2,3,74,.28)]'

          return (
            <div
              key={s.n}
              className="relative grid min-h-[176px] items-center py-4 max-[900px]:grid-cols-[44px_1fr] max-[900px]:gap-2 min-[901px]:grid-cols-2"
            >
              {/* Connector arrow - desktop only */}
              <div
                aria-hidden="true"
                className="absolute top-1/2 z-[1] hidden h-[2px] -translate-y-1/2 bg-[#00B4D8] transition-[width] duration-500 ease-out min-[901px]:block"
                style={{
                  width: active ? 50 : 0,
                  left:  left ? undefined : '50%',
                  right: left ? '50%'     : undefined,
                }}
              >
                <span
                  className="absolute top-1/2 -translate-y-1/2 border-y-[5px] border-y-transparent"
                  style={
                    left
                      ? { left: -7,  borderRight: '8px solid #00B4D8' }
                      : { right: -7, borderLeft:  '8px solid #00B4D8' }
                  }
                />
              </div>

              {/* Node */}
              <div
                className="absolute z-[2] flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500 max-[900px]:left-[21px] max-[900px]:-translate-x-1/2 min-[901px]:left-1/2 min-[901px]:-translate-x-1/2"
                style={{
                  backgroundColor: active ? '#02034a' : '#F7F6FC',
                  borderColor:     active ? '#00B4D8' : '#dde4f0',
                  transform:       `scale(${active ? 1 : 0.85})`,
                }}
              >
                <span
                  className="font-poppins text-[11px] font-bold transition-colors duration-500"
                  style={{ color: active ? '#fff' : '#9ca3af' }}
                >
                  {s.n}
                </span>
              </div>

              {/* Card */}
              <div
                className={`max-[900px]:col-start-2 max-[900px]:pl-3 ${
                  left
                    ? 'min-[901px]:col-start-1 min-[901px]:pr-[70px] min-[901px]:text-right'
                    : 'min-[901px]:col-start-2 min-[901px]:pl-[70px]'
                }`}
              >
                <div
                  className={`rounded-2xl border border-[#dde4f0] bg-white p-5 ${wallMobile} ${wallDesktop}`}
                  style={{
                    opacity:    active ? 1 : 0,
                    transform:  active ? 'translateY(0)' : 'translateY(18px)',
                    transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
                  }}
                >
                  <div className="font-poppins text-[10px] font-bold uppercase tracking-[0.16em] text-[#00B4D8]">
                    Step {s.n}
                  </div>
                  <h3 className="mt-1 font-merriweather text-[clamp(18px,2.2vw,24px)] font-extrabold tracking-[-0.02em] text-[#02034a]">
                    {s.title}
                  </h3>
                  <p
                    className={`mt-1.5 font-poppins text-[13.5px] leading-[1.6] text-[#6b7280] ${
                      left ? 'min-[901px]:ml-auto' : ''
                    } max-w-[340px]`}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
