import { ImageResponse } from 'next/og'
import { getArticle, AUTHOR } from '@/lib/articles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)

  const [merriweather, poppins] = await Promise.all([
    loadFont('Merriweather', 900),
    loadFont('Poppins', 600),
  ])

  const fonts: { name: string; data: ArrayBuffer; weight: 100|200|300|400|500|600|700|800|900; style: "normal"|"italic" }[] = []
  if (merriweather) fonts.push({ name: 'Merriweather', data: merriweather, weight: 900, style: 'normal' })
  if (poppins)      fonts.push({ name: 'Poppins',      data: poppins,      weight: 600, style: 'normal' })

  const accent = article?.accent ?? '#00B4D8'
  const title = article?.title ?? 'Health Resources'
  const biomarker = article?.biomarker ?? 'Blood Test'
  const category = article?.category ?? 'Health'
  const readTime = article?.readTime ?? 5
  const date = article?.date ? formatDate(article.date) : ''

  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px', display: 'flex',
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${accent}f0 0%, ${accent} 100%)`,
      }}>
        {/* Dark overlay for readability */}
        <div style={{
          position: 'absolute', inset: '0',
          background: 'linear-gradient(135deg, rgba(1,2,56,0.75) 0%, rgba(1,2,56,0.45) 100%)',
          display: 'flex',
        }} />

        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: '0',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          display: 'flex',
        }} />

        {/* Right: large biomarker label */}
        <div style={{
          position: 'absolute', right: '-20px', top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'center center',
          display: 'flex',
        }}>
          <span style={{
            fontFamily: merriweather ? 'Merriweather' : 'serif',
            fontSize: '120px', fontWeight: 900,
            color: 'rgba(255,255,255,0.06)',
            letterSpacing: '-2px', whiteSpace: 'nowrap',
          }}>
            {biomarker}
          </span>
        </div>

        {/* Decorative circle */}
        <div style={{
          position: 'absolute', right: '80px', top: '50%',
          transform: 'translateY(-50%)',
          width: '260px', height: '260px', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '185px', height: '185px', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Left content */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px', flex: 1, maxWidth: '740px', zIndex: 2 }}>

          {/* Top: AiwasLabs + Resources label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '18px', fontWeight: 600, color: 'white' }}>AiwasLabs</span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', marginLeft: '2px' }} />
            <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Health Resources</span>
          </div>

          {/* Middle: category + title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                padding: '4px 12px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex',
              }}>
                <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '11px', fontWeight: 600, color: 'white', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {category}
                </span>
              </div>
              <div style={{
                padding: '4px 12px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
              }}>
                <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {biomarker}
                </span>
              </div>
            </div>

            <h1 style={{
              fontFamily: merriweather ? 'Merriweather' : 'serif',
              fontSize: title.length > 50 ? '40px' : title.length > 35 ? '48px' : '56px',
              fontWeight: 900, lineHeight: 1.1,
              color: 'white', margin: 0, letterSpacing: '-0.5px',
            }}>
              {title}
            </h1>
          </div>

          {/* Bottom: author + meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: merriweather ? 'Merriweather' : 'serif', fontSize: '13px', fontWeight: 900, color: 'white' }}>Dr</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '14px', fontWeight: 600, color: 'white' }}>{AUTHOR.name}</span>
              <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>GMC Registered · Clinical Director</span>
            </div>
            {date && (
              <>
                <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.2)', marginLeft: '4px' }} />
                <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{date}</span>
              </>
            )}
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{readTime} min read</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
