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
}: HeroProps) {
  return (
    <section className="relative mx-auto h-[840px] w-full max-w-[1440px] overflow-hidden bg-[#F5F1E8]">
      <Image src="/hero-bg-521122.png" alt="Hero background" fill priority className="object-fill" />
      <div className="relative z-10">
        <h1 className="absolute left-[100px] top-[242px] max-w-[602px] font-['Cormorant_Garamond'] text-[60px] font-bold leading-[58px] text-black">
          {heading}
        </h1>
        <p className="absolute left-[100px] top-[377px] max-w-[584px] font-['Inter'] text-[20px] leading-[1.21] text-black/50">
          {subtext ||
            'Everyday essentials that help people slow down, reset, and reconnect. From proper skin wellness and teas, to movement tools and sensory products.'}
        </p>
        <div className="absolute left-[100px] top-[533px] flex gap-[18px]">
          <Link
            href="/shop"
            className="inline-flex h-[44px] min-w-[248px] items-center justify-center rounded-full bg-[#627E5C] px-[30px] font-['Inter'] text-[20px] font-medium text-white"
          >
            {primaryCta}
          </Link>
          <Link
            href="/about"
            className="inline-flex h-[44px] min-w-[245px] items-center justify-center rounded-full border border-[#627E5C] bg-transparent px-[30px] font-['Inter'] text-[20px] font-medium text-black"
          >
            {secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
