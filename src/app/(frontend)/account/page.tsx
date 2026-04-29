'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { useImageUpload } from '@/hooks/useImageUpload'

type OrderRow = {
  id: string | number
  orderNumber?: string | null
  status?: string | null
  total?: number | null
  createdAt?: string | null
}

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function formatStatus(raw: string) {
  return raw.replace(/_/g, ' ')
}

export default function AccountOrdersPage() {
  const router = useRouter()
  const { customer, loading, logout } = useCustomerAuth()
  const blobInputRef = useRef<HTMLInputElement>(null)
  const { url: blobUrl, error: blobErr, uploading: blobBusy, upload } = useImageUpload()
  const [orders, setOrders] = useState<OrderRow[] | null>(null)
  const [loadErr, setLoadErr] = useState<string | null>(null)

  useEffect(() => {
    if (loading) return
    if (!customer) {
      router.replace('/login?next=/account')
    }
  }, [loading, customer, router])

  useEffect(() => {
    if (!customer) return
    let cancelled = false
    ;(async () => {
      setLoadErr(null)
      try {
        const res = await fetch('/api/orders?limit=50&depth=0&sort=-createdAt', {
          credentials: 'include',
        })
        if (res.status === 401 || res.status === 403) {
          await logout()
          router.replace('/login?next=/account')
          return
        }
        if (!res.ok) {
          setLoadErr('Could not load orders')
          setOrders([])
          return
        }
        const json = (await res.json()) as { docs?: OrderRow[] }
        if (!cancelled) setOrders(Array.isArray(json.docs) ? json.docs : [])
      } catch {
        if (!cancelled) setLoadErr('Could not load orders')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [customer, logout, router])

  if (!loading && !customer) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] w-full bg-white pt-28 pb-20">
      <div className="app-container w-full max-w-3xl">
        <h1
          className="font-['Cormorant_Garamond'] font-bold text-black"
          style={{ fontSize: 'clamp(1.75rem,4vw,2.25rem)' }}
        >
          Your orders
        </h1>
        <p className="mt-2 font-['Host_Grotesk'] text-[#737373]">
          Signed in as {customer?.email}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={async () => {
              await logout()
              router.replace('/login')
            }}
            className="rounded-full border border-[#D4D4D4] px-5 py-2 font-['Martel_Sans'] text-sm text-black hover:bg-[#F5F5F5]"
          >
            Sign out
          </button>
          <Link
            href="/shop"
            className="inline-flex rounded-full bg-[#627E5C] px-5 py-2 font-['Martel_Sans'] text-sm font-semibold text-white hover:opacity-95"
          >
            Continue shopping
          </Link>
        </div>

        <section aria-label="Image upload (Vercel Blob)" className="mt-12 border-t border-[#ECECEC] pt-10">
          <h2 className="font-['Cormorant_Garamond'] text-xl font-bold text-black">Photo upload</h2>
          <p className="mt-1 font-['Host_Grotesk'] text-sm text-[#737373]">
            Store images uploaded here live in Blob (not Payload /api/media).
          </p>
          <div className="mt-4">
            <input
              ref={blobInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              tabIndex={-1}
              disabled={blobBusy || !customer}
              onChange={async (ev) => {
                const f = ev.target.files?.[0]
                if (!f) return
                await upload(f)
                ev.target.value = ''
              }}
            />
            <button
              type="button"
              disabled={blobBusy || !customer}
              onClick={() => blobInputRef.current?.click()}
              className="rounded-full bg-[#627E5C] px-5 py-2 font-['Martel_Sans'] text-sm font-semibold text-white disabled:opacity-60"
            >
              {blobBusy ? 'Uploading…' : 'Upload image'}
            </button>
          </div>
          {blobErr ? (
            <p className="mt-3 font-['Host_Grotesk'] text-sm text-red-600" role="alert">
              {blobErr}
            </p>
          ) : null}
          {blobUrl ? (
            <div className="mt-4">
              <p className="mb-2 break-all font-['Martel_Sans'] text-xs text-[#737373]">{blobUrl}</p>
              {/* eslint-disable-next-line @next/next/no-img-element -- Blob CDN URL */}
              <img src={blobUrl} alt="" className="h-40 max-w-full rounded-lg object-cover" />
            </div>
          ) : null}
        </section>

        {loading ? (
          <p className="mt-10 font-['Host_Grotesk'] text-[#737373]">Loading…</p>
        ) : null}

        {!loading && orders && orders.length === 0 ? (
          <p className="mt-10 font-['Host_Grotesk'] text-[#737373]">
            No orders yet.{loadErr ? ` ${loadErr}` : ''}
          </p>
        ) : null}

        {!loading && orders && orders.length > 0 ? (
          <div className="mt-10 overflow-hidden rounded-2xl border border-[#E5E5E5]">
            <table className="w-full border-collapse text-left font-['Martel_Sans'] text-sm">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                  <th className="px-4 py-3 font-semibold text-black">Order</th>
                  <th className="px-4 py-3 font-semibold text-black">Date</th>
                  <th className="px-4 py-3 font-semibold text-black">Status</th>
                  <th className="px-4 py-3 font-semibold text-black">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={String(o.id)} className="border-b border-[#F0F0F0] last:border-0">
                    <td className="px-4 py-3 text-black">{o.orderNumber ?? o.id}</td>
                    <td className="px-4 py-3 text-[#525252]">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 capitalize text-[#525252]">
                      {o.status ? formatStatus(o.status) : '—'}
                    </td>
                    <td className="px-4 py-3 font-medium text-black">
                      {typeof o.total === 'number' ? formatMoney(o.total) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  )
}
