'use client'
import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string | number
  name: string
  description: string
  price: number
  slug: string
  image?: { url: string; alt: string } | null
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Black Velvet Room Spray',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves....',
    price: 35.96,
    slug: 'black-velvet-room-spray',
  },
  {
    id: '2',
    name: 'Black Velvet',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves....',
    price: 31.46,
    slug: 'black-velvet',
  },
  {
    id: '3',
    name: 'Black Velvet Reed Diffuser',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves...',
    price: 35.96,
    slug: 'black-velvet-reed-diffuser',
  },
  {
    id: '4',
    name: 'Black Velvet Candle',
    description:
      'Embark on an enchanting journey. Smoky black tea, fresh bergamot and spicy bay leaves...',
    price: 29.99,
    slug: 'black-velvet-candle',
  },
]

const FALLBACK_IMAGES = [
  '/product-room-spray.png',
  '/product-black-velvet.png',
  '/product-reed-diffuser-47986c.png',
]

const CARDS_PER_PAGE = 3

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const [activePage, setActivePage] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [stepPx, setStepPx] = useState(0)
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)

  const items = products.length > 0 ? products : FALLBACK_PRODUCTS
  const totalPages = Math.ceil(items.length / CARDS_PER_PAGE)
  const pageItems = items.slice(
    activePage * CARDS_PER_PAGE,
    activePage * CARDS_PER_PAGE + CARDS_PER_PAGE,
  )

  const lastMobile = items.length - 1

  const measureStep = useCallback(() => {
    const track = mobileTrackRef.current
    if (!track) return
    const first = track.firstElementChild as HTMLElement | null
    if (!first) return
    const gap = parseFloat(getComputedStyle(track).gap) || 0
    setStepPx(first.getBoundingClientRect().width + gap)
  }, [])

  useLayoutEffect(() => {
    measureStep()
    const track = mobileTrackRef.current
    if (!track) return
    const ro = new ResizeObserver(() => measureStep())
    ro.observe(track)
    window.addEventListener('resize', measureStep)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measureStep)
    }
  }, [items.length, measureStep])

  useLayoutEffect(() => {
    setMobileIndex((i) => Math.min(i, lastMobile))
  }, [lastMobile])

  const onMobileTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDelta.current = 0
  }
  const onMobileTouchMove = (e: React.TouchEvent) => {
    touchDelta.current = e.touches[0].clientX - touchStartX.current
  }
  const onMobileTouchEnd = () => {
    if (touchDelta.current < -50) setMobileIndex((i) => Math.min(i + 1, lastMobile))
    else if (touchDelta.current > 50) setMobileIndex((i) => Math.max(i - 1, 0))
  }

  const mobileTranslate =
    stepPx > 0 ? `translate3d(${-mobileIndex * stepPx}px,0,0)` : 'translate3d(0,0,0)'

  return (
    <section className="bg-[#F5F1E8] py-[clamp(2.5rem,4.2vw,5rem)] lg:py-[clamp(3rem,5vw,5rem)]">
      <div className="app-container w-full min-w-0 max-w-full">
        <h2
          className="mb-7 font-['Cormorant_Garamond'] font-bold leading-[1.21] text-black lg:mb-[clamp(2rem,6.25vw,5.625rem)]"
          style={{ fontSize: 'clamp(1.5rem, 3.47vw, 3.125rem)' }}
        >
          Our Products
        </h2>

        <div className="lg:hidden">
          <div
            className="overflow-hidden"
            onTouchStart={onMobileTouchStart}
            onTouchMove={onMobileTouchMove}
            onTouchEnd={onMobileTouchEnd}
          >
            <div
              ref={mobileTrackRef}
              className="flex gap-5 transition-transform duration-500 ease-in-out"
              style={{ transform: mobileTranslate, willChange: 'transform' }}
            >
              {items.map((product, i) => (
                <div key={product.id} className="w-full min-w-0 shrink-0">
                  <FeaturedProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          </div>
          {items.length > 1 && (
            <div className="mt-10 flex items-center justify-center gap-[10px]">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Product ${i + 1}`}
                  aria-current={i === mobileIndex ? 'true' : 'false'}
                  className={`h-[11px] shrink-0 rounded-full border-none p-0 transition-all duration-300 ${
                    i === mobileIndex ? 'w-[65.65px] bg-[#627E5C]' : 'w-[11px] bg-black/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className="hidden min-w-0 gap-x-[clamp(0.5rem,1.4vw,1.75rem)] gap-y-8 lg:grid"
          style={{
            gridTemplateColumns:
              'minmax(0,1fr) minmax(0,0.05fr) minmax(0,1fr) minmax(0,0.07fr) minmax(0,1fr)',
          }}
        >
          {pageItems.map((product, index) => (
            <div
              key={product.id}
              style={{
                gridColumn: index === 0 ? 1 : index === 1 ? 3 : 5,
              }}
            >
              <FeaturedProductCard product={product} index={activePage * CARDS_PER_PAGE + index} />
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-10 hidden items-center justify-center gap-[10px] lg:mt-[clamp(40px,4.17vw,60px)] lg:flex">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActivePage(i)}
                aria-label={`Page ${i + 1}`}
                className={`h-[11px] shrink-0 rounded-full border-none p-0 transition-all duration-300 ${
                  i === activePage ? 'w-[65.65px] bg-[#627E5C]' : 'w-[11px] bg-black/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <div
      className="flex h-full w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: '4px 4px 10px 0px rgba(0,0,0,0.12)' }}
    >
      <div
        className="relative w-full min-w-0 overflow-hidden rounded-t-[20px] bg-[#efefef]"
        style={{ aspectRatio: '400/352' }}
      >
        <Image
          src={product.image?.url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
          alt={product.image?.alt ?? product.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) min(28vw, 400px), (min-width: 640px) 46vw, 100vw"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col rounded-b-[20px] px-4 py-4 sm:px-5 sm:py-[1.125rem] md:px-[1.375rem]">
        <h3
          className="min-w-0 font-['Cormorant'] font-bold leading-[1.21] text-black"
          style={{ fontSize: 'clamp(1.25rem, 2.08vw, 1.875rem)' }}
        >
          {product.name}
        </h3>
        <p
          className="mt-1 line-clamp-2 min-w-0 font-['Martel_Sans'] leading-[1.14]"
          style={{ fontSize: 'clamp(0.8125rem,0.97vw,0.875rem)', color: 'rgba(0,0,0,0.5)' }}
        >
          {product.description}
        </p>
        <div className="mb-2 mt-4 flex min-w-0 flex-wrap items-center justify-between gap-2">
          <span
            className="font-['Martel_Sans'] font-normal leading-[1.824] text-black"
            style={{ fontSize: 'clamp(0.875rem,1.11vw,1rem)' }}
          >
            ${Number(product.price).toFixed(2)}
          </span>
          <Link
            href="#"
            className="inline-flex shrink-0 items-center rounded-full font-['Martel_Sans'] font-normal text-black"
            style={{
              border: '1px solid #DADADA',
              fontSize: 'clamp(0.6875rem,0.9vw,0.75rem)',
              padding: '0.2rem 0.75rem',
            }}
          >
            Select Options
          </Link>
        </div>
        <Link
          href="#"
          className="mt-auto inline-flex w-full min-w-0 max-w-full items-center justify-center self-center rounded-full bg-[#627E5C] px-6 py-2.5 font-['Martel_Sans'] font-extrabold text-white transition-opacity hover:opacity-90 sm:px-10"
          style={{ fontSize: 'clamp(0.875rem,1.04vw,0.9375rem)' }}
        >
          Shop Now
        </Link>
      </div>
    </div>
  )
}
