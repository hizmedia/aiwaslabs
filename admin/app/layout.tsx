import type { Metadata } from 'next'
import { Merriweather, Poppins } from 'next/font/google'
import './globals.css'

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'AiwasLabs Admin',
  description: 'Doctor & admin dashboard — AiwasLabs Private Blood Testing',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${merriweather.variable} ${poppins.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
