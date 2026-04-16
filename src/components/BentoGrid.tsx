import Image from 'next/image'

import Link from 'next/link'

export default function BentoGrid() {
  return (
    <section className="bg-[#F5F1E8] py-20">
      <div className="mx-auto w-full max-w-[1440px] px-[96px]">
        <div className="relative h-[656px]">
          <Link
            href="/shop"
            className="absolute left-0 top-0 block h-[414px] w-[304px] overflow-hidden rounded-[22px]"
          >
            <Image src="/cat-herbal-tea.png" alt="Herbal Tea" fill className="object-cover" />
          </Link>

          <Link
            href="/shop"
            className="absolute left-[316px] top-0 block h-[414px] w-[304px] overflow-hidden rounded-[22px]"
          >
            <Image
              src="/cat-manuka-honey-7887dc.png"
              alt="Manuka Honey"
              fill
              className="object-cover"
            />
          </Link>

          <Link
            href="/shop"
            className="absolute left-[632px] top-0 block h-[199px] w-[616px] overflow-hidden rounded-[22px]"
          >
            <Image src="/cat-yoga.png" alt="Yoga" fill className="object-cover" />
          </Link>

          <Link
            href="/shop"
            className="absolute left-[632px] top-[215px] block h-[199px] w-[616px] overflow-hidden rounded-[22px]"
          >
            <Image src="/cat-teaware-63561d.png" alt="Teaware" fill className="object-cover" />
          </Link>

          <Link
            href="/shop"
            className="absolute left-0 top-[432px] block h-[224px] w-[410px] overflow-hidden rounded-[22px]"
          >
            <Image src="/cat-oil-candles.png" alt="Oil & Candles" fill className="object-cover" />
          </Link>

          <Link
            href="/shop"
            className="absolute left-[427px] top-[432px] block h-[224px] w-[410px] overflow-hidden rounded-[22px]"
          >
            <Image
              src="/cat-skin-wellness-6d4092.png"
              alt="Skin Wellness"
              fill
              className="object-cover"
            />
          </Link>

          <Link
            href="/shop"
            className="absolute left-[853px] top-[432px] block h-[224px] w-[395px] rounded-[22px] bg-[#627E5C]"
          >
            <div className="flex h-full items-center justify-center px-7">
              <p className="font-['Cormorant_Garamond'] text-[40px] font-bold leading-none text-white">
                View All
                <br />
                Products
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
