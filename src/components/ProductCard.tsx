'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  id: string | number
  name: string
  description: string
  price: number
  slug: string
  image?: { url: string; alt: string } | null
  fallbackImage?: string
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  slug,
  image,
  fallbackImage = '/product-black-velvet.png',
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const addInFlight = useRef(false)

  const raw = typeof image?.url === 'string' ? image.url.trim() : ''
  const normalized = !raw
    ? fallbackImage
    : raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')
      ? raw
      : `/${raw}`
  const imageSrc = normalized || fallbackImage
  const imageAlt = image?.alt ?? name

  const addToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (addInFlight.current) return
      addInFlight.current = true
      setIsAdding(true)
      try {
        // Minimum time so the in-button loading state is visible (e‑commerce style “processing”)
        const minDisplay = new Promise((r) => setTimeout(r, 520))
        const line = {
          id: String(id),
          slug,
          name,
          price: Number(price),
          imageUrl: imageSrc,
          imageAlt,
        }
        await minDisplay
        addItem(line)
      } finally {
        addInFlight.current = false
        setIsAdding(false)
      }
    },
    [addItem, id, slug, name, price, imageSrc, imageAlt],
  )

  return (
    /* No overflow-hidden here — shadow renders freely without clipping the image */
    <div className="w-full max-w-[400px] rounded-[20px] overflow-hidden">
      {/* Image — overflow-hidden + top radius here only, so image fills 400×352 fully */}
      <div className="relative w-full aspect-[400/352]">
        <Image src={imageSrc} alt={imageAlt} className="object-cover object-center" fill />
      </div>

      {/* Content — 216px tall, green gradient, bottom radius */}
      <div className="flex h-54 flex-col bg-[linear-gradient(180deg,rgba(24,23,23,0.2)_0%,rgba(84,101,125,0.16)_51.92%,rgba(102,102,102,0.2)_66.35%),linear-gradient(0deg,#627E5C,#627E5C)] px-5 pb-4 pt-4">
        {/* Name */}
        <h3 className="line-clamp-2 font-['Cormorant_Garamond'] text-[30px] font-bold leading-none text-white">
          {name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 font-['Martel_Sans'] text-[14px] font-normal leading-[1.3] tracking-normal text-white/70">
          {description}
        </p>

        {/* Price + Select Options */}
        <div className="mt-6.25 flex items-center justify-between">
          <span className="font-['Martel_Sans'] text-[16px] text-white">
            ${Number(price).toFixed(2)}
          </span>

          <Link
            href={`/shop/${encodeURIComponent(slug)}`}
            className="rounded-full border border-[#DADADA] px-3.75 py-0.75 font-['Martel_Sans'] text-[14px] font-normal text-white transition-colors hover:bg-white/10"
          >
            Select Options
          </Link>
        </div>

        {/* Add to bag */}
        <button
          type="button"
          onClick={addToCart}
          disabled={isAdding}
          aria-busy={isAdding}
          aria-label={isAdding ? 'Adding to bag' : 'Add to bag'}
          className="mt-auto flex h-11.75 w-full shrink-0 items-center justify-center gap-2.5 rounded-full bg-[#F5F1E8] px-4 py-px font-['Martel_Sans'] text-[16px] font-semibold leading-none text-[#3B3B3B] transition-opacity enabled:hover:opacity-90 disabled:cursor-wait disabled:opacity-100"
        >
          {isAdding && (
            <span
              className="inline-block size-5 shrink-0 animate-spin rounded-full border-2 border-[#3B3B3B]/25 border-t-[#627E5C]"
              aria-hidden
            />
          )}
          <span className="truncate">{isAdding ? 'Adding…' : 'Add to bag'}</span>
        </button>
      </div>
    </div>
  )
}
