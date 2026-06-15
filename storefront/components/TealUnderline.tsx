'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export function TealUnderline({ children }: { children: ReactNode }) {
  const ref   = useRef<HTMLSpanElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setDrawn(true); io.disconnect() } },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span ref={ref} className="relative inline-block italic text-[#00B4D8]">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 16"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute -bottom-[9px] left-0 h-[11px] w-full"
        style={{
          clipPath:  drawn ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
          transition: 'clip-path 0.85s ease-out 0.25s',
        }}
      >
        <path d="M3 13 Q150 1 297 13" stroke="#00B4D8" strokeWidth="3.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  )
}
