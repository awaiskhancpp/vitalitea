'use client'

import { useState, useRef } from 'react'
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

const CARDS_PER_PAGE = 3

// Dot pills shared between mobile (per-card) and desktop (per-page)
function Dots({
  count,
  active,
  onClick,
}: {
  count: number
  active: number
  onClick: (i: number) => void
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Slide ${i + 1}`}
          aria-current={i === active}
          className={`h-[11.44px] shrink-0 rounded-full border-none p-0 transition-all duration-300 ${
            i === active ? 'w-[65.65px] bg-[#627E5C]' : 'w-[11px] bg-black/50'
          }`}
          onClick={() => onClick(i)}
        />
      ))}
    </>
  )
}

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)

  const items = categories?.length > 0 ? categories : FALLBACK_CATEGORIES
  const getImage = (cat: Category, i: number) =>
    cat.image?.url?.trim() ? cat.image.url : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]

  const totalPages = Math.ceil(items.length / CARDS_PER_PAGE)
  const lastIndex = items.length - 1

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDelta.current = 0
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchDelta.current = e.touches[0].clientX - touchStartX.current
  }
  const handleTouchEnd = () => {
    if (touchDelta.current < -50) setIndex((i) => Math.min(i + 1, lastIndex))
    else if (touchDelta.current > 50) setIndex((i) => Math.max(i - 1, 0))
  }

  return (
    <section className="relative overflow-hidden bg-[#F5F1E8] py-[88px]">
      <style>{`
        #cat-track { --card: 85vw; --gap: 12px; }
        @media (min-width: 1024px) {
          #cat-track { --card: 27.7083vw; --gap: 1.1806vw; }
        }
      `}</style>

      {/* Watermark */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-0 opacity-[0.12]"
        style={{ width: 'min(493px, 34.24vw)', aspectRatio: '493/232' }}
        aria-hidden="true"
      >
        <Image
          src="/logo1.png"
          alt=""
          fill
          sizes="min(493px, 34.24vw)"
          className="object-contain object-right-top"
        />
      </div>

      {/* Carousel */}
      <div
        className="relative z-10"
        role="region"
        aria-roledescription="carousel"
        aria-label="Shop by category"
        data-carousel="slide"
      >
        {/* Track */}
        <div
          className="overflow-hidden pl-[4vw] lg:pl-[2.639vw]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            id="cat-track"
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              gap: 'var(--gap)',
              transform: `translateX(calc(${-index} * (var(--card) + var(--gap))))`,
            }}
          >
            {items.map((cat, i) => (
              <div
                key={cat.id}
                data-carousel-item
                className="w-[85vw] shrink-0 lg:w-[27.7083vw]"
                aria-hidden={i !== index}
              >
                <Link
                  href="/shop"
                  className="group relative block w-full overflow-hidden rounded-[20px]"
                  style={{ aspectRatio: '399/500' }}
                >
                  <div className="relative h-[76.8%] w-full overflow-hidden rounded-t-[20px]">
                    <img
                      src={getImage(cat, i)}
                      alt={cat.image?.alt ?? cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex h-[23.2%] w-full items-center justify-center rounded-b-[20px] bg-[#627E5C] px-6">
                    <p
                      className="text-center font-['Cormorant_Garamond'] font-bold leading-[1.211] text-white"
                      style={{ fontSize: 'clamp(22px, 2.431vw, 35px)' }}
                    >
                      {cat.name}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Dots — mobile: one per card / desktop: one per page */}
        {items.length > 1 && (
          <div className="mt-14 flex items-center justify-center gap-[10px] pb-2">
            <div className="flex items-center gap-[10px] lg:hidden">
              <Dots count={items.length} active={index} onClick={setIndex} />
            </div>
            <div className="hidden items-center gap-[10px] lg:flex">
              <Dots
                count={totalPages}
                active={Math.floor(index / CARDS_PER_PAGE)}
                onClick={(i) => setIndex(i * CARDS_PER_PAGE)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
