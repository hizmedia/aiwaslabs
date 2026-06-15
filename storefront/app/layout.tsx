import type { Metadata } from 'next'
import { Merriweather, Poppins, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const SITE_URL = 'https://aiwaslabs.co.uk'
const OG_IMAGE = 'https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AiwasLabs - Private Blood Testing · Stoke-on-Trent',
    template: '%s | AiwasLabs',
  },
  description: 'Same-day private blood tests in Stoke-on-Trent. Doctor-reviewed results, no GP referral needed. Walk in or book online - clinic visits and home kits available.',
  keywords: [
    'private blood test Stoke-on-Trent',
    'same day blood test results',
    'private health check Staffordshire',
    'blood testing clinic near me',
    'cholesterol test Stoke',
    'testosterone test private',
    'vitamin D blood test',
    'thyroid function test',
    'HbA1c diabetes test',
    'doctor reviewed blood results',
    'private medical testing',
    'AiwasLabs',
  ],
  authors: [{ name: 'Dr. Tanzil', url: SITE_URL }],
  creator: 'AiwasLabs',
  publisher: 'AiwasLabs',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'AiwasLabs',
    title: 'AiwasLabs - Private Blood Testing · Stoke-on-Trent',
    description: 'Same-day private blood tests in Stoke-on-Trent. Doctor-reviewed results, no GP referral needed.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'AiwasLabs - Private Blood Testing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AiwasLabs - Private Blood Testing · Stoke-on-Trent',
    description: 'Same-day private blood tests in Stoke-on-Trent. Doctor-reviewed results, no GP referral needed.',
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  verification: {
    google: 'google-site-verification-token',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: 'AiwasLabs',
  description: 'Private blood testing clinic in Stoke-on-Trent offering same-day results, doctor-reviewed reports, and home test kits.',
  url: SITE_URL,
  logo: OG_IMAGE,
  image: OG_IMAGE,
  telephone: '+441782917963',
  email: 'Aiwas@aiwasmedical.com',
  priceRange: '££',
  currenciesAccepted: 'GBP',
  paymentAccepted: 'Cash, Credit Card, Debit Card',
  medicalSpecialty: 'Pathology',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Unit 6, Parkhall Business Village',
    addressLocality: 'Stoke-on-Trent',
    addressRegion: 'Staffordshire',
    postalCode: 'ST3 5XA',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 52.9878,
    longitude: -2.1326,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '47',
  },
  sameAs: [
    'https://www.instagram.com/aiwaslabs/',
    'https://www.facebook.com/profile.php?id=61578599641656',
    'https://share.google/OqyvJfqd02whJiG8z',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'AiwasLabs',
  description: 'Private blood testing clinic in Stoke-on-Trent',
  publisher: { '@id': `${SITE_URL}/#business` },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${merriweather.variable} ${poppins.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#02034a" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#02034a]">{children}</body>
    </html>
  )
}
