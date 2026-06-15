import { ImageResponse } from 'next/og'
import { query } from '@/lib/db'

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

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const rows = await query<{
    title: string
    price: string
    biomarker_count: number
    badge: string | null
    category_tags: string[]
    images: string[]
  }>('SELECT title, price, biomarker_count, badge, category_tags, images FROM products WHERE slug = $1 AND available = true', [slug]).catch(() => [])

  const product = rows[0]

  const [merriweather, poppins] = await Promise.all([
    loadFont('Merriweather', 900),
    loadFont('Poppins', 600),
  ])

  const fonts: { name: string; data: ArrayBuffer; weight: 100|200|300|400|500|600|700|800|900; style: "normal"|"italic" }[] = []
  if (merriweather) fonts.push({ name: 'Merriweather', data: merriweather, weight: 900, style: 'normal' })
  if (poppins)      fonts.push({ name: 'Poppins',      data: poppins,      weight: 600, style: 'normal' })

  const title = product?.title ?? 'Private Blood Test'
  const price = product?.price ? `£${product.price}` : ''
  const markers = product?.biomarker_count ?? 0
  const badge = product?.badge ?? null
  const category = product?.category_tags?.[0] ?? 'Blood Test'
  const image = product?.images?.[0] ?? null

  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px', display: 'flex',
        background: 'linear-gradient(135deg, #011B50 0%, #02034a 55%, #010238 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Teal glow - top right */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-40px',
          width: '440px', height: '440px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,216,0.18) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Product image - right panel */}
        {image ? (
          <div style={{
            position: 'absolute', right: '0', top: '0', bottom: '0',
            width: '400px', display: 'flex', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: '0',
              background: 'linear-gradient(90deg, #02034a 0%, transparent 40%)',
              zIndex: 1, display: 'flex',
            }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          </div>
        ) : (
          /* Placeholder rings when no image */
          <div style={{
            position: 'absolute', right: '80px', top: '50%',
            transform: 'translateY(-50%)',
            width: '280px', height: '280px', borderRadius: '50%',
            border: '1px solid rgba(0,180,216,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '200px', height: '200px', borderRadius: '50%',
              border: '1px solid rgba(0,180,216,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '130px', height: '130px', borderRadius: '50%',
                background: 'rgba(0,180,216,0.1)',
                border: '2px solid rgba(0,180,216,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#00B4D8" opacity="0.85"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Left content */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px', flex: 1, maxWidth: '720px', zIndex: 2 }}>

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
          </div>

          {/* Category + badge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '22px', height: '3px', background: '#00B4D8', borderRadius: '2px' }} />
              <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '12px', fontWeight: 600, color: '#00B4D8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {category}
              </span>
              {badge && (
                <div style={{
                  marginLeft: '4px', padding: '3px 10px', borderRadius: '999px',
                  background: '#00B4D8', display: 'flex',
                }}>
                  <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '10px', fontWeight: 600, color: 'white', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {badge}
                  </span>
                </div>
              )}
            </div>

            <h1 style={{
              fontFamily: merriweather ? 'Merriweather' : 'serif',
              fontSize: title.length > 40 ? '44px' : '56px',
              fontWeight: 900, lineHeight: 1.1,
              color: 'white', margin: 0, letterSpacing: '-0.5px',
            }}>
              {title}
            </h1>

            <p style={{
              fontFamily: poppins ? 'Poppins' : 'sans-serif',
              fontSize: '17px', color: 'rgba(255,255,255,0.6)', margin: 0,
            }}>
              Private blood test · Same-day results · Doctor reviewed
            </p>
          </div>

          {/* Price + markers */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {price && (
              <div style={{
                padding: '12px 24px', borderRadius: '14px',
                background: 'rgba(0,180,216,0.15)',
                border: '1px solid rgba(0,180,216,0.35)',
                display: 'flex', flexDirection: 'column', gap: '2px',
              }}>
                <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '11px', fontWeight: 600, color: '#00B4D8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>From</span>
                <span style={{ fontFamily: merriweather ? 'Merriweather' : 'serif', fontSize: '32px', fontWeight: 900, color: 'white' }}>{price}</span>
              </div>
            )}
            {markers > 0 && (
              <div style={{
                padding: '12px 24px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', flexDirection: 'column', gap: '2px',
              }}>
                <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Markers</span>
                <span style={{ fontFamily: merriweather ? 'Merriweather' : 'serif', fontSize: '32px', fontWeight: 900, color: 'white' }}>{markers}</span>
              </div>
            )}
            <div style={{
              padding: '12px 24px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', flexDirection: 'column', gap: '2px',
            }}>
              <span style={{ fontFamily: poppins ? 'Poppins' : 'sans-serif', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Results</span>
              <span style={{ fontFamily: merriweather ? 'Merriweather' : 'serif', fontSize: '32px', fontWeight: 900, color: 'white' }}>Same Day</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
