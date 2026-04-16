'use client'

import Image from 'next/image'
import Link from 'next/link'

const tiles = [
  { src: '/cat-herbal-tea.png', alt: 'Herbal Tea' },
  { src: '/cat-manuka-honey-7887dc.png', alt: 'Manuka Honey' },
  { src: '/cat-yoga.png', alt: 'Yoga' },
  { src: '/cat-teaware-63561d.png', alt: 'Teaware' },
  { src: '/cat-oil-candles.png', alt: 'Oil & Candles' },
  { src: '/cat-skin-wellness-6d4092.png', alt: 'Skin Wellness' },
]

export default function BentoGrid() {
  return (
    <section className="bg-[#F5F1E8] py-20">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-[96px]">
        {/* ── Mobile & Tablet: single column stack ── */}
        <div className="flex flex-col gap-3 lg:hidden">
          {tiles.map((tile) => (
            <Link
              key={tile.alt}
              href="/shop"
              className="group relative w-full overflow-hidden rounded-[22px]"
              style={{ height: '260px' }}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ))}

          {/* View All — mobile */}
          <Link
            href="/shop"
            className="flex items-center justify-center rounded-[22px] bg-[#627E5C]"
            style={{ height: '160px' }}
          >
            <p className="text-center font-['Cormorant_Garamond'] text-[40px] font-bold leading-none text-white">
              View All
              <br />
              Products
            </p>
          </Link>
        </div>

        {/* ── Desktop: bento grid ── */}
        <div
          className="hidden lg:grid gap-3"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(3, 220px)',
          }}
        >
          <Link
            href="/shop"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '1', gridRow: '1 / 3' }}
          >
            <Image
              src="/cat-herbal-tea.png"
              alt="Herbal Tea"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <Link
            href="/shop"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '2', gridRow: '1 / 3' }}
          >
            <Image
              src="/cat-manuka-honey-7887dc.png"
              alt="Manuka Honey"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <Link
            href="/shop"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '3 / 5', gridRow: '1' }}
          >
            <Image
              src="/cat-yoga.png"
              alt="Yoga"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <Link
            href="/shop"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '3 / 5', gridRow: '2' }}
          >
            <Image
              src="/cat-teaware-63561d.png"
              alt="Teaware"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <Link
            href="/shop"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '1 / 3', gridRow: '3' }}
          >
            <Image
              src="/cat-oil-candles.png"
              alt="Oil & Candles"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <Link
            href="/shop"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '3', gridRow: '3' }}
          >
            <Image
              src="/cat-skin-wellness-6d4092.png"
              alt="Skin Wellness"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <Link
            href="/shop"
            className="flex items-center justify-center rounded-[22px] bg-[#627E5C] transition-opacity duration-300 hover:opacity-90"
            style={{ gridColumn: '4', gridRow: '3' }}
          >
            <p className="text-center font-['Cormorant_Garamond'] text-[40px] font-bold leading-none text-white">
              View All
              <br />
              Products
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}
