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
    <div className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[4px_4px_10px_0px_rgba(0,0,0,0.12)]">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-t-[20px] bg-[#e8e4dd]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="object-cover object-center"
          fill
          sizes="(min-width: 1024px) min(28vw, 400px), (min-width: 640px) 45vw, 100vw"
        />
      </div>

      <div className="flex min-h-52 flex-1 flex-col rounded-b-[20px] bg-[linear-gradient(180deg,rgba(24,23,23,0.2)_0%,rgba(84,101,125,0.16)_51.92%,rgba(102,102,102,0.2)_66.35%),linear-gradient(0deg,#627E5C,#627E5C)] px-4 pb-4 pt-4 sm:px-5">
        <h3
          className="line-clamp-2 min-w-0 shrink-0 font-['Cormorant_Garamond'] font-bold leading-tight text-white"
          style={{ fontSize: 'clamp(1.25rem, 2.08vw, 1.875rem)' }}
        >
          {name}
        </h3>
        <p
          className="mt-1.5 pb-1line-clamp-2 min-w-0 shrink-0 font-['Martel_Sans'] font-normal leading-[1.3] text-white/70"
          style={{ fontSize: 'clamp(0.8125rem, 0.97vw, 0.875rem)' }}
        >
          {description}
        </p>
        <div className=" flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-2 mt-6 sm:mt-4">
          <span
            className="font-['Martel_Sans'] text-white"
            style={{ fontSize: 'clamp(0.875rem, 1.11vw, 1rem)' }}
          >
            ${Number(price).toFixed(2)}
          </span>
          <Link
            href={`/shop/${encodeURIComponent(slug)}`}
            className="shrink-0 rounded-full border border-[#DADADA] font-['Martel_Sans'] font-normal text-white transition-colors hover:bg-white/10"
            style={{ fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)', padding: '0.2rem 0.75rem' }}
          >
            Select Options
          </Link>
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={isAdding}
          aria-busy={isAdding}
          aria-label={isAdding ? 'Adding to bag' : 'Add to bag'}
          className="mt-3 flex min-h-11 w-full min-w-0 shrink-0 items-center justify-center gap-2.5 rounded-full bg-[#F5F1E8] px-4 py-2.5 font-['Martel_Sans'] font-semibold leading-none text-[#3B3B3B] transition-opacity enabled:hover:opacity-90 disabled:cursor-wait disabled:opacity-100"
          style={{ fontSize: 'clamp(0.875rem,1.11vw,1rem)' }}
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
