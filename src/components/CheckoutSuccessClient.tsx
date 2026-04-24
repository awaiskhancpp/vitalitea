'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { useCart } from '@/contexts/CartContext'

function Body() {
  const { clear } = useCart()
  const search = useSearchParams()
  const sessionId = search.get('session_id')
  const orderIdQ = search.get('orderId')
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = new URLSearchParams()
    if (sessionId) q.set('session_id', sessionId)
    if (orderIdQ) q.set('orderId', orderIdQ)
    if (!sessionId && !orderIdQ) {
      setLoading(false)
      setErr('No order information in link.')
      return
    }
    fetch(`/api/checkout/session-order?${q.toString()}`)
      .then(async (r) => {
        if (!r.ok) {
          const j = (await r.json().catch(() => ({}))) as { error?: string }
          throw new Error(j.error || 'Failed to load order')
        }
        return r.json() as Promise<{ orderNumber: string }>
      })
      .then((d) => {
        setOrderNumber(d.orderNumber)
        clear()
      })
      .catch((e: Error) => setErr(e.message))
      .finally(() => setLoading(false))
  }, [sessionId, orderIdQ, clear])

  if (loading) {
    return (
      <p className="text-center font-['Host_Grotesk'] text-neutral-500">Loading your confirmation…</p>
    )
  }
  if (err) {
    return (
      <div className="text-center">
        <p className="font-['Host_Grotesk'] text-red-600">{err}</p>
        <Link href="/shop" className="mt-6 inline-block text-[#627E5C] underline">
          Back to shop
        </Link>
      </div>
    )
  }
  return (
    <>
      <h1 className="font-['Cormorant_Garamond'] text-3xl font-bold text-[#3B3B3B]">Thank you</h1>
      {orderNumber && (
        <p className="mt-3 font-['Host_Grotesk'] text-sm text-neutral-600">
          Order <span className="font-semibold text-[#3B3B3B]">{orderNumber}</span> is confirmed.
        </p>
      )}
      <p className="mt-2 font-['Host_Grotesk'] text-sm text-neutral-600">
        A confirmation will be sent to your email.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#627E5C] font-['Host_Grotesk'] text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Continue shopping
      </Link>
    </>
  )
}

export default function CheckoutSuccessClient() {
  return (
    <div className="min-h-screen w-full bg-[#F5F1E8] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-[#D1C9BE] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#627E5C]/12 text-[#627E5C]">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <Suspense fallback={<p className="mt-5 font-['Host_Grotesk'] text-neutral-500">Loading…</p>}>
          <div className="mt-5">
            <Body />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
