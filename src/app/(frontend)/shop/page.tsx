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

export default async function Shop() {
  const products = await getProducts()
  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-[#F5F1E8]">
      <section className="w-full pt-6 pb-4 sm:pt-8 sm:pb-6 lg:pt-10">
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
      {/* <section className="w-full bg-[#F5F1E8] px-4 sm:px-6 lg:px-[6.94%] 2xl:px-[3%]">
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
      </section>  */}
      <section className="w-full py-10 sm:py-12 lg:py-16">
        <div className="app-container grid w-full min-w-0 max-w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0 order-2 flex flex-col justify-center lg:order-1">
            <h2
              className="w-full min-w-0 max-w-2xl pb-2 font-['Cormorant_Garamond'] font-bold leading-tight tracking-normal text-black"
              style={{ fontSize: 'clamp(1.5rem,2.8vw,2.5rem)' }}
            >
              The Expanding Health-Conscious Consumer Market
            </h2>
            <p
              className="mt-4 w-full min-w-0 max-w-2xl pb-4 font-['Host_Grotesk'] font-normal leading-relaxed tracking-normal text-black/50"
              style={{ fontSize: 'clamp(0.875rem,1.4vw,1.25rem)' }}
            >
              An increasing focus on mental health and wellness with at-home natural remedies,
              combined with a significant rise in the preference for spa therapies due to hectic
              lifestyles, drives the demand for health-conscious and organic products.
            </p>
            <button
              type="button"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#627E5C] px-8 py-2.5 font-['Host_Grotesk'] font-medium text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-10 lg:px-16"
              style={{ fontSize: 'clamp(0.875rem,1.11vw,1rem)' }}
            >
              Learn More
            </button>
          </div>
          <div className="order-1 min-w-0 lg:order-2">
            <div className="relative aspect-[676/651] w-full min-h-0 overflow-hidden ">
              <Image
                src="/selectedtranquil.png"
                alt="Tranquil body butter product in spa setting"
                fill
                className="object-cover object-right"
                sizes="(min-width: 1024px) min(50vw, 45rem), 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      <Testimonials testimonials={FALLBACK} />
    </div>
  )
}
