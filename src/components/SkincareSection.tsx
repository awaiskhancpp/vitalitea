import Link from 'next/link'
import Image from 'next/image'

interface SkincareSectionProps {
  heading: string
  body: string
  cta: string
  image?: { url: string; alt: string } | null
}

export default function SkincareSection({ heading, body, cta, image }: SkincareSectionProps) {
  return (
    <section className="bg-[#F5F1E8]">
      <div className="flex w-full flex-col lg:flex-row lg:items-stretch lg:pl-[1.24%] lg:pr-[1.2%]">
        <div className="order-2 w-full px-6 pb-16 pt-10 sm:px-10 sm:pb-20 sm:pt-14 lg:order-1 lg:w-[54.08%] lg:py-[6.6vw] lg:pl-[7.01%] lg:pr-[2%]">
          <h2
            className="mb-5 font-['Cormorant_Garamond'] font-bold leading-[1.21] text-black lg:max-w-[387px]"
            style={{ fontSize: 'clamp(28px, 2.78vw, 40px)' }}
          >
            {heading}
          </h2>
          <p
            className="mb-8 font-['Inter'] leading-[1.21] lg:mb-[60px] lg:max-w-[601px]"
            style={{
              fontSize: 'clamp(15px, 1.39vw, 20px)',
              color: 'rgba(0,0,0,0.65)',
            }}
          >
            {body ||
              'Where science meets nature for visibly renewed skin. Selected Skin Care uses plant stem cells and advanced formulations to support collagen, improve elasticity, and enhance overall skin health. Designed to restore balance and reveal a smoother, more radiant complexion. Simple, effective, results-driven.'}
          </p>
          <Link
            href="/shop/skincare"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#627E5C] px-[30px] py-[10px] font-['Inter'] font-medium text-white transition-opacity hover:opacity-90"
            style={{ fontSize: 'clamp(15px, 1.39vw, 20px)' }}
          >
            {cta}
          </Link>
        </div>

        <div className="order-1 w-full px-6 pt-10 sm:px-10 sm:pt-14 lg:order-2 lg:w-[42.22%] lg:px-0 lg:py-[4.86vw]">
          <div
            className="relative w-full overflow-hidden rounded-[20px] bg-amber-50"
            style={{ aspectRatio: '608/538' }}
          >
            <Image
              src={image?.url ?? '/skincare-main-61e24b.png'}
              alt={image?.alt ?? 'Natural skincare ingredients'}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
