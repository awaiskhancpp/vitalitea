'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

const FREE_SHIPPING_MIN = 75

export default function CartPage() {
  const { items, ready, subtotal, setQuantity, removeItem, itemCount } = useCart()

  if (!ready) {
    return (
      <div className="min-h-[50vh] w-full bg-[#F5F1E8] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-[min(100%,100rem)] text-center font-['Host_Grotesk'] text-neutral-500">
          Loading cart…
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F1E8] px-4 py-10 sm:px-6 sm:py-12 lg:px-[6.94%]">
      <div className="mx-auto w-full max-w-[min(100%,100rem)]">
        <h1 className="font-['Cormorant_Garamond'] text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#3B3B3B]">
          Shopping bag
        </h1>

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
            {subtotal >= FREE_SHIPPING_MIN && (
              <div className="mt-6 flex items-center gap-2 rounded-lg border border-[#627E5C]/30 bg-white px-4 py-3 sm:px-5">
                <span className="text-[#627E5C]" aria-hidden>
                  <CheckIcon className="h-5 w-5 shrink-0" />
                </span>
                <p className="font-['Host_Grotesk'] text-sm font-medium text-[#4a6b45]">
                  You&apos;ve qualified for free delivery
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:items-start lg:gap-10 xl:gap-16">
              <div className="min-w-0 flex-1 space-y-4 lg:max-w-3xl">
                {items.map((line) => (
                  <article
                    key={line.id}
                    className="overflow-hidden rounded-xl border border-[#D1C9BE] bg-white p-4 sm:p-5"
                  >
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#e8e4dd] sm:h-28 sm:w-28">
                        <Image
                          src={line.imageUrl}
                          alt={line.imageAlt}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="font-['Host_Grotesk'] text-base font-semibold text-[#3B3B3B] sm:text-lg">
                            {line.name}
                          </h2>
                          <button
                            type="button"
                            onClick={() => removeItem(line.id)}
                            className="shrink-0 text-neutral-400 transition-colors hover:text-[#3B3B3B]"
                            aria-label={`Remove ${line.name}`}
                          >
                            <CloseIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 border-t border-[#E5E0D8] pt-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-['Host_Grotesk'] text-sm text-neutral-600">
                            <span className="text-neutral-500">Each</span>{' '}
                            <span className="text-[#3B3B3B]">${line.price.toFixed(2)}</span>
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <p className="font-['Host_Grotesk'] text-sm text-neutral-500">Quantity</p>
                          <div className="inline-flex items-stretch overflow-hidden rounded-md border border-[#D1C9BE]">
                            <button
                              type="button"
                              className="flex h-9 w-9 items-center justify-center font-['Host_Grotesk'] text-base text-[#3B3B3B] transition-colors hover:bg-[#F5F1E8]"
                              onClick={() => setQuantity(line.id, line.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="flex h-9 min-w-[2.25rem] items-center justify-center border-x border-[#D1C9BE] font-['Host_Grotesk'] text-sm text-[#3B3B3B]">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              className="flex h-9 w-9 items-center justify-center font-['Host_Grotesk'] text-base text-[#3B3B3B] transition-colors hover:bg-[#F5F1E8]"
                              onClick={() => setQuantity(line.id, line.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-[#E5E0D8] pt-3">
                          <span className="font-['Host_Grotesk'] text-sm font-semibold text-[#3B3B3B]">
                            Line total
                          </span>
                          <span className="font-['Martel_Sans'] text-base font-semibold text-[#3B3B3B]">
                            ${(line.price * line.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="w-full shrink-0 rounded-xl border border-[#D1C9BE] bg-white p-5 sm:p-6 lg:sticky lg:top-28 lg:max-w-md lg:flex-1">
                <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4 font-['Host_Grotesk'] text-sm text-[#3B3B3B]">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between font-['Host_Grotesk'] text-base font-bold text-[#3B3B3B]">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="mt-4 space-y-2 border-t border-[#E5E0D8] pt-4 text-xs text-neutral-500">
                  <p className="flex gap-2 font-['Host_Grotesk']">
                    <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
                    Shipping &amp; taxes calculated at checkout
                  </p>
                  <p className="flex gap-2 font-['Host_Grotesk']">
                    <TagIcon className="mt-0.5 h-4 w-4 shrink-0" />
                    Discount codes applied at checkout
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#F2EBE1] font-['Host_Grotesk'] text-sm font-bold text-[#3B3B3B] transition-opacity disabled:opacity-50"
                  disabled
                  title="Connect payments to enable checkout"
                >
                  Proceed to checkout
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                  <LockIcon className="h-3.5 w-3.5" />
                  <span className="font-['Host_Grotesk']">Secure checkout</span>
                </p>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8V4a4 4 0 00-8 0v4M4 8h16l1 12H3L4 8z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
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
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
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
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15a2 2 0 100-4 2 2 0 000 4zM5 9h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2zM8 7V5a4 4 0 118 0v2"
      />
    </svg>
  )
}
