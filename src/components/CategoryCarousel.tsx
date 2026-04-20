'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string | number
  name: string
  description?: string
  image?: { url: string; alt: string } | null
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Skincare for Restoration' },
  { id: '2', name: 'Teas for Relaxation' },
  { id: '3', name: 'Candles for Atmosphere' },
  { id: '4', name: 'Yoga mats for movement' },
]

const FALLBACK_IMAGES = [
  '/shop-card-skincare-563b38.png',
  '/shop-card-tea.png',
  '/shop-card-candles.png',
  '/shop-card-yoga.png',
]

const CARD_W = 399
const CARD_GAP = 17
const CARDS_PER_PAGE = 3

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [activePage, setActivePage] = useState(0)

  const items = categories?.length > 0 ? categories : FALLBACK_CATEGORIES

  const getImage = (cat: Category, i: number) =>
    cat.image?.url?.trim() ? cat.image.url : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]

  const totalPages = Math.ceil(items.length / CARDS_PER_PAGE)
  const offset = activePage * CARDS_PER_PAGE * (CARD_W + CARD_GAP)

  return (
    <section className="relative overflow-hidden bg-[#F5F1E8] py-[88px]">
      <div className="pointer-events-none absolute right-0 top-0 opacity-[0.12]">
        <Image src="/logo1.png" alt="" width={493} height={232} aria-hidden="true" />
      </div>
      <div className="hidden lg:block">
        <div className="pl-[2.64%]">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ gap: CARD_GAP, transform: `translateX(-${offset}px)` }}
          >
            {items.map((cat, i) => (
              <Link
                key={cat.id}
                href="/shop"
                className="group relative shrink-0 overflow-hidden rounded-[20px]"
                style={{ width: CARD_W, height: 500 }}
              >
                <div className="relative h-[384px] overflow-hidden rounded-t-[20px]">
                  <img
                    src={getImage(cat, i)}
                    alt={cat.image?.alt ?? cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex h-[116px] items-center justify-center rounded-b-[20px] bg-[#627E5C]">
                  <p className="px-6 text-center font-['Cormorant_Garamond'] text-[35px] font-bold leading-tight text-white">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-[10px] pb-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-[11px] shrink-0 rounded-full border-none p-0 transition-all duration-300 ${
                  i === activePage ? 'w-[33px] bg-[#627E5C]' : 'w-[11px] bg-black/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="hidden gap-5 px-6 sm:grid sm:grid-cols-2 sm:px-10 lg:hidden">
        {items.map((cat, i) => (
          <Link key={cat.id} href="/shop" className="group overflow-hidden rounded-[20px]">
            <div className="relative aspect-[399/384] overflow-hidden rounded-t-[20px]">
              <img
                src={getImage(cat, i)}
                alt={cat.image?.alt ?? cat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex min-h-[90px] items-center justify-center rounded-b-[20px] bg-[#627E5C] px-4">
              <p className="text-center font-['Cormorant_Garamond'] text-[28px] font-bold leading-tight text-white">
                {cat.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 px-6 sm:hidden">
        {items.map((cat, i) => (
          <Link key={cat.id} href="/shop" className="group overflow-hidden rounded-[20px]">
            <div className="relative aspect-[3/2] overflow-hidden rounded-t-[20px]">
              <img
                src={getImage(cat, i)}
                alt={cat.image?.alt ?? cat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex min-h-[80px] items-center justify-center rounded-b-[20px] bg-[#627E5C] px-4">
              <p className="text-center font-['Cormorant_Garamond'] text-[24px] font-bold leading-tight text-white">
                {cat.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
