'use client'

import { useState } from 'react'

type Measure = { title: string; desc?: string; bullets?: string[] }
type PrepStep = { title: string; detail: string; important?: boolean }
type LimitFactor = { factor: string; desc: string }

export type TestInfo = {
  what?: {
    introTitle?: string
    intro?: string
    measures?: Measure[]
  }
  prepare?: PrepStep[]
  limits?: {
    poctNotes?: string[]
    cautions?: string[]
    factors?: LimitFactor[]
  }
}

export default function TestInfoShowcase({ testInfo }: { testInfo: TestInfo }) {
  const [activeTab, setActiveTab] = useState<'what' | 'prepare' | 'limits'>('what')
  const [openMeasures, setOpenMeasures] = useState<number[]>([])

  const toggleMeasure = (i: number) =>
    setOpenMeasures(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  const tabs = [
    { key: 'what',    label: "What's included",  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'prepare', label: 'Test preparation',  icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'limits',  label: 'Test limitations',  icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  ] as const

  const what    = testInfo.what
  const prepare = testInfo.prepare ?? []
  const limits  = testInfo.limits

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[18px] before:flex-shrink-0 before:bg-[#00B4D8] before:content-['']">
          Test Information
        </span>
        <h2 className="mt-3 font-merriweather text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-[-0.02em] text-[#02034a]">
          Know What You&apos;re Taking
        </h2>
        <p className="mt-2 font-poppins text-[14px] text-[#6b7280]">
          Essential information about your test
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dde4f0] bg-white shadow-[0_4px_20px_rgba(2,3,74,.07)]">
        {/* Tab bar */}
        <div className="flex border-b border-[#dde4f0] bg-[#F7F6FC]">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 px-4 py-4 font-poppins text-[12.5px] font-semibold transition-colors ${
                activeTab === t.key
                  ? 'border-b-2 border-[#00B4D8] bg-white text-[#02034a]'
                  : 'text-[#6b7280] hover:bg-white/50 hover:text-[#02034a]'
              }`}
            >
              <svg
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={activeTab === t.key ? '#00B4D8' : '#6b7280'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d={t.icon} />
              </svg>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">

          {/* ── WHAT'S INCLUDED ── */}
          {activeTab === 'what' && (
            <div className="space-y-6">
              {what?.introTitle && (
                <div>
                  <h3 className="font-merriweather text-[18px] font-extrabold text-[#02034a]">
                    {what.introTitle}
                  </h3>
                  {what.intro && (
                    <p className="mt-2 font-poppins text-[14px] leading-relaxed text-[#6b7280]">
                      {what.intro}
                    </p>
                  )}
                </div>
              )}

              {what?.measures && what.measures.length > 0 && (
                <div>
                  <h4 className="mb-3 font-poppins text-[11px] font-bold uppercase tracking-[0.12em] text-[#02034a]">
                    What we measure:
                  </h4>
                  <div className="space-y-2">
                    {what.measures.map((m, i) => {
                      const expanded = openMeasures.includes(i)
                      return (
                        <div
                          key={i}
                          className={`overflow-hidden rounded-xl border transition-all ${
                            expanded ? 'border-[#00B4D8] shadow-[0_0_0_3px_rgba(0,180,216,.1)]' : 'border-[#dde4f0]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleMeasure(i)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-[#F7F6FC]"
                          >
                            <div className="flex items-center gap-3">
                              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#00B4D8]" />
                              <span className="font-poppins text-[13.5px] font-semibold text-[#02034a]">{m.title}</span>
                            </div>
                            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-[18px] leading-none text-white transition-transform ${
                              expanded ? 'rotate-45 bg-[#02034a]' : 'bg-[#00B4D8]'
                            }`}>
                              +
                            </div>
                          </button>
                          {expanded && (
                            <div className="px-4 pb-5 pt-1">
                              {m.desc && (
                                <p className="mb-3 font-poppins text-[13px] leading-relaxed text-[#6b7280]">{m.desc}</p>
                              )}
                              {m.bullets?.length ? (
                                <ul className="space-y-2">
                                  {m.bullets.map((b, j) => (
                                    <li key={j} className="flex items-start gap-2 font-poppins text-[12.5px] text-[#6b7280]">
                                      <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00B4D8]" />
                                      {b}
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {!what?.introTitle && (!what?.measures || what.measures.length === 0) && (
                <p className="font-poppins text-[14px] text-[#6b7280]">No information added yet.</p>
              )}
            </div>
          )}

          {/* ── TEST PREPARATION ── */}
          {activeTab === 'prepare' && (
            <div>
              <h3 className="font-merriweather text-[18px] font-extrabold text-[#02034a]">
                How to prepare for your test
              </h3>
              <p className="mt-1 font-poppins text-[13.5px] text-[#6b7280]">
                Follow these guidelines for the most accurate results
              </p>

              {prepare.length === 0 ? (
                <p className="mt-6 font-poppins text-[14px] text-[#6b7280]">No preparation steps added yet.</p>
              ) : (
                <div className="mt-6 space-y-3">
                  {prepare.map((step, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-4 ${step.important ? 'border-[#00B4D8] bg-[#CAF0F8]' : 'border-[#dde4f0] bg-[#F7F6FC]'}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-poppins text-[11px] font-bold ${
                          step.important
                            ? 'bg-[#00B4D8] text-white shadow-[0_2px_8px_rgba(0,180,216,.35)]'
                            : 'bg-[#02034a] text-white'
                        }`}>
                          {i + 1}
                        </span>
                        <div>
                          <h4 className="font-poppins text-[14px] font-semibold text-[#02034a]">{step.title}</h4>
                          <p className="mt-0.5 font-poppins text-[13px] leading-relaxed text-[#6b7280]">{step.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TEST LIMITATIONS ── */}
          {activeTab === 'limits' && (
            <div>
              <h3 className="font-merriweather text-[18px] font-extrabold text-[#02034a]">
                Important considerations
              </h3>
              <p className="mt-1 font-poppins text-[13.5px] text-[#6b7280]">
                Factors that may influence your results
              </p>

              {limits?.poctNotes && limits.poctNotes.length > 0 && (
                <div className="mt-6 rounded-xl border border-[#dde4f0] bg-[#F7F6FC] p-5">
                  <h4 className="mb-2 font-poppins text-[13px] font-bold text-[#02034a]">About point-of-care testing (POCT)</h4>
                  <ul className="space-y-1.5">
                    {limits.poctNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 font-poppins text-[13px] text-[#6b7280]">
                        <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00B4D8]" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {limits?.cautions && limits.cautions.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
                  {limits.cautions.map((c, i) => (
                    <p key={i} className="font-poppins text-[13px] leading-relaxed text-amber-800">{c}</p>
                  ))}
                </div>
              )}

              {limits?.factors && limits.factors.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-3 font-poppins text-[11px] font-bold uppercase tracking-[0.12em] text-[#02034a]">
                    Factors affecting results:
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {limits.factors.map((item, i) => (
                      <div key={i} className="rounded-xl border border-[#dde4f0] bg-[#F7F6FC] p-4">
                        <h5 className="font-poppins text-[13px] font-bold text-[#02034a]">{item.factor}</h5>
                        <p className="mt-1 font-poppins text-[12px] leading-relaxed text-[#6b7280]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!limits?.poctNotes?.length && !limits?.cautions?.length && !limits?.factors?.length && (
                <p className="mt-6 font-poppins text-[14px] text-[#6b7280]">No limitation notes added yet.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
