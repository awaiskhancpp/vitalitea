'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const router = useRouter()
  const { items, ready, subtotal, setQuantity, removeItem, itemCount } = useCart()
  const freeShipAt = 75
  const qualifiesFreeDelivery = itemCount > 0 && subtotal >= freeShipAt
  const amountToFree = Math.max(0, freeShipAt - subtotal)

  if (!ready) {
    return (
      <div className="min-h-[50vh] w-full bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-[min(100%,100rem)] text-center font-['Host_Grotesk'] text-neutral-500">
          Loading cart…
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-[6.94%]">
      <div className="mx-auto w-full max-w-[min(100%,100rem)] pt-12 sm:pt-14">
        {itemCount > 0 && (
          <div className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
            <h1 className="font-['Cormorant_Garamond'] text-[clamp(1.875rem,4vw,2.75rem)] font-bold text-neutral-900">
              Shopping Bag
            </h1>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#627E5C] text-white opacity-90 transition-opacity hover:opacity-100"
              aria-label="Refresh"
            >
              <RefreshIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {itemCount === 0 && (
          <h1 className="mb-0 font-['Cormorant_Garamond'] text-[clamp(1.875rem,4vw,2.75rem)] font-bold text-neutral-900">
            Shopping Bag
          </h1>
        )}

        {itemCount === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center sm:mt-20">
            <div className="text-neutral-300">
              <BagOutline className="h-20 w-20" />
            </div>
            <p className="mt-6 font-['Host_Grotesk'] text-lg font-semibold text-[#3B3B3B]">
              Your bag is empty
            </p>
            <p className="mt-2 max-w-sm font-['Host_Grotesk'] text-sm text-neutral-600">
              Add some products to get started
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex h-12 min-w-[200px] items-center justify-center rounded-lg bg-[#F2EBE1] font-['Host_Grotesk'] text-sm font-semibold text-[#3B3B3B] transition-opacity hover:opacity-90"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            {itemCount > 0 && !qualifiesFreeDelivery && amountToFree > 0 && (
              <div
                className="mb-6 rounded-2xl bg-sky-50 px-4 py-3.5 text-center sm:mb-8 sm:px-5"
                role="status"
              >
                <p className="font-['Host_Grotesk'] text-sm font-medium text-sky-900 sm:text-base">
                  Add ${amountToFree.toFixed(2)} more for free shipping!
                </p>
              </div>
            )}
            {itemCount > 0 && qualifiesFreeDelivery && (
              <div
                className="mb-6 flex items-center gap-3 rounded-2xl bg-[#F0EDE4] px-4 py-3.5 sm:mb-8 sm:px-5"
                role="status"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#627E5C] text-white"
                  aria-hidden
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                <p className="font-['Host_Grotesk'] text-sm font-medium text-[#627E5C] sm:text-base">
                  You&apos;ve Qualified for Free Delivery
                </p>
              </div>
            )}

            <div className="mt-0 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
              <div className="min-w-0 flex-1 lg:max-w-[min(100%,46rem)] lg:flex-[1.1]">
                <ul className="divide-y divide-neutral-200">
                  {items.map((line) => {
                    const lineTotal = line.price * line.quantity
                    const canDecrease = line.quantity > 1
                    return (
                      <li key={line.id} className="py-5 first:pt-0 sm:py-6">
                        <article className="rounded-2xl bg-[#F5F2ED] p-4 sm:p-5">
                          <div className="flex gap-3 sm:gap-5">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#e8e4dd] sm:h-28 sm:w-28">
                              <Image
                                src={line.imageUrl}
                                alt={line.imageAlt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 96px, 112px"
                              />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col justify-center">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <h2 className="line-clamp-2 font-['Cormorant_Garamond'] text-base font-bold leading-tight text-neutral-900 sm:text-lg">
                                    {line.name}
                                  </h2>
                                  {line.variantLabel && (
                                    <p className="mt-1 font-['Host_Grotesk'] text-sm text-neutral-500">
                                      {line.variantLabel}
                                    </p>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(line.id)}
                                  className="shrink-0 p-0.5 text-red-500 transition-colors hover:text-red-600"
                                  aria-label={`Remove ${line.name}`}
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>

                              <div className="mt-3 flex min-w-0 flex-row items-center justify-between gap-2 sm:mt-4">
                                <div className="inline-flex shrink-0 items-stretch overflow-hidden rounded-md border border-neutral-200 bg-white">
                                  <button
                                    type="button"
                                    disabled={!canDecrease}
                                    onClick={() =>
                                      canDecrease && setQuantity(line.id, line.quantity - 1)
                                    }
                                    className="flex h-9 w-8 items-center bg-[#F5F2ED] justify-center font-['Host_Grotesk'] text-base text-neutral-900 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-white"
                                    aria-label="Decrease quantity"
                                  >
                                    −
                                  </button>
                                  <span className="flex h-9 min-w-[2.5rem] bg-[#F5F2ED] items-center justify-center border-x border-neutral-200 px-1 font-['Host_Grotesk'] text-sm font-medium text-neutral-900">
                                    {line.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="flex h-9 w-8 items-center bg-[#F5F2ED] justify-center font-['Host_Grotesk'] text-base text-neutral-900 transition-colors hover:bg-neutral-50"
                                    onClick={() => setQuantity(line.id, line.quantity + 1)}
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                                <p className="shrink-0 pl-1 text-right font-['Host_Grotesk'] text-base font-semibold text-neutral-900 sm:text-lg">
                                  ${lineTotal.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </article>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <aside className="w-full shrink-0 rounded-2xl bg-[#F5F2ED] p-5 sm:p-6 lg:sticky lg:top-28 lg:max-w-md lg:min-w-[18rem] lg:flex-1">
                <div className="flex items-baseline justify-between gap-2 border-b border-neutral-200 pb-4">
                  <span className="font-['Host_Grotesk'] text-sm text-neutral-800 sm:text-base">
                    Subtotal
                  </span>
                  <span className="font-['Host_Grotesk'] text-2xl font-bold text-neutral-900 sm:text-3xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs text-neutral-500 sm:mt-5 sm:text-sm">
                  <p className="flex items-start gap-2 font-['Host_Grotesk'] leading-relaxed">
                    <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                    Shipping &amp; taxes calculated at checkout
                  </p>
                  <p className="flex items-start gap-2 font-['Host_Grotesk'] leading-relaxed">
                    <TagIcon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                    Discount codes applied at checkout
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#627E5C] py-3.5 font-['Host_Grotesk'] text-sm font-bold text-white transition-opacity hover:opacity-90 sm:mt-7"
                >
                  Proceed to Checkout
                </Link>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-neutral-500 sm:mt-4">
                  <LockIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-['Host_Grotesk']">Secure Checkout</span>
                </p>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

function BagOutline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 8V4a4 4 0 00-8 0v4M4 8h16l1 12H3L4 8z"
      />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
      />
    </svg>
  )
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 7h.01M4 4h6l11 11a2.828 2.828 0 01-4 4L4 8V4h3zM8 6h.01"
      />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15a2 2 0 100-4 2 2 0 000 4zM5 9h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2zM8 7V5a4 4 0 118 0v2"
      />
    </svg>
  )
}
