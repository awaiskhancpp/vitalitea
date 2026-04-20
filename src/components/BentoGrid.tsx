'use client'

import Image from 'next/image'
import Link from 'next/link'
const TileLabel = ({ label }: { label: string }) => (
  <span className="absolute left-5 top-[15px] font-['Cormorant_Garamond'] text-[clamp(20px,2vw,30px)] font-bold leading-[1.21] text-black drop-shadow-sm">
    {label}
  </span>
)

const TileArrow = () => (
  <div
    className="absolute bottom-[9px] right-[9px] flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#627E5C] transition-transform duration-300 group-hover:scale-110"
    aria-hidden="true"
  >
    <Image src="/rightup.png" alt="" width={24} height={24} className="brightness-0 invert" />
  </div>
)

export default function BentoGrid() {
  const TILES = [
    { src: '/cat-herbal-tea.png', alt: 'Herbal Tea', label: 'Herbal Tea' },
    { src: '/cat-manuka-honey-7887dc.png', alt: 'Manuka Honey', label: 'Manuka Honey' },
    { src: '/cat-yoga.png', alt: 'Yoga', label: 'Yoga' },
    { src: '/cat-teaware-63561d.png', alt: 'Teaware', label: 'Teaware' },
    { src: '/cat-oil-candles.png', alt: 'Oil & Candles', label: 'Oil & Candles' },
    { src: '/cat-skin-wellness-6d4092.png', alt: 'Skin Wellness', label: 'Skin Wellness' },
  ]

  return (
    <section className="bg-[#F5F1E8] py-16 lg:py-20">
      <div className="w-full px-4 sm:px-8 lg:px-[6.94%]">
        <div className="flex flex-col gap-3 sm:hidden">
          {TILES.map((tile) => (
            <Link
              key={tile.alt}
              href="#"
              className="group relative aspect-video w-full overflow-hidden rounded-[22px]"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <TileLabel label={tile.label} />
              <TileArrow />
            </Link>
          ))}
          <Link
            href="#"
            className="flex h-32 items-center justify-center rounded-[22px] bg-[#627E5C]"
          >
            <p className="text-center font-['Cormorant_Garamond'] text-[32px] font-bold leading-none text-white">
              View All
              <br />
              Products
            </p>
          </Link>
        </div>
        <div className="hidden gap-3 sm:grid sm:grid-cols-2 lg:hidden">
          {TILES.map((tile) => (
            <Link
              key={tile.alt}
              href="#"
              className="group relative aspect-video overflow-hidden rounded-[22px]"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <TileLabel label={tile.label} />
              <TileArrow />
            </Link>
          ))}
          <Link
            href="#"
            className="col-span-2 flex h-36 items-center justify-center rounded-[22px] bg-[#627E5C]"
          >
            <p className="text-center font-['Cormorant_Garamond'] text-[36px] font-bold leading-none text-white">
              View All Products
            </p>
          </Link>
        </div>

        <div
          className="hidden gap-3 lg:grid"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(3, minmax(160px, 220px))',
          }}
        >
          <Link
            href="#"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '1', gridRow: '1 / 3' }}
          >
            <Image
              src="/cat-herbal-tea.png"
              alt="Herbal Tea"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <TileLabel label="Herbal Tea" />
            <TileArrow />
          </Link>
          <Link
            href="#"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '2', gridRow: '1 / 3' }}
          >
            <Image
              src="/cat-manuka-honey-7887dc.png"
              alt="Manuka Honey"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <TileLabel label="Manuka Honey" />
            <TileArrow />
          </Link>

          <Link
            href="#"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '3 / 5', gridRow: '1' }}
          >
            <Image
              src="/cat-yoga.png"
              alt="Yoga"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <TileLabel label="Yoga" />
            <TileArrow />
          </Link>
          <Link
            href="#"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '3 / 5', gridRow: '2' }}
          >
            <Image
              src="/cat-teaware-63561d.png"
              alt="Teaware"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <TileLabel label="Teaware" />
            <TileArrow />
          </Link>
          <Link
            href="#"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '1 / 3', gridRow: '3' }}
          >
            <Image
              src="/cat-oil-candles.png"
              alt="Oil & Candles"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <TileLabel label="Oil & Candles" />
            <TileArrow />
          </Link>

          <Link
            href="#"
            className="group relative overflow-hidden rounded-[22px]"
            style={{ gridColumn: '3', gridRow: '3' }}
          >
            <Image
              src="/cat-skin-wellness-6d4092.png"
              alt="Skin Wellness"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <TileLabel label="Skin Wellness" />
            <TileArrow />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-center rounded-[22px] bg-[#627E5C] transition-opacity hover:opacity-90"
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
