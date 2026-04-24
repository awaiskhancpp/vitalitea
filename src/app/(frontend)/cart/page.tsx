'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

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
    <div className="min-h-screen w-full bg-[#F5F1E8] px-4 py-12 sm:px-6 sm:py-16 lg:px-[6.94%]">
      <div className="mx-auto w-full max-w-[min(100%,100rem)]">
        <h1 className="font-['Cormorant_Garamond'] text-[clamp(2rem,4vw,3rem)] font-bold text-[#3B3B3B]">
          Your bag
        </h1>
        <p className="mt-2 font-['Host_Grotesk'] text-sm text-neutral-600">
          {itemCount === 0
            ? 'Your bag is empty.'
            : `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
        </p>

        {items.length === 0 ? (
          <div className="mt-12">
            <Link
              href="/shop"
              className="inline-flex rounded-full bg-[#627E5C] px-8 py-3 font-['Host_Grotesk'] text-white transition-opacity hover:opacity-90"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-6">
            {items.map((line) => (
              <li
                key={line.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#A3A3A3]/40 bg-white/60 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#f0ebe3]">
                  <Image
                    src={line.imageUrl}
                    alt={line.imageAlt}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-['Cormorant_Garamond'] text-xl font-bold text-[#3B3B3B]">
                    {line.name}
                  </p>
                  <p className="mt-1 font-['Martel_Sans'] text-sm text-neutral-600">
                    ${line.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <label className="flex items-center gap-2 font-['Host_Grotesk'] text-sm text-neutral-700">
                    Qty
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={line.quantity}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10)
                        if (!Number.isNaN(v)) setQuantity(line.id, v)
                      }}
                      className="w-16 rounded-lg border border-neutral-300 bg-white px-2 py-1 text-center"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(line.id)}
                    className="font-['Host_Grotesk'] text-sm text-red-700 underline-offset-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <p className="font-['Martel_Sans'] text-lg font-semibold text-[#3B3B3B] sm:w-24 sm:text-right">
                  ${(line.price * line.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="mt-10 border-t border-[#A3A3A3]/40 pt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#3B3B3B]">
                Subtotal <span className="text-[#627E5C]">${subtotal.toFixed(2)}</span>
              </p>
              <button
                type="button"
                className="rounded-full bg-[#627E5C] px-10 py-3 font-['Host_Grotesk'] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                disabled
                title="Checkout is not connected yet"
              >
                Checkout
              </button>
            </div>
            <p className="mt-2 font-['Host_Grotesk'] text-xs text-neutral-500">
              Checkout integration can be added when you connect payments.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
