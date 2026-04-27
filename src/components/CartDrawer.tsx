'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

const overlayBase = 'fixed inset-0 z-[100] bg-black/50'
const panelBase =
  'fixed right-0 top-0 z-[101] flex h-full w-full max-w-[min(100vw,440px)] flex-col bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.12)] sm:max-w-[440px]'
const overlayMotion = 'transition-opacity duration-300 ease-out motion-reduce:transition-none'
const panelMotion =
  'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none will-change-transform'

export default function CartDrawer() {
  const {
    items,
    ready,
    subtotal,
    itemCount,
    setQuantity,
    removeItem,
    clear,
    drawerOpen,
    closeCartDrawer,
  } = useCart()

  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCartDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen, closeCartDrawer])

  if (!ready) return null

  return (
    <>
      <div
        className={`${overlayBase} ${overlayMotion} ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCartDrawer}
        aria-hidden={!drawerOpen}
      />
      <aside
        className={`${panelBase} ${panelMotion} ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        aria-label="Shopping bag"
        id="cart-drawer"
        role="dialog"
        aria-modal={drawerOpen}
        aria-hidden={!drawerOpen}
        inert={drawerOpen ? undefined : true}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 text-neutral-800" aria-hidden>
              <BagIcon className="h-5 w-5" small />
            </span>
            <h2 className="truncate font-['Cormorant_Garamond'] text-xl font-bold leading-none text-neutral-900">
              Shopping Bag ({itemCount})
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-4">
            {itemCount > 0 && (
              <button
                type="button"
                onClick={clear}
                className="font-['Host_Grotesk'] text-sm font-medium text-slate-500 transition-colors hover:text-neutral-900"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={closeCartDrawer}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-800 transition-colors hover:bg-[#F5F1E8]"
              aria-label="Close shopping bag"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        {itemCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-16 pt-4 text-center sm:px-8">
            <div className="text-neutral-300">
              <BagIcon className="h-20 w-20" />
            </div>
            <p className="font-['Cormorant_Garamond'] text-lg font-bold text-gray-900">
              Your bag is empty
            </p>
            <p className="max-w-xs font-['Host_Grotesk'] text-sm text-gray-500">
              Add some products to get started
            </p>
            <Link
              href="/shop"
              onClick={closeCartDrawer}
              className="mt-2 inline-flex min-h-11 min-w-[8rem] items-center justify-center rounded-lg bg-gray-900 px-8 font-['Host_Grotesk'] text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Shop now
            </Link>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
              <ul className="flex flex-col gap-4 sm:gap-5">
                {items.map((line) => {
                  const lineTotal = line.price * line.quantity
                  const canDecrease = line.quantity > 1
                  return (
                    <li
                      key={line.id}
                      className="relative overflow-visible rounded-2xl bg-[#F5F1E8] p-4 sm:p-5"
                    >
                      <button
                        type="button"
                        onClick={() => removeItem(line.id)}
                        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-white/50 hover:text-red-600 sm:right-4 sm:top-4"
                        aria-label={`Remove ${line.name}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>

                      <div className="flex gap-3.5 pr-7 sm:gap-4 sm:pr-9">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#e8e4dd] sm:h-24 sm:w-24">
                          <Image
                            src={line.imageUrl}
                            alt={line.imageAlt}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <div className="min-w-0 flex-1 pr-0.5">
                          <h3 className="line-clamp-2 font-['Cormorant_Garamond'] text-[1.05rem] font-bold leading-tight text-neutral-900 sm:text-lg sm:leading-snug">
                            {line.name}
                          </h3>
                          {line.variantLabel && (
                            <p className="mt-1 font-['Host_Grotesk'] text-sm text-neutral-500">
                              {line.variantLabel}
                            </p>
                          )}

                          <div className="mt-3 flex w-full min-w-0 flex-row items-center justify-between gap-2 sm:mt-4 sm:gap-3">
                            <div className="inline-flex shrink-0 items-stretch overflow-hidden rounded-md border border-neutral-200/90 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                              <button
                                type="button"
                                disabled={!canDecrease}
                                onClick={() =>
                                  canDecrease && setQuantity(line.id, line.quantity - 1)
                                }
                                className="flex h-9 w-8 items-center justify-center font-['Host_Grotesk'] text-base text-neutral-800 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-white"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="flex h-9 min-w-[2.5rem] items-center justify-center border-x border-neutral-200 px-1 font-['Host_Grotesk'] text-sm font-medium text-neutral-900">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                className="flex h-9 w-8 items-center justify-center font-['Host_Grotesk'] text-base text-neutral-800 transition-colors hover:bg-neutral-50"
                                onClick={() => setQuantity(line.id, line.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <p className="shrink-0 text-right font-['Host_Grotesk'] text-base text-neutral-900 ">
                              ${lineTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="shrink-0 space-y-3 border-t border-gray-100 bg-white px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between font-['Host_Grotesk'] text-sm text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-['Host_Grotesk'] text-base font-bold text-neutral-900">
                  Total
                </span>
                <span className="font-['Host_Grotesk'] text-lg font-bold text-neutral-900 sm:text-xl">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                <Link
                  href="/bag"
                  onClick={closeCartDrawer}
                  className="flex h-12 min-h-12 w-full min-w-0 flex-1 items-center justify-center rounded-full bg-[#F5F1E8] font-['Host_Grotesk'] text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCartDrawer}
                  className="flex h-12 min-h-12 w-full min-w-0 flex-1 items-center justify-center rounded-full bg-[#6b7c5c] font-['Host_Grotesk'] text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

function BagIcon({ className, small }: { className?: string; small?: boolean }) {
  if (small) {
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
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m19.5 0H4.5L3 20.25h18L20.25 10.5z"
        />
      </svg>
    )
  }
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
