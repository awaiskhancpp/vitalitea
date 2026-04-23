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
    <section className="bg-[#F5F1E8] py-16 lg:py-20">
      <div className="w-full px-6 sm:px-10 lg:px-[6.94%]">
        <h2
          className="mb-7 font-['Cormorant_Garamond'] font-bold leading-[1.21] text-black lg:mb-[clamp(32px,6.25vw,90px)]"
          style={{ fontSize: 'clamp(32px, 3.47vw, 50px)' }}
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
                  <ProductCard product={product} index={i} />
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
          className="hidden lg:grid"
          style={{
            gridTemplateColumns: '400fr 20fr 400fr 28fr 400fr',
          }}
        >
          {pageItems.map((product, index) => (
            <div
              key={product.id}
              style={{
                gridColumn: index === 0 ? 1 : index === 1 ? 3 : 5,
              }}
            >
              <ProductCard product={product} index={activePage * CARDS_PER_PAGE + index} />
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

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: '4px 4px 10px 0px rgba(0,0,0,0.12)' }}
    >
      <div
        className="relative w-full overflow-hidden rounded-t-[20px] bg-[#efefef]"
        style={{ aspectRatio: '400/352' }}
      >
        <Image
          src={product.image?.url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
          alt={product.image?.alt ?? product.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 46vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col rounded-b-[20px] px-[22px] py-[18px]">
        <h3 className="font-['Cormorant'] text-[30px] font-bold leading-[1.21] text-black">
          {product.name}
        </h3>
        <p
          className="mt-1 line-clamp-2 font-['Martel_Sans'] text-[14px] leading-[1.14]"
          style={{ color: 'rgba(0,0,0,0.5)' }}
        >
          {product.description}
        </p>
        <div className="mb-3 mt-4 flex items-center justify-between">
          <span className="font-['Martel_Sans'] text-[16px] font-normal leading-[1.824] text-black">
            ${Number(product.price).toFixed(2)}
          </span>
          <Link
            href="#"
            className="inline-flex items-center rounded-full font-['Martel_Sans'] text-[12px] font-normal text-black"
            style={{ border: '1px solid #DADADA', padding: '3px 15px' }}
          >
            Select Options
          </Link>
        </div>
        <Link
          href="#"
          className="mt-auto inline-flex w-full items-center justify-center self-center whitespace-nowrap rounded-full bg-[#627E5C] font-['Martel_Sans'] text-[15px] font-extrabold text-white transition-opacity hover:opacity-90"
          style={{ padding: '10px 80px' }}
        >
          Shop Now
        </Link>
      </div>
    </div>
  )
}
