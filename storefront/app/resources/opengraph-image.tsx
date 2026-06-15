import { ImageResponse } from 'next/og'
import { ARTICLES } from '@/lib/articles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const alt = 'Health Resources - Biomarker Guides | AiwasLabs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadFont(name: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${name}:wght@${weight}&display=swap`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 5.1)' } }
    ).then(r => r.text())
    const url = css.match(/url\(([^)]+)\)/)?.[1]
    if (!url) return null
    return fetch(url).then(r => r.arrayBuffer())
  } catch {
    return null
  }
}

const ACCENT_COLOURS = ['#0077b6', '#023e8a', '#00B4D8', '#2d6a4f', '#d62828', '#e76f51', '#4361ee', '#c77dff']

export default async function Image() {
  const [merriweather, poppins] = await Promise.all([
    loadFont('Merriweather', 900),
    loadFont('Poppins', 600),
  ])

  const fonts: { name: string; data: ArrayBuffer; weight: 100|200|300|400|500|600|700|800|900; style: "normal"|"italic" }[] = []
  if (merriweather) fonts.push({ name: 'Merriweather', data: merriweather, weight: 900, style: 'normal' })
  if (poppins)      fonts.push({ name: 'Poppins',      data: poppins,      weight: 600, style: 'normal' })

  const biomarkers = ARTICLES.slice(0, 8).map(a => ({ name: a.biomarker, accent: a.accent }))

  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px', display: 'flex',
        background: 'linear-gradient(135deg, #011B50 0%, #02034a 55%, #010238 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Teal glow */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-60px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,216,0.15) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '300px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,119,182,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Floating biomarker cards - right side */}
        <div style={{
          position: 'absolute', right: '48px', top: '0', bottom: '0',
          width: '380px', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', gap: '10px', paddingTop: '24px', paddingBottom: '24px',
        }}>
          {biomarkers.map(({ name, accent }, i) => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              opacity: i >= 6 ? 0.5 : i >= 4 ? 0.75 : 1,
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: accent, flexShrink: 0,
              }} />
              <span style={{
                fontFamily: poppins ? 'Poppins' : 'sans-serif',
                fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)',
              }}>
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Vertical divider */}
        <div style={{
          position: 'absolute', right: '468px', top: '60px', bottom: '60px',
          width: '1px', background: 'rgba(255,255,255,0.08)', display: 'flex',
        }} />

        {/* Left content */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px', maxWidth: '700px', zIndex: 2 }}>

          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#00B4D8', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '18px', fontWeight: 600, color: 'white' }}>AiwasLabs</span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
            <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Health Resources</span>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '22px', height: '3px', background: '#00B4D8', borderRadius: '2px' }} />
              <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '12px', fontWeight: 600, color: '#00B4D8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Evidence-Based Guides
              </span>
            </div>
            <h1 style={{
              fontFamily: merriweather ? 'Merriweather' : 'serif',
              fontSize: '58px', fontWeight: 900, lineHeight: 1.08,
              color: 'white', margin: 0, letterSpacing: '-0.5px',
            }}>
              Know your numbers.{' '}
              <span style={{ color: '#00B4D8' }}>Understand your health.</span>
            </h1>
            <p style={{
              fontFamily: poppins ? 'Poppins' : 'sans-serif',
              fontSize: '17px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5,
            }}>
              Written & reviewed by Dr. Tanzil, GMC-registered clinical director.
            </p>
          </div>

          {/* Article count badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px 20px', borderRadius: '999px',
              background: 'rgba(0,180,216,0.15)',
              border: '1px solid rgba(0,180,216,0.35)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '13px', fontWeight: 600, color: '#00B4D8' }}>
                {ARTICLES.length} Biomarker Guides
              </span>
            </div>
            <div style={{
              padding: '10px 20px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
            }}>
              <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                Free to read
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
