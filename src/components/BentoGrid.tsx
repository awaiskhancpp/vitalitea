'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { BentoUiTile } from '@/lib/homeFallbacks'
import { FALLBACK_BENTO_TILES } from '@/lib/homeFallbacks'

const TileLabel = ({ label }: { label: string }) => (
  <span className="absolute left-5 top-[15px] font-['Cormorant_Garamond'] text-[clamp(18px,2.08vw,30px)] font-bold leading-[1.21] text-black drop-shadow-sm">
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

const TileArrowWhite = () => (
  <div
    className="absolute bottom-[9px] right-[9px] flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110"
    style={{ boxShadow: '2px 2px 7px 0px rgba(0,0,0,0.25)' }}
    aria-hidden="true"
  >
    <Image src="/rightup.png" alt="" width={24} height={24} />
  </div>
)

export default function BentoGrid({ tiles }: { tiles?: BentoUiTile[] }) {
  const data = tiles && tiles.length === 6 ? tiles : FALLBACK_BENTO_TILES

  return (
    <section className="bg-[#F5F1E8] py-16 lg:py-20">
      <div className="w-full px-6 sm:px-10 lg:pl-[6.94%] lg:pr-[6.39%]">
        <div className="flex flex-col gap-3 sm:hidden">
          {data.map((tile, i) => (
            <Link
              key={`${tile.alt}-${i}`}
              href="#"
              className="group relative aspect-video w-full overflow-hidden rounded-[22px]"
            >
              <Image
                src={tile.imageUrl}
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
            className="group relative flex h-32 items-center justify-center rounded-[22px] bg-[#627E5C]"
          >
            <p
              className="text-center font-['Cormorant_Garamond'] font-bold leading-none text-white"
              style={{ fontSize: 'clamp(1.5rem,4.2vw,2.25rem)' }}
            >
              View All
              <br />
              Products
            </p>
            <TileArrowWhite />
          </Link>
        </div>

        <div className="hidden gap-3 sm:grid sm:grid-cols-2 lg:hidden">
          {data.map((tile, i) => (
            <Link key={`sm-${tile.alt}-${i}`} href="#" className="group relative aspect-video overflow-hidden rounded-[22px]">
              <Image
                src={tile.imageUrl}
                alt={tile.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <TileLabel label={tile.label} />
              <TileArrow />
            </Link>
          ))}
          <Link href="#" className="group relative col-span-2 flex h-36 items-center justify-center rounded-[22px] bg-[#627E5C]">
            <p
              className="text-center font-['Cormorant_Garamond'] font-bold leading-none text-white"
              style={{ fontSize: 'clamp(1.625rem,4.5vw,2.5rem)' }}
            >
              View All Products
            </p>
            <TileArrowWhite />
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-col" style={{ gap: 'clamp(12px, 1.25vw, 18px)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '304fr 304fr 616fr',
              gridTemplateRows: 'clamp(140px, 13.82vw, 199px) clamp(140px, 13.82vw, 199px)',
              columnGap: 'clamp(8px, 0.83vw, 12px)',
              rowGap: 'clamp(10px, 1.25vw, 18px)',
            }}
          >
            <Link href="#" className="group relative z-0 row-span-2 block h-full min-h-0 w-full min-w-0 overflow-hidden rounded-[22px]" style={{ gridColumn: '1', gridRow: '1 / 3' }}>
              <Image
                src={data[0].imageUrl}
                alt={data[0].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 22vw, 100vw"
              />
              <TileLabel label={data[0].label} />
              <TileArrow />
            </Link>

            <Link href="#" className="group relative z-0 row-span-2 block h-full min-h-0 w-full min-w-0 overflow-hidden rounded-[22px]" style={{ gridColumn: '2', gridRow: '1 / 3' }}>
              <Image
                src={data[1].imageUrl}
                alt={data[1].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 22vw, 100vw"
              />
              <TileLabel label={data[1].label} />
              <TileArrow />
            </Link>

            <Link href="#" className="group relative z-0 block h-full min-h-0 w-full min-w-0 overflow-hidden rounded-[22px]" style={{ gridColumn: '3', gridRow: '1' }}>
              <Image
                src={data[2].imageUrl}
                alt={data[2].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 24vw, 100vw"
              />
              <TileLabel label={data[2].label} />
              <TileArrow />
            </Link>

            <Link href="#" className="group relative z-0 block h-full min-h-0 w-full min-w-0 overflow-hidden rounded-[22px]" style={{ gridColumn: '3', gridRow: '2' }}>
              <Image
                src={data[3].imageUrl}
                alt={data[3].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 24vw, 100vw"
              />
              <TileLabel label={data[3].label} />
              <TileArrow />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '410fr 410fr 395fr',
              gap: 'clamp(10px, 1.11vw, 16px)',
              minHeight: 'clamp(160px, 15.56vw, 224px)',
            }}
          >
            <Link href="#" className="group relative z-0 block h-full min-h-[clamp(8rem,15.56vw,14rem)] w-full min-w-0 overflow-hidden rounded-[22px]">
              <Image
                src={data[4].imageUrl}
                alt={data[4].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 30vw, 100vw"
              />
              <TileLabel label={data[4].label} />
              <TileArrow />
            </Link>

            <Link href="#" className="group relative z-0 block h-full min-h-[clamp(8rem,15.56vw,14rem)] w-full min-w-0 overflow-hidden rounded-[22px]">
              <Image
                src={data[5].imageUrl}
                alt={data[5].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 30vw, 100vw"
              />
              <TileLabel label={data[5].label} />
              <TileArrow />
            </Link>

            <Link href="#" className="group relative flex items-center justify-center rounded-[22px] bg-[#627E5C] transition-opacity hover:opacity-90">
              <p
                className="text-center font-['Cormorant_Garamond'] font-bold leading-none text-white"
                style={{ fontSize: 'clamp(28px, 2.78vw, 40px)' }}
              >
                View All
                <br />
                Products
              </p>
              <TileArrowWhite />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
