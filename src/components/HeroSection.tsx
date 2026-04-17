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
    <section className="relative w-full min-h-[560px] sm:min-h-[680px] lg:h-[840px] overflow-hidden bg-[#F5F1E8]">
      {/* Background image */}
      <Image
        src={image?.url ?? '/hero-bg-521122.png'}
        alt={image?.alt ?? 'Hero background'}
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay for readability on small screens */}
      <div className="absolute inset-0 bg-[#F5F1E8]/30 lg:hidden" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] h-full">
        <div className="flex flex-col justify-center h-full px-6 py-24 sm:py-32 sm:px-10 lg:py-0 lg:px-0">
          {/* Heading */}
          <h1
            className="
              max-w-[90%] sm:max-w-[70%] lg:max-w-[602px]
              font-['Cormorant_Garamond'] font-bold text-black
              text-[36px] leading-[1.1]
              sm:text-[48px] sm:leading-[1.05]
              lg:text-[60px] lg:leading-[58px]
              lg:absolute lg:left-[100px] lg:top-[242px]
            "
          >
            {heading}
          </h1>

          {/* Subtext */}
          <p
            className="
              mt-5 sm:mt-6
              max-w-[90%] sm:max-w-[65%] lg:max-w-[584px]
              font-['Inter'] text-black/50 leading-[1.21]
              text-[15px] sm:text-[17px] lg:text-[20px]
              lg:absolute lg:left-[100px] lg:top-[377px] lg:mt-0
            "
          >
            {subtext ||
              'Everyday essentials that help people slow down, reset, and reconnect. From proper skin wellness and teas, to movement tools and sensory products.'}
          </p>

          {/* CTAs */}
          <div
            className="
              mt-8 sm:mt-10
              flex flex-col sm:flex-row gap-3 sm:gap-4
              lg:absolute lg:left-[100px] lg:top-[533px] lg:mt-0 lg:gap-[18px]
            "
          >
            <Link
              href="/shop"
              className="
                inline-flex items-center justify-center
                h-[44px] rounded-full bg-[#627E5C]
                px-[30px]
                w-full sm:w-auto sm:min-w-[220px] lg:min-w-[248px]
                font-['Inter'] font-medium text-white
                text-[16px] lg:text-[20px]
                transition-opacity hover:opacity-90
              "
            >
              {primaryCta}
            </Link>
            <Link
              href="/about"
              className="
                inline-flex items-center justify-center
                h-[44px] rounded-full border border-[#627E5C] bg-transparent
                px-[30px]
                w-full sm:w-auto sm:min-w-[200px] lg:min-w-[245px]
                font-['Inter'] font-medium text-black
                text-[16px] lg:text-[20px]
                transition-opacity hover:opacity-80
              "
            >
              {secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
