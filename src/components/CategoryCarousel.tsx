'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Category {
  id: string | number
  name: string
  description?: string
  image?: { url: string; alt: string } | null
  emoji?: string
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Skincare for Restoration', emoji: '🌿' },
  { id: '2', name: 'Teas for Relaxation', emoji: '🍵' },
  { id: '3', name: 'Candles for Atmosphere', emoji: '🕯️' },
  { id: '4', name: 'Yoga Mats for Movement', emoji: '🧘' },
  { id: '5', name: 'Wellness Essentials', emoji: '✨' },
  { id: '6', name: 'Bath & Body', emoji: '🛁' },
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

  const items = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES
  const totalPages = Math.ceil(items.length / CARDS_PER_PAGE)
  const pageItems = items.slice(
    activePage * CARDS_PER_PAGE,
    activePage * CARDS_PER_PAGE + CARDS_PER_PAGE,
  )

  const prevPage = () => setActivePage((p) => (p - 1 + totalPages) % totalPages)
  const nextPage = () => setActivePage((p) => (p + 1) % totalPages)

  const getCategoryImage = (cat: Category, index: number): string => {
    if (cat.image?.url && cat.image.url.trim().length > 0) return cat.image.url
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
  }

  return (
    <section className="overflow-hidden bg-[#F5F1E8] py-[88px]">
      <div className="mx-auto w-full max-w-[1440px] px-[38px]">
        <div className="grid grid-cols-1 gap-[34px] md:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((cat, i) => (
            <Link
              href="/shop"
              key={cat.id}
              className="group relative overflow-hidden rounded-[20px] bg-[#D9D9D9] aspect-[3/4]"
            >
              <img
                src={getCategoryImage(cat, activePage * CARDS_PER_PAGE + i)}
                alt={cat.image?.alt || cat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute bottom-0 left-0 right-0 bg-[#627E5C]"
                style={{
                  height: '116px',
                  borderBottomLeftRadius: '20px',
                  borderBottomRightRadius: '20px',
                }}
              >
                <p className="px-8 pt-9 text-center font-['Cormorant_Garamond'] text-[35px] font-bold leading-[1.21] text-white">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 
          Pagination dots — Figma specs:
          Active dot:   width 33px (pill), height 11px, borderRadius 100px, color #627E5C
          Inactive dot: width 11px (circle), height 11px, color #00000080
          All dots: top 2398px, active dot left 749.59px
        */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-[10px]">
            {/* Page indicator dots */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const isActive = i === activePage
              return (
                <button
                  key={i}
                  onClick={() => setActivePage(i)}
                  aria-label={`Go to category page ${i + 1}`}
                  style={{
                    width: isActive ? '33px' : '11px',
                    height: '11px',
                    borderRadius: '100px',
                    backgroundColor: isActive ? '#627E5C' : 'rgba(0,0,0,0.50)',
                    flexShrink: 0,
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'width 0.3s ease, background-color 0.3s ease',
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
