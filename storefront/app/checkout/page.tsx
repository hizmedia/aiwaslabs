import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPatientSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
}
import { query } from '@/lib/db'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CheckoutForm from './CheckoutForm'

async function getCartItems(patientId: string) {
  return query<{
    cart_id: string
    product_id: string
    title: string
    price: string
    images: string[]
    slug: string
  }>(
    `SELECT ci.id AS cart_id, ci.product_id, ci.created_at,
            p.title, p.price, p.images, p.slug
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.patient_id = $1
     ORDER BY ci.created_at DESC`,
    [patientId]
  )
}

async function getPatientProfile(patientId: string) {
  const rows = await query<{
    phone: string | null
    date_of_birth: string | null
  }>(
    `SELECT phone, date_of_birth FROM users WHERE id = $1`,
    [patientId]
  )
  return rows[0] ?? null
}

export default async function CheckoutPage() {
  const session = await getPatientSession()
  if (!session) redirect('/account/login?from=/checkout')

  const [cartItems, profile] = await Promise.all([
    getCartItems(session.id),
    getPatientProfile(session.id),
  ])

  return (
    <main className="flex flex-col min-h-screen bg-[#F7F6FC]">
      <Navbar />

      <section className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8">
            <Link href="/products" className="inline-flex items-center gap-1.5 font-poppins text-[11.5px] font-semibold text-[#6b7280] hover:text-[#02034a] transition mb-3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Continue Shopping
            </Link>
            <span className="inline-flex items-center gap-[10px] font-poppins text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
              Home Kit Order
            </span>
            <h1 className="mt-1 font-merriweather text-[28px] lg:text-[34px] font-extrabold text-[#02034a]">
              Checkout
            </h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-[#dde4f0] bg-white p-12 text-center shadow-[0_1px_4px_rgba(2,3,74,.04)]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F6FC] border border-[#dde4f0]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b0b8c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <h2 className="font-merriweather text-[20px] font-extrabold text-[#02034a]">Your cart is empty</h2>
              <p className="mt-2 font-poppins text-[14px] text-[#6b7280]">Add a home test kit to get started.</p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#02034a] px-6 py-3 font-poppins text-[14px] font-bold text-white hover:bg-[#011B50] transition"
              >
                Browse Tests
              </Link>
            </div>
          ) : (
            <CheckoutForm
              cartItems={cartItems}
              defaultName={`${session.first_name} ${session.last_name}`}
              defaultEmail={session.email}
              defaultPhone={profile?.phone ?? ''}
              defaultDob={profile?.date_of_birth ?? ''}
              defaultAddressLine1=""
              defaultCity=""
              defaultPostcode=""
            />
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
