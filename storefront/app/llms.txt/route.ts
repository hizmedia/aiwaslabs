import { NextResponse } from 'next/server'
import { ARTICLES } from '@/lib/articles'

async function getProducts() {
  try {
    const { query } = await import('@/lib/db')
    return query<{ title: string; slug: string; price: string; biomarker_count: number; category_tags: string[] }>(
      'SELECT title, slug, price, biomarker_count, category_tags FROM products WHERE available = true ORDER BY created_at DESC'
    )
  } catch {
    return []
  }
}

export async function GET() {
  const products = await getProducts()

  const productLines = products.map(p =>
    `- [${p.title}](https://aiwaslabs.co.uk/products/${p.slug}): £${p.price}, ${p.biomarker_count} biomarkers${p.category_tags?.length ? ` (${p.category_tags.join(', ')})` : ''}`
  ).join('\n')

  const articleLines = ARTICLES.map(a =>
    `- [${a.title}](https://aiwaslabs.co.uk/resources/${a.slug}): ${a.excerpt.slice(0, 120)}…`
  ).join('\n')

  const body = `# AiwasLabs

> Private blood testing clinic based in Stoke-on-Trent, Staffordshire, UK. We offer same-day results for a wide range of blood tests, reviewed by Dr. Tanzil (GMC registered). No GP referral required. Both clinic visits and home test kits are available.

## Key Information

- **Location**: Unit 6, Parkhall Business Village, Park Hall Road, Stoke-on-Trent, ST3 5XA
- **Phone**: 01782 917963
- **Email**: Aiwas@aiwasmedical.com
- **Opening hours**: Mon–Fri 8am–6pm, Sat 9am–2pm, Sun closed
- **Clinical director**: Dr. Tanzil, GMC Registered
- **Turnaround**: Same-day results for clinic visits; 2–5 days for home kits once received

## Services

We provide private blood testing for individuals who want fast, accurate results without going through the NHS. Tests cover:

- Cholesterol and cardiovascular risk (full lipid panel)
- Hormones (testosterone, oestrogen, FSH, LH, SHBG, prolactin)
- Thyroid function (TSH, Free T3, Free T4, anti-TPO antibodies)
- Diabetes and blood sugar (HbA1c, fasting glucose)
- Nutritional markers (vitamin D, vitamin B12, folate, ferritin, iron studies)
- Inflammation (CRP, ESR)
- Liver and kidney function
- Full blood count
- Sexual health markers (STI screening)
- PSA (prostate-specific antigen) for men
- Cortisol and adrenal markers
- Comprehensive health MOT packages

## Test Delivery Options

1. **Clinic visit** – Walk in or book online. Blood drawn by a trained phlebotomist at our Stoke-on-Trent clinic. Results same day.
2. **Home test kit** – Kit delivered to your door (Inuvi partnership). You collect the sample and return it. Results in 2–5 working days once received.

## Available Tests

${productLines || '(Product list currently unavailable - visit https://aiwaslabs.co.uk/products)'}

## Health Resources

We publish evidence-based guides on key biomarkers, written and reviewed by Dr. Tanzil.

${articleLines}

## Important Notes

- AiwasLabs is a private diagnostic service, not a substitute for NHS care or medical advice.
- In an emergency, call 999 or go to A&E.
- Patients must be 18 or older.
- All data is handled in accordance with UK GDPR and the Data Protection Act 2018.
- Test results are reviewed by a GMC-registered doctor and returned with a written report.

## Pages

- [Home](https://aiwaslabs.co.uk)
- [All Blood Tests](https://aiwaslabs.co.uk/products)
- [Health Resources](https://aiwaslabs.co.uk/resources)
- [Contact Us](https://aiwaslabs.co.uk/contact)
- [Privacy Policy](https://aiwaslabs.co.uk/privacy)
- [Terms of Service](https://aiwaslabs.co.uk/terms)
- [Google Business Profile](https://share.google/OqyvJfqd02whJiG8z)
`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
