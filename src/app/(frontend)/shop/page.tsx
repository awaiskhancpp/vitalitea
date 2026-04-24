import Image from 'next/image'
import { getProducts } from '@/lib/payload'
import ShopClient from '@/components/ShopClient'
import Testimonials from '@/components/Testimonials'

interface Testimonial {
  id: string | number
  author: string
  quote: string
  rating: string | number
}

const FALLBACK: Testimonial[] = [
  {
    id: '1',
    author: 'Sarah M.',
    quote:
      "VitaliTea has completely transformed my morning ritual. The teas are incredible and the skincare line is unlike anything I've tried before.",
    rating: '5',
  },
  {
    id: '2',
    author: 'James K.',
    quote:
      "I've been using the Zen Skincare line for 3 months and my skin has never looked better. Highly recommend!",
    rating: '5',
  },
  {
    id: '3',
    author: 'Priya L.',
    quote:
      'The candles and essential oils create the perfect atmosphere for yoga and meditation. Love this brand.',
    rating: '5',
  },
]

const cormorant = 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif' as const
const grotesk = 'var(--font-grotesk), "Host Grotesk", system-ui, sans-serif' as const

export default async function Shop() {
  const products = await getProducts()
  return (
    <div className="w-full min-h-screen bg-[#F5F1E8]">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-12 sm:gap-16 lg:gap-20">
        {/*
         * Hero matches Figma frame 1240×355 (border #A3A3A3, radius 27).
         * At 1440px width: 6.94% gutters → 100px + 1240 + 100.
         * Responsive: keep 1240/355 on md+; below md use min-height + image cover so
         * copy never sits on a paper-thin strip; overlay gradient strength scales with breakpoint.
         */}
        <section className="mt-6 px-4 sm:mt-10 sm:px-6 lg:mt-[50px] lg:px-[6.94%] 2xl:px-[3%]">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="relative w-full overflow-hidden rounded-[20px] border border-[#A3A3A3] bg-[#F5F1E8] sm:rounded-[24px] lg:rounded-[27px]">
              <div className="relative w-full min-h-[220px] aspect-[1240/355] sm:min-h-[260px] lg:aspect-auto lg:h-[355px] lg:min-h-0">
                <Image
                  src="/shopbanner.png"
                  alt="Shop"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1280px) 100vw, 1240px"
                  priority
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F5F1E8] from-[28%] via-[rgba(245,241,232,0.8)] via-[45%] to-transparent to-[68%] sm:from-[32%] sm:via-[48%] sm:to-[70%] lg:from-[30%] lg:via-[rgba(245,241,232,0.75)] lg:via-[50%] lg:to-transparent lg:to-[72%]" />
              <div
                className="absolute inset-x-4 bottom-5 max-w-[min(100%,372px)] sm:inset-x-7 sm:bottom-7 sm:max-w-[min(calc(100%-3.5rem),372px)] md:bottom-8 md:left-8 md:right-auto md:top-1/2 md:w-[min(calc(100%-4rem),372px)] md:-translate-y-1/2 lg:inset-x-auto lg:bottom-auto lg:left-[12.7%] lg:top-1/2 lg:w-[372px] lg:-translate-y-1/2"
                /* 12.7% of 1240 ≈ 157px Figma x-offset; vertically centered in 355px frame on lg+ */
              >
                <h1
                  className="max-w-[372px] font-bold leading-none tracking-[0] text-[#6F5845]"
                  style={{
                    fontFamily: cormorant,
                    fontSize: 'clamp(2.25rem, 6.5vw, 4rem)',
                    /* 4rem = 64px at default root — matches Figma H1 on desktop */
                  }}
                >
                  Shop
                </h1>
                <p
                  className="mt-2.5 max-w-[372px] font-normal leading-[1.4] tracking-[0] sm:mt-3 text-[#737373]"
                  style={{
                    fontFamily: grotesk,
                    fontSize: 'clamp(0.9375rem, 2.2vw, 1.25rem)',
                    /* 1.25rem = 20px subcopy */
                  }}
                >
                  This is where you can browse products
                  <br />
                  in this store.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full">
          <ShopClient products={products} />
        </div>
      </div>
      <section className="w-full bg-[#F5F1E8] px-4 sm:px-6 lg:px-[6.94%] 2xl:px-[3%]">
        <div className="mx-auto flex w-full max-w-[min(100%,100rem)] flex-col lg:min-h-[min(651px,85vh)] lg:flex-row lg:items-stretch">
          <div className="relative flex w-full flex-col justify-center bg-[#F5F1E8] px-4 py-10 sm:px-6 sm:py-12 lg:w-[min(53%,764px)] lg:max-w-[764px] lg:flex-shrink-0 lg:px-0 lg:py-0 xl:w-[764px]">
            <div className="lg:pl-[clamp(1.5rem,6.94vw,100px)] lg:pt-[clamp(2rem,10vw,130px)]">
              <h2 className="max-w-[490px] font-['Cormorant_Garamond'] text-[clamp(1.625rem,4.2vw,2.5rem)] font-bold leading-tight tracking-[0%] text-black">
                The Expanding Health-Conscious Consumer Market
              </h2>

              <p
                className="mt-6 max-w-[632px] font-['Host_Grotesk'] text-[clamp(1rem,2.2vw,1.25rem)] font-normal leading-snug tracking-[0%]"
                style={{ color: '#00000085' }}
              >
                An increasing focus on mental health and wellness with at-home natural remedies,
                combined with a significant rise in the preferer for spa therapies due to hectic
                lifestyles, drives the demand for health-conscious and organic products.
              </p>

              <button
                type="button"
                className="mt-8 box-border min-h-[47px] w-full max-w-[264px] rounded-full border-0 bg-[#627E5C] px-8 py-2.5 text-center font-['Host_Grotesk'] text-[16px] font-medium text-white sm:px-20"
                style={{ letterSpacing: '0%' }}
              >
                Learn More
              </button>
            </div>

            <div className="pointer-events-none relative mx-auto mt-10 w-full max-w-[min(100%,427px)] opacity-[0.27] sm:mx-0 lg:absolute lg:bottom-0 lg:left-[clamp(1.5rem,6.94vw,100px)] lg:mt-0 lg:max-w-[427px] xl:left-[100px]">
              <Image
                src="/footer-logo.png"
                alt="VitaliTea"
                width={427}
                height={200}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="relative w-full min-w-0 flex-1 bg-[#F5F1E8] min-h-[min(50vh,420px)] sm:min-h-[420px] lg:min-h-[min(651px,85vh)]">
            <Image
              src="/selectedtranquil.png"
              alt="Tranquil body butter product in spa setting"
              fill
              className="object-cover object-center sm:object-right"
              priority
            />
          </div>
        </div>
      </section>

      <Testimonials testimonials={FALLBACK} />
    </div>
  )
}
