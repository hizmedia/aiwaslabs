import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with AiwasLabs. Call us on 01782 917963, email us, or fill in the form. Located at Parkhall Business Village, Stoke-on-Trent ST3 5XA.',
  alternates: { canonical: 'https://aiwaslabs.co.uk/contact' },
  openGraph: {
    type: 'website',
    url: 'https://aiwaslabs.co.uk/contact',
    title: 'Contact AiwasLabs | Private Blood Testing Stoke-on-Trent',
    description: 'Call, email, or visit our clinic in Stoke-on-Trent. Same-day appointments available.',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
