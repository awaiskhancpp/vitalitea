'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

const overlayBase = 'fixed inset-0 z-[100] bg-black/50'
const panelBase =
  'fixed right-0 top-0 z-[101] flex h-full w-full max-w-[420px] flex-col bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.12)]'
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
        <header className="flex shrink-0 items-center justify-between border-b border-[#E5E0D8] px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="text-[#3B3B3B]">
              <BagIcon className="h-5 w-5" small />
            </span>
            <h2 className="truncate font-['Host_Grotesk'] text-base font-semibold text-[#3B3B3B]">
              Shopping Bag ({itemCount})
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {itemCount > 0 && (
              <button
                type="button"
                onClick={clear}
                className="shrink-0 font-['Host_Grotesk'] text-sm font-medium text-neutral-500 transition-colors hover:text-[#3B3B3B]"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={closeCartDrawer}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#3B3B3B] transition-colors hover:bg-[#F5F1E8]"
              aria-label="Close shopping bag"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        {itemCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 pb-16 pt-4 text-center">
            <div className="text-neutral-300">
              <BagIcon className="h-20 w-20" />
            </div>
            <p className="font-['Host_Grotesk'] text-lg font-semibold text-[#3B3B3B]">
              Your bag is empty
            </p>
            <p className="max-w-xs font-['Host_Grotesk'] text-sm text-neutral-500">
              Add some products to get started
            </p>
            <Link
              href="/shop"
              onClick={closeCartDrawer}
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-[#3B3B3B] px-8 font-['Host_Grotesk'] text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Shop now
            </Link>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-4">
              <ul className="space-y-4">
                {items.map((line) => (
                  <li
                    key={line.id}
                    className="flex gap-3 rounded-xl border border-[#E5E0D8] bg-[#FFFCF6] p-3"
                  >
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-[#e8e4dd]">
                      <Image
                        src={line.imageUrl}
                        alt={line.imageAlt}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 font-['Host_Grotesk'] text-sm font-medium text-[#3B3B3B]">
                          {line.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(line.id)}
                          className="shrink-0 p-0.5 text-neutral-400 transition-colors hover:text-[#3B3B3B]"
                          aria-label={`Remove ${line.name}`}
                        >
                          <CloseIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-0.5 font-['Martel_Sans'] text-sm text-[#6F5845]">
                        ${line.price.toFixed(2)} each
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-stretch overflow-hidden rounded-md border border-[#D1C9BE]">
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center font-['Host_Grotesk'] text-base text-[#3B3B3B] transition-colors hover:bg-[#F5F1E8]"
                            onClick={() => setQuantity(line.id, line.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="flex h-8 min-w-8 items-center justify-center border-x border-[#D1C9BE] font-['Host_Grotesk'] text-sm text-[#3B3B3B]">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center font-['Host_Grotesk'] text-base text-[#3B3B3B] transition-colors hover:bg-[#F5F1E8]"
                            onClick={() => setQuantity(line.id, line.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="shrink-0 font-['Martel_Sans'] text-sm font-semibold text-[#3B3B3B]">
                          ${(line.price * line.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 border-t border-[#E5E0D8] bg-white px-5 py-4">
              <div className="mb-3 flex items-center justify-between font-['Host_Grotesk'] text-sm text-[#3B3B3B]">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="mb-1 flex items-center justify-between font-['Host_Grotesk'] text-sm font-semibold text-[#3B3B3B]">
                <span>Total</span>
                <span className="text-base">${subtotal.toFixed(2)}</span>
              </div>
              <p className="mb-4 font-['Host_Grotesk'] text-xs text-neutral-500">
                Shipping and taxes are calculated at checkout.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <Link
                  href="/bag"
                  onClick={closeCartDrawer}
                  className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#A3A3A3] bg-transparent font-['Host_Grotesk'] text-sm font-medium text-[#3B3B3B] transition-colors hover:bg-[#F5F1E8]"
                >
                  View bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCartDrawer}
                  className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#627E5C] font-['Host_Grotesk'] text-sm font-semibold text-white transition-opacity hover:opacity-90"
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
