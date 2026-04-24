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
      <div className="app-container flex w-full max-w-full flex-col gap-0 py-10 sm:py-12 md:flex-row md:items-stretch md:py-14 lg:items-stretch lg:py-16">
        <div className="order-2 w-full min-w-0 pt-0 md:order-1 md:flex md:w-1/2 md:flex-col md:justify-center md:pr-4 md:pt-0 lg:w-[min(52%,32rem)] lg:max-w-2xl lg:pr-8 lg:py-0">
          <h2
            className="mb-5 w-full min-w-0 max-w-md font-['Cormorant_Garamond'] font-bold leading-[1.21] text-black"
            style={{ fontSize: 'clamp(1.5rem, 2.78vw, 2.5rem)' }}
          >
            {heading}
          </h2>
          <p
            className="mb-8 w-full min-w-0 max-w-2xl font-['Inter'] leading-[1.21] md:mb-10 lg:mb-14"
            style={{
              fontSize: 'clamp(0.875rem, 1.39vw, 1.25rem)',
              color: 'rgba(0,0,0,0.65)',
            }}
          >
            {body ||
              'Where science meets nature for visibly renewed skin. Selected Skin Care uses plant stem cells and advanced formulations to support collagen, improve elasticity, and enhance overall skin health. Designed to restore balance and reveal a smoother, more radiant complexion. Simple, effective, results-driven.'}
          </p>
          <Link
            href="/shop/skincare"
            className="inline-flex w-full max-w-xs items-center justify-center whitespace-nowrap rounded-full bg-[#627E5C] px-[clamp(1.25rem,2.1vw,1.875rem)] py-2.5 font-['Inter'] font-medium text-white transition-opacity hover:opacity-90 sm:w-auto"
            style={{ fontSize: 'clamp(0.875rem, 1.39vw, 1.25rem)' }}
          >
            {cta}
          </Link>
        </div>

        <div className="order-1 w-full min-w-0 md:order-2 md:w-1/2 md:self-stretch md:pl-2 lg:max-w-2xl lg:pl-4">
          <div
            className="relative w-full min-w-0 overflow-hidden rounded-[20px] bg-amber-50"
            style={{ aspectRatio: '608/538' }}
          >
            <Image
              src={image?.url ?? '/skincare-main-61e24b.png'}
              alt={image?.alt ?? 'Natural skincare ingredients'}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) min(42vw, 600px), (min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
