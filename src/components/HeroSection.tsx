import Link from 'next/link'
import Image from 'next/image'

interface HeroProps {
  heading: string
  subtext: string
  primaryCta: string
  secondaryCta: string
  image?: { url: string; alt: string } | null
}
export default function HeroSection({
  heading,
  subtext,
  primaryCta,
  secondaryCta,
  image,
}: HeroProps) {
  const DEFAULT_SUBTEXT =
    'Everyday essentials that help people slow down, reset, and reconnect. From proper skin wellness and teas, to movement tools and sensory products.'

  return (
    <section className="relative w-full overflow-hidden bg-[#F5F1E8] min-h-[560px] sm:min-h-[680px] lg:min-h-[840px]">
      <Image
        src={image?.url ?? '/hero-bg-521122.png'}
        alt={image?.alt ?? 'Hero background'}
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#F5F1E8]/30 lg:hidden" />

      <div className="relative z-10 flex w-full min-h-[560px] flex-col justify-center px-6 py-16 sm:min-h-[680px] sm:px-10 sm:py-20 lg:min-h-[840px] lg:justify-start lg:px-[6.94%] lg:py-0">
        <div className="flex flex-col lg:pt-[242px]">
          <h1
            className="max-w-[90%] font-['Cormorant_Garamond'] font-bold text-black sm:max-w-[70%] lg:max-w-[602px]"
            style={{ fontSize: 'clamp(32px, 4.17vw, 60px)', lineHeight: '0.97em' }}
          >
            {heading}
          </h1>
          <p
            className="mt-5 max-w-[90%] font-['Inter'] leading-[1.21] sm:max-w-[65%] lg:mt-[19px] lg:max-w-[584px]"
            style={{ fontSize: 'clamp(15px, 1.39vw, 20px)', color: 'rgba(0,0,0,0.5)' }}
          >
            {subtext || DEFAULT_SUBTEXT}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mt-[84px] lg:gap-[18px]">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#627E5C] px-[30px] py-[10px] font-['Inter'] font-medium text-white transition-opacity hover:opacity-90"
              style={{ fontSize: 'clamp(15px, 1.39vw, 20px)' }}
            >
              {primaryCta}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#627E5C] bg-transparent px-[30px] py-[10px] font-['Inter'] font-medium text-black transition-opacity hover:opacity-80"
              style={{ fontSize: 'clamp(15px, 1.39vw, 20px)' }}
            >
              {secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
