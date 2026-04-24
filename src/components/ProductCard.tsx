'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback } from 'react'
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
  const { addItem, openCartDrawer } = useCart()

  const raw = typeof image?.url === 'string' ? image.url.trim() : ''
  const normalized = !raw
    ? fallbackImage
    : raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')
      ? raw
      : `/${raw}`
  const imageSrc = normalized || fallbackImage
  const imageAlt = image?.alt ?? name

  const addToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      addItem({
        id: String(id),
        slug,
        name,
        price: Number(price),
        imageUrl: imageSrc,
        imageAlt,
      })
      openCartDrawer()
    },
    [addItem, openCartDrawer, id, slug, name, price, imageSrc, imageAlt],
  )

  return (
    /* No overflow-hidden here — shadow renders freely without clipping the image */
    <div className="flex w-full max-w-[400px] flex-col rounded-[20px]">
      {/* Image — overflow-hidden + top radius here only, so image fills 400×352 fully */}
      <div className="relative h-[352px] w-full shrink-0 overflow-hidden rounded-t-[20px] bg-[#e8e4dd]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="object-cover object-center w-[400px] h-[352px]"
          fill
        />
      </div>

      {/* Content — 216px tall, green gradient, bottom radius */}
      <div className="flex h-[216px] w-full flex-col rounded-b-[20px] bg-[linear-gradient(180deg,rgba(24,23,23,0.2)_0%,rgba(84,101,125,0.16)_51.92%,rgba(102,102,102,0.2)_66.35%),linear-gradient(0deg,#627E5C,#627E5C)] px-[17px] pb-4 pt-[17px]">
        {/* Name */}
        <h3 className="line-clamp-2 max-w-[341px] font-['Cormorant_Garamond'] text-[30px] font-bold leading-none tracking-normal text-white">
          {name}
        </h3>

        {/* Description */}
        <p className="mt-[6px] line-clamp-2 max-w-[341px] font-['Martel_Sans'] text-[14px] font-normal leading-[16px] tracking-normal text-white/70">
          {description}
        </p>

        {/* Price + Select Options */}
        <div className="mt-[25px] flex items-center justify-between">
          <span className="font-['Martel_Sans'] text-[16px] font-normal leading-none text-white">
            ${Number(price).toFixed(2)}
          </span>

          <Link
            href={`/shop/${encodeURIComponent(slug)}`}
            className="rounded-full border border-[#DADADA] px-[15px] py-[3px] font-['Martel_Sans'] text-[14px] font-normal leading-none text-white transition-colors hover:bg-white/10"
          >
            Select Options
          </Link>
        </div>

        {/* Add to bag */}
        <button
          type="button"
          onClick={addToCart}
          className="mt-auto h-[47px] w-full shrink-0 rounded-full bg-[#F5F1E8] px-20 py-[1px] font-['Martel_Sans'] text-[16px] font-semibold leading-none text-[#3B3B3B] transition-opacity hover:opacity-90"
        >
          Add to bag
        </button>
      </div>
    </div>
  )
}
