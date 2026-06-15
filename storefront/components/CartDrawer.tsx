'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: string
  product_id: string
  title: string
  price: string
  images: string[]
  slug: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onCountChange: (n: number) => void
}

export default function CartDrawer({ isOpen, onClose, onCountChange }: Props) {
  const [items, setItems]       = useState<CartItem[]>([])
  const [loading, setLoading]   = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  const fetchCart = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart')
      if (!res.ok) { setItems([]); return }
      const data: CartItem[] = await res.json()
      setItems(data)
      onCountChange(data.length)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [onCountChange])

  useEffect(() => {
    if (isOpen) fetchCart()
  }, [isOpen, fetchCart])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const removeItem = async (cartId: string) => {
    setRemoving(cartId)
    try {
      await fetch(`/api/cart/${cartId}`, { method: 'DELETE' })
      const next = items.filter(i => i.id !== cartId)
      setItems(next)
      onCountChange(next.length)
    } catch {
      // silent - item stays in list
    } finally {
      setRemoving(null)
    }
  }

  const total = items.reduce((sum, i) => sum + parseFloat(i.price), 0)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[59] bg-[#02034a]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[60] flex h-full w-[400px] max-w-[90vw] flex-col bg-white shadow-[-12px_0_48px_rgba(2,3,74,.16)] transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dde4f0] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#02034a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2 className="font-merriweather text-[16px] font-extrabold text-[#02034a]">
              Your Cart
            </h2>
            {items.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#CAF0F8] px-1.5 font-poppins text-[10px] font-bold text-[#0077b6]">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#F7F6FC] hover:text-[#02034a]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body - scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <svg className="h-6 w-6 animate-spin text-[#00B4D8]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#dde4f0] bg-[#F7F6FC]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b0b8c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <div>
                <p className="font-merriweather text-[16px] font-extrabold text-[#02034a]">Your cart is empty</p>
                <p className="mt-1 font-poppins text-[13px] text-[#6b7280]">Add a home test kit to get started.</p>
              </div>
              <Link
                href="/products"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-[#02034a] px-5 py-2.5 font-poppins text-[13px] font-bold text-white transition hover:bg-[#0077b6]"
              >
                Browse Tests
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#f3f4f6]">
              {items.map(item => (
                <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                  {/* Image */}
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-[#F7F6FC]">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]} alt={item.title}
                        width={56} height={56}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dde4f0" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="block font-poppins text-[13px] font-semibold leading-tight text-[#02034a] hover:text-[#0077b6] transition"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 font-poppins text-[11px] text-[#6b7280]">Home Test Kit</p>
                    <p className="mt-1 font-merriweather text-[15px] font-extrabold text-[#02034a]">£{item.price}</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={removing === item.id}
                    aria-label={`Remove ${item.title}`}
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[#b0b8c8] transition hover:bg-red-50 hover:text-red-400 disabled:opacity-40"
                  >
                    {removing === item.id ? (
                      <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#dde4f0] bg-white px-5 py-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-poppins text-[13px] text-[#6b7280]">Shipping</span>
              <span className="font-poppins text-[13px] font-semibold text-[#0DAB76]">Free</span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-merriweather text-[17px] font-extrabold text-[#02034a]">Total</span>
              <span className="font-merriweather text-[22px] font-extrabold text-[#02034a]">£{total.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#02034a] py-3.5 font-poppins text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(2,3,74,.25)] transition hover:bg-[#0077b6]"
            >
              Proceed to Checkout
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <button
              onClick={onClose}
              className="mt-2.5 w-full font-poppins text-[12px] text-[#6b7280] underline-offset-2 hover:text-[#02034a] hover:underline transition"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
