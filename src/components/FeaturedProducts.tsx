'use client'
import { useState } from 'react'
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
  const items = products.length > 0 ? products : FALLBACK_PRODUCTS
  const totalPages = Math.ceil(items.length / CARDS_PER_PAGE)
  const pageItems = items.slice(
    activePage * CARDS_PER_PAGE,
    activePage * CARDS_PER_PAGE + CARDS_PER_PAGE,
  )

  return (
    <section className="bg-[#F5F1E8] py-16 lg:py-20">
      <div className="w-full px-6 sm:px-10 lg:px-[6.94%]">
        <h2
          className="mb-7 font-['Cormorant_Garamond'] font-bold leading-[1.21] text-black"
          style={{ fontSize: 'clamp(32px, 3.5vw, 50px)' }}
        >
          Our Products
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((product, index) => (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-[20px] bg-white"
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
                <div className="mt-4 flex items-center justify-between">
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
                  className="mt-auto inline-flex w-full items-center justify-center rounded-full bg-[#627E5C] font-['Martel_Sans'] text-[15px] font-extrabold text-white transition-opacity hover:opacity-90"
                  style={{ padding: '10px 0' }}
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-[10px]">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePage(i)}
                aria-label={`Page ${i + 1}`}
                className={`h-[11px] shrink-0 rounded-full border-none p-0 transition-all duration-300 ${
                  i === activePage ? 'w-[33px] bg-[#627E5C]' : 'w-[11px] bg-black/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
