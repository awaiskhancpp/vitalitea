'use client'

import Image from 'next/image'
import type { CartItem } from '@/contexts/CartContext'
import { couponInputClass } from '@/components/checkout/form-classes'
import { LockIcon, ReturnsIcon } from '@/components/checkout/CheckoutIcons'

export type OrderSummaryLine = Pick<
  CartItem,
  'id' | 'name' | 'price' | 'quantity' | 'imageUrl' | 'imageAlt' | 'variantLabel'
>

export function OrderSummaryBlock({
  items,
  subtotal,
  discount = 0,
  shippingCost,
  orderTotal,
  freeShipAt,
  shippingHint = '',
  couponInput,
  onCouponInputChange,
  onApplyCoupon,
  quoteError,
  isSidebar,
}: {
  items: OrderSummaryLine[]
  subtotal: number
  discount?: number
  shippingCost: number
  orderTotal: number
  freeShipAt: number
  shippingHint?: string
  couponInput: string
  onCouponInputChange: (v: string) => void
  onApplyCoupon: () => void
  quoteError: string | null
  isSidebar?: boolean
}) {
  const amountToFree = Math.max(0, freeShipAt - subtotal)

  return (
    <aside
      className={`rounded-2xl border border-neutral-200/90 bg-white  p-5 sm:p-6 ${isSidebar ? 'shadow-sm' : ''}`}
    >
      <h2 className="border-b border-neutral-200 pb-3 font-['Cormorant_Garamond'] text-[1.35rem] font-bold leading-tight text-neutral-900">
        Order Summary
      </h2>
      <ul className="mt-4 max-h-[min(50vh,28rem)] pt-5 space-y-4 overflow-y-auto pr-1">
        {items.map((line) => {
          const lineTotal = line.price * line.quantity
          return (
            <li key={line.id} className="flex gap-3 sm:gap-4">
              <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-visible rounded-lg bg-[#e8e4dd] sm:h-20 sm:w-20">
                <Image
                  src={line.imageUrl}
                  alt={line.imageAlt}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#627E5C] px-1 text-[11px] font-bold text-white">
                  {line.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-['Host_Grotesk'] text-sm font-bold leading-tight text-neutral-900 sm:text-base">
                  {line.name}
                </h3>
                {line.variantLabel && (
                  <p className="mt-0.5 font-['Host_Grotesk'] text-xs text-neutral-500 sm:text-sm">
                    {line.variantLabel}
                  </p>
                )}
                <p className="mt-1 font-['Host_Grotesk'] text-sm font-bold text-neutral-900">
                  ${lineTotal.toFixed(2)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-5 space-y-2.5 border-t border-neutral-200 pt-4">
        <div className="flex items-center justify-between font-['Host_Grotesk'] text-sm text-neutral-800">
          <span>Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between font-['Host_Grotesk'] text-sm text-[#627E5C]">
            <span>Discount</span>
            <span className="font-semibold">−${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-start justify-between gap-3 font-['Host_Grotesk'] text-sm text-neutral-800">
          <div className="min-w-0">
            <span>Shipping</span>
            {shippingHint ? (
              <p className="mt-0.5 text-xs font-normal text-neutral-500">{shippingHint}</p>
            ) : null}
          </div>
          <span
            className={`shrink-0 font-semibold ${shippingCost > 0 ? 'text-[#627E5C]' : 'text-neutral-800'}`}
          >
            {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-baseline justify-between border-t border-neutral-200 pt-2.5 font-['Host_Grotesk'] font-bold text-neutral-900">
          <span className="text-lg">Total</span>
          <span className="text-xl">${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-1.5 font-['Host_Grotesk'] text-sm font-semibold text-neutral-600">
          Coupon Code
        </p>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <input
            value={couponInput}
            onChange={(e) => onCouponInputChange(e.target.value)}
            className={couponInputClass}
            placeholder="Enter coupon code"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            className="shrink-0 rounded-full bg-[#627E5C] px-6 py-2.5 font-['Host_Grotesk'] text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Apply
          </button>
        </div>
        {quoteError && <p className="mt-2 text-sm text-amber-800">{quoteError}</p>}
      </div>

      {amountToFree > 0 && (
        <p className="mt-4 rounded-lg border border-sky-200/80 bg-sky-50 px-3 py-2.5 text-center text-sm font-medium text-sky-900">
          Add ${amountToFree.toFixed(2)} more for free shipping!
        </p>
      )}

      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex gap-2">
            <LockIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#627E5C]" />
            <div>
              <p className="font-['Host_Grotesk'] text-sm font-bold text-neutral-900">
                Secure Payment
              </p>
              <p className="mt-0.5 font-['Host_Grotesk'] text-xs text-neutral-600">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex gap-2">
            <ReturnsIcon className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
            <div>
              <p className="font-['Host_Grotesk'] text-sm font-bold text-neutral-900">
                30-Day Returns
              </p>
              <p className="mt-0.5 font-['Host_Grotesk'] text-xs text-neutral-600">
                Easy returns and exchanges within 30 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
