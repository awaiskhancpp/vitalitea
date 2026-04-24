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
    <div className="bg-[#F5F1E8] w-full">
      <section className="pt-10 px-6 pb-4 lg:px-25 ">
        <div className="mx-auto max-w-310">
          <div className="relative overflow-hidden rounded-[27px] border border-[#A3A3A3]">
            {/* Background Image */}
            <div className="relative h-55 sm:h-70 lg:h-88.75 w-full">
              <Image
                src="/shopbanner.png"
                alt="Shop"
                fill
                className="object-cover object-right"
                priority
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#F5F1E8] via-[#F5F1E8]/80 to-transparent" />

            {/* Content */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 max-w-93">
              <h1 className="font-bold text-[#6F5845] text-[clamp(32px,5vw,64px)] leading-none">
                Shop
              </h1>
              <p className="mt-3 text-[#737373] text-[clamp(14px,2vw,20px)] leading-[1.4]">
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
      <section className="w-full pl-4 sm:pl-20">
        <div className="grid grid-cols-12">
          <div className="col-span-7 flex flex-col justify-center">
            <h1
              className="font-['Cormorant_Garamond']
              font-bold
              leading-none
              tracking-normal
              text-[clamp(28px,3vw,40px)]
              max-w-122.5
              pb-2
            "
            >
              The Expanding Health-Conscious Consumer Market
            </h1>
            <p
              className="font-['Host_Grotesk']
              font-normal
              leading-none
              tracking-normal
              text-[clamp(15px,1.4vw,20px)]
              text-black/50
              max-w-158
              pb-4"
            >
              An increasing focus on mental health and wellness with at-home natural remedies,
              combined with a significant rise in the preferer for spa therapies due to hectic
              lifestyles, drives the demand for health-conscious and organic products.
            </p>
            <button
              className="inline-flex items-center justify-center
              rounded-full
              bg-[#627E5C]
              px-8 lg:px-16
              py-2.5
              gap-2
              text-white
              text-sm lg:text-base
              font-medium
              transition-opacity hover:opacity-90 w-66"
            >
              Learn More
            </button>
            {/* <Image src="/footer-logo.png" alt="VitaliTea" width={427} height={200} /> */}
          </div>
          <Image
            src="/selectedtranquil.png"
            alt="Tranquil body butter product in spa setting"
            className="col-span-5 object-cover object-center justify-right"
            width={676}
            height={651}
          />
        </div>
      </section>

      <Testimonials testimonials={FALLBACK} />
    </div>
  )
}
