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
  return (
    <section className="relative w-full overflow-hidden bg-[#F5F1E8]" style={{ minHeight: 560 }}>
      <Image
        src={image?.url ?? '/hero-bg-521122.png'}
        alt={image?.alt ?? 'Hero background'}
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#F5F1E8]/30 lg:hidden" />
      <div className="relative z-10 flex w-full flex-col justify-center px-6 py-24 sm:px-10 sm:py-32 lg:min-h-[840px] lg:px-[6.94%] lg:py-0">
        <div className="flex flex-col lg:pt-[242px] lg:pb-[200px]">
          <h1
            className="max-w-[90%] font-['Cormorant_Garamond'] font-bold text-black sm:max-w-[70%] lg:max-w-[602px] lg:text-[60px]"
            style={{
              fontSize: 'clamp(32px, 4vw, 60px)',
              lineHeight: '0.97em',
            }}
          >
            {heading}
          </h1>
          <p
            className="mt-6 max-w-[90%] font-['Inter'] leading-[1.21] sm:max-w-[65%] lg:mt-[135px] lg:max-w-[584px] lg:text-[20px]"
            style={{
              fontSize: 'clamp(15px, 1.5vw, 20px)',
              color: 'rgba(0,0,0,0.5)',
            }}
          >
            {subtext ||
              'Everyday essentials that help people slow down, reset, and reconnect. From proper skin wellness and teas, to movement tools and sensory products.'}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mt-[156px] lg:gap-[18px]">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#627E5C] px-[30px] py-[10px] font-['Inter'] font-medium text-white transition-opacity hover:opacity-90"
              style={{ fontSize: 'clamp(15px, 1.2vw, 20px)' }}
            >
              {primaryCta}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#627E5C] bg-transparent px-[30px] py-[10px] font-['Inter'] font-medium text-black transition-opacity hover:opacity-80"
              style={{ fontSize: 'clamp(15px, 1.2vw, 20px)' }}
            >
              {secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
