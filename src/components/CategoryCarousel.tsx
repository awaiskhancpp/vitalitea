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

const CARDS_PER_PAGE = 3

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [activePage, setActivePage] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)

  const items = categories?.length > 0 ? categories : FALLBACK_CATEGORIES

  const getImage = (cat: Category, i: number) =>
    cat.image?.url?.trim() ? cat.image.url : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]

  const totalPages = Math.ceil(items.length / CARDS_PER_PAGE)
  const pageShift = activePage * CARDS_PER_PAGE

  return (
    <section className="relative overflow-hidden bg-[#F5F1E8] py-[88px]">
      <div
        className="pointer-events-none absolute right-0 top-0 z-0 opacity-[0.12]"
        style={{ width: 'min(493px, 34.24vw)', aspectRatio: '493/232' }}
      >
        <Image
          src="/logo1.png"
          alt=""
          fill
          sizes="min(493px, 34.24vw)"
          className="object-contain object-right-top"
          aria-hidden="true"
        />
      </div>

      <div
        id="category-carousel-desktop"
        className="relative z-10 hidden w-full lg:block"
        data-carousel="slide"
        role="region"
        aria-roledescription="carousel"
        aria-label="Shop by category"
      >
        <div className="overflow-hidden">
          <div className="pl-[2.639vw]">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ gap: '1.1806vw', transform: `translateX(calc(-${pageShift} * (27.7083vw + 1.1806vw)))` }}
            >
              {items.map((cat, i) => (
                <div key={cat.id} data-carousel-item className="w-[27.7083vw] shrink-0">
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
        </div>

        {totalPages > 1 ? (
          <div className="mt-14 flex items-center justify-center gap-[10px] pb-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to page ${i + 1}`}
                aria-current={i === activePage}
                data-carousel-slide-to={i}
                className={`h-[11.44px] shrink-0 rounded-full border-none p-0 transition-all duration-300 ${
                  i === activePage ? 'w-[65.65px] bg-[#627E5C]' : 'w-[11px] bg-black/50'
                }`}
                onClick={() => setActivePage(i)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div
        id="default-carousel"
        className="relative z-10 w-full px-6 sm:px-10 lg:hidden"
        data-carousel="slide"
        role="region"
        aria-roledescription="carousel"
        aria-label="Shop by category"
      >
        <div className="relative">
          <div className="overflow-hidden px-12">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
              {items.map((cat, i) => (
                <div
                  key={cat.id}
                  className="w-full shrink-0"
                  data-carousel-item
                  aria-hidden={slideIndex !== i}
                >
                  <Link
                    href="/shop"
                    className="group relative mx-auto block w-full max-w-[399px] overflow-hidden rounded-[20px]"
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
                        style={{ fontSize: 'clamp(22px, 5.5vw, 35px)' }}
                      >
                        {cat.name}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {items.length > 1 ? (
          <div className="mt-14 flex items-center justify-center gap-[10px] pb-2">
            {items.map((cat, i) => (
              <button
                key={cat.id}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === slideIndex}
                data-carousel-slide-to={i}
                className={`h-[11.44px] shrink-0 rounded-full border-none p-0 transition-all duration-300 ${
                  i === slideIndex ? 'w-[65.65px] bg-[#627E5C]' : 'w-[11px] bg-black/50'
                }`}
                onClick={() => setSlideIndex(i)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
