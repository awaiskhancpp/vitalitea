'use client'

export function CheckoutShippingMethodCard({
  title,
  eta,
  priceLabel,
}: {
  title: string
  eta: string
  priceLabel: string
}) {
  return (
    <section className="space-y-3">
      <h2 className="border-b border-neutral-200 pb-2 font-['Cormorant_Garamond'] text-lg font-bold text-neutral-900">
        Shipping Method <span className="text-red-600">*</span>
      </h2>
      <div
        className="flex items-start gap-3 rounded-2xl border-2 border-neutral-800 bg-white p-4"
        role="group"
        aria-label="Shipping method"
      >
        <span
          className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[#2563eb] bg-white"
          aria-hidden
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-['Host_Grotesk'] text-sm font-bold leading-snug text-[#3d4d5c] sm:text-[0.95rem]">
            {title}
          </p>
          <p className="mt-1 font-['Host_Grotesk'] text-xs text-neutral-500 sm:text-sm">{eta}</p>
        </div>
        <p className="shrink-0 font-['Host_Grotesk'] text-sm font-bold text-neutral-900 sm:text-base">
          {priceLabel}
        </p>
      </div>
    </section>
  )
}

export function CheckoutFreeShippingCallout({
  freeShippingMinUsd,
}: {
  /** Same threshold as cart quote / server (USD). */
  freeShippingMinUsd: number
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-3.5 sm:px-4">
      <svg
        className="h-6 w-6 shrink-0 text-amber-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M10 17h2M8 6h-3a1 1 0 0 0-1 1v8h1.5" />
        <path d="M8 6v5h3l2 2h3.5V9H13V6H8Z" />
        <path d="M3 15h.5A2.5 2.5 0 0 0 6 12.5V6" />
        <circle cx="7.5" cy="18.5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="18.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
      <div>
        <p className="font-['Host_Grotesk'] text-sm font-bold text-sky-900">Free shipping available!</p>
        <p className="mt-1 font-['Host_Grotesk'] text-xs leading-relaxed text-sky-900/90 sm:text-sm">
          Orders over ${freeShippingMinUsd.toFixed(2)} ship free on standard delivery where offered.
        </p>
      </div>
    </div>
  )
}
