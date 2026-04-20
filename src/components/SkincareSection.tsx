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
      <div className="w-full px-6 pb-16 pt-[80px] sm:px-10 sm:pt-[100px] lg:px-[6.94%] lg:pb-20 lg:pt-[125px]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[55fr_45fr]">
          <div>
            <h2
              className="mb-5 font-['Cormorant_Garamond'] font-bold leading-[1.21] text-black lg:max-w-[387px]"
              style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}
            >
              {heading}
            </h2>
            <p
              className="mb-8 font-['Inter'] leading-[1.21] lg:mb-[60px] lg:max-w-[601px]"
              style={{
                fontSize: 'clamp(15px, 1.4vw, 20px)',
                color: 'rgba(0,0,0,0.65)',
              }}
            >
              {body ||
                'Where science meets nature for visibly renewed skin. Selected Skin Care uses plant stem cells and advanced formulations to support collagen, improve elasticity, and enhance overall skin health. Designed to restore balance and reveal a smoother, more radiant complexion. Simple, effective, results-driven.'}
            </p>
            <Link
              href="/shop/skincare"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#627E5C] px-[30px] py-[10px] font-['Inter'] font-medium text-white transition-opacity hover:opacity-90"
              style={{ fontSize: 'clamp(15px, 1.2vw, 20px)' }}
            >
              {cta}
            </Link>
          </div>

          <div className="mt-6 lg:mt-0">
            <div
              className="relative w-full overflow-hidden rounded-[20px] bg-amber-50"
              style={{ aspectRatio: '608/538' }}
            >
              <Image
                src={image?.url ?? '/skincare-main-61e24b.png'}
                alt={image?.alt ?? 'Natural skincare ingredients'}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
