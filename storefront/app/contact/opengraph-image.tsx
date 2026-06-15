import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Contact AiwasLabs - Private Blood Testing, Stoke-on-Trent'
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

  const details = [
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', label: 'Unit 6, Parkhall Business Village, ST3 5XA' },
    { icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.38 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z', label: '01782 917963' },
    { icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', label: 'Mon-Fri 8am-6pm · Sat 9am-2pm' },
  ]

  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px', display: 'flex',
        background: 'linear-gradient(135deg, #011B50 0%, #02034a 55%, #010238 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '520px', height: '520px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,216,0.18) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '200px',
          width: '380px', height: '380px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,119,182,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Right panel - map pin illustration */}
        <div style={{
          position: 'absolute', right: '60px', top: '50%',
          transform: 'translateY(-50%)',
          width: '340px', height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '240px', height: '240px', borderRadius: '50%',
            border: '1px solid rgba(0,180,216,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              width: '180px', height: '180px', borderRadius: '50%',
              border: '1px solid rgba(0,180,216,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'rgba(0,180,216,0.12)',
                border: '1px solid rgba(0,180,216,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                  <path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Left content */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px', maxWidth: '720px', zIndex: 2 }}>

          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#00B4D8', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="white" />
              </svg>
            </div>
            <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '18px', fontWeight: 600, color: 'white' }}>AiwasLabs</span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
            <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Stoke-on-Trent</span>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '22px', height: '3px', background: '#00B4D8', borderRadius: '2px' }} />
              <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '12px', fontWeight: 600, color: '#00B4D8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Get In Touch
              </span>
            </div>
            <h1 style={{
              fontFamily: merriweather ? 'Merriweather' : 'serif',
              fontSize: '58px', fontWeight: 900, lineHeight: 1.08,
              color: 'white', margin: 0, letterSpacing: '-0.5px',
            }}>
              Book your test.{' '}
              <span style={{ color: '#00B4D8' }}>Same day.</span>
            </h1>
            <p style={{
              fontFamily: poppins ? 'Poppins' : 'sans-serif',
              fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5,
            }}>
              No GP referral needed. Walk in or book online.
            </p>
          </div>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {details.map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'rgba(0,180,216,0.12)', border: '1px solid rgba(0,180,216,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                  </svg>
                </div>
                <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
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
