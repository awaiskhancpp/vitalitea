import Image from 'next/image'
import { getProducts, getTestimonials, getHomepage } from '@/lib/payload'
import { marketSectionWithFallback, testimonialsWithFallback } from '@/lib/homeFallbacks'
import { isPayloadBlobCdnUrl } from '@/lib/cmsUtils'
import ShopClient from '@/components/ShopClient'
import Testimonials from '@/components/Testimonials'

import type { Homepage } from '@/payload-types'

export default async function Shop() {
  const [products, homepageRaw, testimonialDocs] = await Promise.all([
    getProducts(),
    getHomepage(),
    getTestimonials(),
  ])
  const homepage = homepageRaw as Homepage

  const market = marketSectionWithFallback(homepage?.marketSection)
  const testimonials = testimonialsWithFallback(testimonialDocs)

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-[#F5F1E8]">
      <section className="w-full pt-6 pb-4 sm:pt-8 sm:pb-6 lg:pt-30">
        <div className="app-container w-full min-w-0 max-w-full">
          <div className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-[#A3A3A3] sm:rounded-[1.75rem]">
            <div className="relative aspect-[4/3] w-full min-h-[11rem] sm:aspect-[16/7] sm:min-h-[14rem] lg:min-h-[min(20rem,22vw)]">
              <Image
                src="/shopbanner.png"
                alt="Shop"
                fill
                className="object-cover object-right sm:object-center"
                priority
                sizes="(min-width: 1024px) min(100vw, 90rem), 100vw"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F5F1E8] from-15% via-[#F5F1E8]/90 to-transparent to-80%" />
            <div className="absolute left-0 top-0 z-10 flex h-full w-full min-w-0 max-w-full flex-col justify-center p-4 sm:left-0 sm:max-w-[min(100%,24rem)] sm:px-6 sm:py-4 lg:max-w-md lg:pl-8 lg:pr-4">
              <h1
                className="font-['Cormorant_Garamond'] font-bold leading-[1.05] text-[#6F5845]"
                style={{ fontSize: 'clamp(1.5rem,4.4vw,4rem)' }}
              >
                Shop
              </h1>
              <p
                className="mt-2 max-w-sm font-['Inter'] text-[#737373] sm:mt-3"
                style={{ fontSize: 'clamp(0.875rem,1.4vw,1.25rem)', lineHeight: 1.4 }}
              >
                This is where you can browse products in this store.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full">
        <ShopClient products={products} />
      </div>

      <section className="w-full py-10 sm:py-12 lg:py-16">
        <div className="grid w-full min-w-0 max-w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0 order-2 flex flex-col pl-20 justify-center lg:order-1">
            <h2
              className="w-full min-w-0 max-w-2xl pb-2 font-['Cormorant_Garamond'] font-bold leading-tight tracking-normal text-black"
              style={{ fontSize: 'clamp(1.5rem,2.8vw,2.5rem)' }}
            >
              {market.heading}
            </h2>
            <p
              className="mt-4 w-full min-w-0 max-w-2xl pb-4 font-['Host_Grotesk'] font-normal leading-relaxed tracking-normal text-black/50"
              style={{ fontSize: 'clamp(0.875rem,1.4vw,1.25rem)' }}
            >
              {market.body}
            </p>
            <button
              type="button"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#627E5C] px-8 py-2.5 font-['Host_Grotesk'] font-medium text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-10 lg:px-16"
              style={{ fontSize: 'clamp(0.875rem,1.11vw,1rem)' }}
            >
              {market.ctaLabel}
            </button>
          </div>
          <div className="order-1 min-w-0 lg:order-2">
            <div className="relative aspect-[676/651] w-full min-h-0 overflow-hidden ">
              <Image
                src={market.imageUrl}
                alt={market.heading.slice(0, 80)}
                fill
                unoptimized={isPayloadBlobCdnUrl(market.imageUrl)}
                className="object-cover object-right"
                sizes="(min-width: 1024px) min(50vw, 45rem), 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      <Testimonials testimonials={testimonials} />
    </div>
  )
}
