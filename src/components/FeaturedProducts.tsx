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
  emoji?: string
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Black Velvet Room Spray',
    description: 'A luxurious room spray with a deep, velvety scent.',
    price: 24.99,
    slug: 'black-velvet-room-spray',
    emoji: '🌑',
  },
  {
    id: '2',
    name: 'Black Velvet Fragrance Oil',
    description: 'Pure fragrance oil for diffusers and home use.',
    price: 19.99,
    slug: 'black-velvet-fragrance-oil',
    emoji: '🖤',
  },
  {
    id: '3',
    name: 'Black Velvet Reed Diffuser',
    description: 'Long-lasting reed diffuser for continuous fragrance.',
    price: 34.99,
    slug: 'black-velvet-reed-diffuser',
    emoji: '🕯️',
  },
]

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0)
  const items = products.length > 0 ? products : FALLBACK_PRODUCTS
  const figmaFallbackImages = [
    '/product-room-spray.png',
    '/product-black-velvet.png',
    '/product-reed-diffuser-47986c.png',
  ]

  return (
    <section className="bg-[#F5F1E8] py-20">
      <div className="mx-auto w-full max-w-[1440px] px-[94px]">
        <div className="mb-7">
          <h2 className="font-['Cormorant_Garamond'] text-[50px] font-bold leading-[1.21] text-black">
            Our Products
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          {items.slice(0, 3).map((product, index) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-[20px] bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.12)]"
            >
              <div className="relative h-[352px] overflow-hidden rounded-t-[20px] bg-[#efefef]">
                {product.image?.url ? (
                  <Image
                    src={product.image.url}
                    alt={product.image.alt}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src={figmaFallbackImages[index] ?? '/product-room-spray.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="h-[216px] rounded-b-[20px] px-[22px] py-[18px]">
                <h3 className="font-['Cormorant'] text-[30px] font-bold leading-[1.21] text-black">
                  {product.name}
                </h3>
                <p className="mt-[2px] line-clamp-2 text-[14px] leading-[1.15] text-black/50">
                  {product.description}
                </p>
                <div className="mt-[18px] flex items-center justify-between">
                  <span className="font-['Martel_Sans'] text-[16px] text-black">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="inline-flex h-[28px] items-center rounded-full border border-[#DADADA] px-[15px] font-['Martel_Sans'] text-[12px] text-black"
                  >
                    Select Options
                  </Link>
                </div>
                <Link
                  href={`/shop/${product.slug}`}
                  className="mt-2 inline-flex h-[47px] w-full items-center justify-center rounded-full bg-[#627E5C] font-['Martel_Sans'] text-[15px] font-extrabold text-white md:w-[366px]"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {items.length > 3 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: Math.ceil(items.length / 3) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to products page ${i + 1}`}
                className={`h-[11px] w-[11px] rounded-full ${i === active ? 'bg-[#222]' : 'bg-[#d0d0d0]'}`}
              />
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-2 pr-14">
          <span className="font-['Poppins'] text-[20px] text-[#8D8C8C]">
            {active + 1} / {Math.ceil(items.length / 3)}
          </span>
          <Image src="/chevron-right.svg" alt="Next products" width={9} height={17} />
        </div>
      </div>
    </section>
  )
}
