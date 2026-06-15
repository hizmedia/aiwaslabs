import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AiwasLabs - Private Blood Testing · Stoke-on-Trent'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadFont(name: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${name}:wght@${weight}&display=swap`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } }
    ).then(r => r.text())
    const url = css.match(/url\(([^)]+)\)/)?.[1]
    if (!url) return null
    return fetch(url).then(r => r.arrayBuffer())
  } catch {
    return null
  }
}

export default async function Image() {
  const [merriweather, poppins] = await Promise.all([
    loadFont('Merriweather', 900),
    loadFont('Poppins', 600),
  ])

  const fonts: ConstructorParameters<typeof ImageResponse>[1]['fonts'] = []
  if (merriweather) fonts.push({ name: 'Merriweather', data: merriweather, weight: 900, style: 'normal' })
  if (poppins)      fonts.push({ name: 'Poppins',      data: poppins,      weight: 600, style: 'normal' })

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: 'linear-gradient(135deg, #011B50 0%, #02034a 55%, #010238 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Teal glow orb - top right */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '520px', height: '520px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,216,0.22) 0%, transparent 70%)',
          display: 'flex',
        }} />
        {/* Teal glow orb - bottom left */}
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-60px',
          width: '380px', height: '380px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,119,182,0.18) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Geometric teal ring - right */}
        <div style={{
          position: 'absolute', right: '60px', top: '50%',
          transform: 'translateY(-50%)',
          width: '320px', height: '320px', borderRadius: '50%',
          border: '2px solid rgba(0,180,216,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '240px', height: '240px', borderRadius: '50%',
            border: '2px solid rgba(0,180,216,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '160px', height: '160px', borderRadius: '50%',
              background: 'rgba(0,180,216,0.1)',
              border: '2px solid rgba(0,180,216,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Drop/blood icon */}
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#00B4D8" opacity="0.9"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Content - left column */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 60px', flex: 1, maxWidth: '760px' }}>

          {/* Top: wordmark + location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '48px', height: '48px', borderRadius: '12px',
              background: '#00B4D8',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="white"/>
              </svg>
            </div>
            <span style={{
              fontFamily: poppins ? 'Poppins' : 'sans-serif',
              fontSize: '22px', fontWeight: 600,
              color: 'white', letterSpacing: '-0.3px',
            }}>
              AiwasLabs
            </span>
            <div style={{
              marginLeft: '8px',
              padding: '4px 12px', borderRadius: '999px',
              border: '1px solid rgba(0,180,216,0.35)',
              background: 'rgba(0,180,216,0.1)',
            }}>
              <span style={{
                fontFamily: poppins ? 'Poppins' : 'sans-serif',
                fontSize: '12px', fontWeight: 600,
                color: '#00B4D8', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Stoke-on-Trent
              </span>
            </div>
          </div>

          {/* Middle: headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '24px', height: '3px', background: '#00B4D8', borderRadius: '2px' }} />
              <span style={{
                fontFamily: poppins ? 'Poppins' : 'sans-serif',
                fontSize: '13px', fontWeight: 600, color: '#00B4D8',
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>
                Private Blood Testing
              </span>
            </div>
            <h1 style={{
              fontFamily: merriweather ? 'Merriweather' : 'serif',
              fontSize: '64px', fontWeight: 900, lineHeight: 1.05,
              color: 'white', margin: 0,
              letterSpacing: '-1px',
            }}>
              Know Your{' '}
              <span style={{ color: '#00B4D8' }}>Health.</span>
            </h1>
            <p style={{
              fontFamily: poppins ? 'Poppins' : 'sans-serif',
              fontSize: '19px', fontWeight: 400, lineHeight: 1.55,
              color: 'rgba(255,255,255,0.65)', margin: 0,
            }}>
              Same-day results · Doctor reviewed · No referral needed
            </p>
          </div>

          {/* Bottom: badges */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['Cholesterol', 'Hormones', 'Diabetes', 'Vitamins', 'Thyroid'].map(label => (
              <div key={label} style={{
                padding: '8px 16px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
                <span style={{
                  fontFamily: poppins ? 'Poppins' : 'sans-serif',
                  fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.75)',
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
