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
    <section className="relative bg-[#F5F1E8] py-20 pt-[125px]">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[100px]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[55fr_45fr]">
          {/* Text — always first visually */}
          <div className="order-1">
            <h2 className="mb-6 max-w-[387px] font-['Cormorant_Garamond'] text-[40px] font-bold leading-[1.21] text-black">
              {heading}
            </h2>
            <p className="mb-10 lg:mb-[114px] max-w-[601px] font-['Inter'] text-[20px] leading-[1.21] text-black/65">
              {body ||
                'Where science meets nature for visibly renewed skin. Selected Skin Care uses plant stem cells and advanced formulations to support collagen, improve elasticity, and enhance overall skin health. Designed to restore balance and reveal a smoother, more radiant complexion. Simple, effective, results-driven.'}
            </p>
            <Link
              href="/shop/skincare"
              className="inline-flex h-[44px] min-w-[240px] items-center justify-center whitespace-nowrap rounded-full bg-[#627E5C] px-[30px] font-['Inter'] text-[20px] font-medium text-white"
            >
              {cta}
            </Link>
          </div>

          {/* Image — below text on mobile (order-2), right column on desktop */}
          <div className="order-2 flex justify-end mt-10 lg:mt-0">
            <div className="relative w-full overflow-hidden rounded-[20px] bg-amber-50 aspect-[608/538]">
              {image?.url ? (
                <Image src={image.url} alt={image.alt} fill className="object-cover" />
              ) : (
                <Image
                  src="/honey.png"
                  alt="Natural skincare ingredients"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Image
        src="/logo1.png"
        alt=""
        width={493}
        height={232}
        aria-hidden="true"
        className="pointer-events-none absolute hidden xl:block"
        style={{ bottom: '60px', right: '20px', opacity: 0.12 }}
      />
    </section>
  )
}
