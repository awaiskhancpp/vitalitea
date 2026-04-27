'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  id: string | number
  name: string
  description: string
  price: number
  slug: string
  image?: { url: string; alt: string } | null
  fallbackImage?: string
  variantLabel?: string
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  slug,
  image,
  fallbackImage = '/product-black-velvet.png',
  variantLabel,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showAdded, setShowAdded] = useState(false)
  const addInFlight = useRef(false)

  useEffect(() => {
    if (!showAdded) return
    const t = setTimeout(() => setShowAdded(false), 3200)
    return () => clearTimeout(t)
  }, [showAdded])

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
        await new Promise((r) => setTimeout(r, 520))
        addItem({
          id: String(id),
          slug,
          name,
          price: Number(price),
          imageUrl: imageSrc,
          imageAlt,
          ...(variantLabel ? { variantLabel } : {}),
        })
        setShowAdded(true)
      } finally {
        addInFlight.current = false
        setIsAdding(false)
      }
    },
    [addItem, id, slug, name, price, imageSrc, imageAlt, variantLabel],
  )

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[20px] shadow-[4px_4px_10px_0px_#0000001F]">
      {/* ── IMAGE — Figma: 400×352, ratio = 400/352 ── */}
      <div
        className="relative w-full shrink-0 overflow-hidden rounded-t-[20px] bg-[#e8e4dd]"
        style={{ aspectRatio: '400 / 352' }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
        />
      </div>

      {/* ── GREEN SECTION — Figma: 400×216, ratio = 400/216 ── */}
      {/* aspectRatio maintains the 400:216 proportion at any card width   */}
      {/* flex-col + justify-between spaces name/desc away from price/btn  */}
      <div
        className="flex w-full min-w-0 flex-col justify-between rounded-b-[20px] px-5 py-4 bg-red-500 shadow-[4px_4px_10px_0px_#0000001F]"
        style={{
          aspectRatio: '400 / 216',
          background:
            'linear-gradient(180deg, rgba(24,23,23,0.2) 0%, rgba(84,101,125,0.16) 51.92%, rgba(102,102,102,0.2) 66.35%), linear-gradient(0deg, #627E5C, #627E5C)',
        }}
      >
        {/* Top: name + description */}
        <div className="min-w-0">
          <h3
            className="line-clamp-1 font-['Cormorant_Garamond'] font-bold leading-tight text-white"
            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.875rem)' }}
          >
            {name}
          </h3>
          <p
            className="mt-1 line-clamp-2 font-['Martel_Sans'] font-normal leading-snug text-white/70"
            style={{ fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)' }}
          >
            {description}
          </p>
        </div>

        {/* Bottom: price row + button */}
        <div className="min-w-0">
          {/* Price + Select Options */}
          <div className="flex min-w-0 items-center justify-between gap-2">
            <span
              className="font-['Martel_Sans'] font-bold text-white"
              style={{ fontSize: 'clamp(0.875rem, 1vw, 1rem)' }}
            >
              ${Number(price).toFixed(2)}
            </span>
            <Link
              href={`/shop/${encodeURIComponent(slug)}`}
              className="shrink-0 rounded-full border border-white/80 font-['Martel_Sans'] text-white transition-colors hover:bg-white/10"
              style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.875rem)', padding: '0.2rem 0.85rem' }}
            >
              Select Options
            </Link>
          </div>

          {/* Add to bag */}
          <button
            type="button"
            onClick={addToCart}
            disabled={isAdding || showAdded}
            aria-busy={isAdding}
            className={`mt-2 flex w-full min-w-0 items-center justify-center gap-2 rounded-full bg-[#F3EFE0] font-['Martel_Sans'] font-semibold leading-none text-[#3B3B3B] transition-opacity enabled:hover:opacity-90 ${
              isAdding ? 'cursor-wait' : 'cursor-pointer'
            }`}
            style={{
              fontSize: 'clamp(0.8rem, 1vw, 1rem)',
              padding: 'clamp(0.5rem, 0.8vw, 0.7rem) 1rem',
            }}
          >
            {isAdding && (
              <span className="inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-[#3B3B3B]/25 border-t-[#627E5C]" />
            )}
            <span className="truncate">
              {isAdding ? 'Adding…' : showAdded ? '✓ Added to Bag' : 'Add to bag'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
