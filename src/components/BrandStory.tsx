import Image from 'next/image'

interface BrandStoryProps {
  heading: string
  body: string
  image?: { url: string; alt: string } | null
}

export default function BrandStory({ heading, body, image }: BrandStoryProps) {
  return (
    <section className="bg-[#F5F1E8] py-20">
      <div className="mx-auto w-full max-w-[1440px] px-[1px]">
        <div className="relative h-[651px] overflow-hidden">
          <Image src="/market-bg.png" alt="Market background" fill className="object-cover" />
          <Image
            src="/logo1.png"
            alt=""
            width={427}
            height={200}
            className="absolute bottom-0 left-0 opacity-10"
          />
          <div className="absolute left-[100px] top-[130px] max-w-[536px]">
            <h2 className="font-['Cormorant_Garamond'] text-[40px] font-bold leading-[1.21] text-black">
              The Expanding Health-Conscious Consumer Market
            </h2>
            <p className="mt-4 max-w-[632px] text-[20px] leading-[1.21] text-black/70">
              An increasing focus on mental health and wellness with at-home natural remedies,
              combined with a significant rise in the preferer for spa therapies due to hectic
              lifestyles, drives the demand for health-conscious and organic products.
            </p>
          </div>
          <div className="absolute left-[100px] top-[418px]">
            <button className="rounded-full bg-[#627E5C] px-[80px] py-[10px] text-[20px] font-medium text-white">
              Learn More
            </button>
          </div>
        </div>

        <div className="relative h-[677px] overflow-hidden bg-[#F5F1E8]">
          <div className="absolute left-0 top-[59px] h-[618px] w-[974px] rounded-br-[40px] bg-[#F5F1E8]" />
          <div className="absolute right-0 top-0 h-[610px] w-[703px] overflow-hidden rounded-l-[40px]">
            <Image
              src={image?.url ?? '/experience-image.png'}
              alt={image?.alt ?? 'Experience VitaliTea'}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="absolute left-[101px] top-[243px] max-w-[399px] font-['Cormorant_Garamond'] text-[50px] font-bold leading-[1.21] text-black">
            {heading}
          </h3>
          <p className="absolute left-[101px] top-[303px] max-w-[512px] text-[20px] leading-[1.21] text-black/70">
            {body}
          </p>
        </div>

        <div className="relative h-[856px] bg-[#F5F1E8]">
          <div className="pt-[90px] text-center">
            <h3 className="font-['Cormorant_Garamond'] text-[40px] font-bold text-black">
              Why Choose VitaliTea Wellness
            </h3>
            <p className="mx-auto mt-[20px] max-w-[932px] text-[20px] leading-[1.21] text-black/70">
              Vitalitea Wellness is designed around a complete lifestyle, supporting your body,
              mind, and environment through intentional rituals. From restoring and relaxing to
              grounding and movement, each product works together to help you feel balanced,
              renewed, and aligned.
            </p>
          </div>

          <div className="mx-auto mt-14 flex w-[1240px] items-start gap-5">
            <div className="w-[379px] overflow-hidden rounded-[20px]">
              <div className="relative h-[346px]">
                <Image
                  src="/why-skincare-tea.png"
                  alt="Skincare & Teas"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="h-[93px] bg-[#627E5C] pt-5 text-center">
                <p className="font-['Cormorant_Garamond'] text-[20px] font-bold text-white">
                  Skincare & Teas
                </p>
                <p className="text-[14px] leading-[100%] text-white/80">
                  Nourish and renew your body and skin from within.
                </p>
              </div>
            </div>

            <div className="w-[441px] overflow-hidden rounded-[20px]">
              <div className="relative h-[346px]">
                <Image
                  src="/why-candles.png"
                  alt="Candles & Essential Oils"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="h-[93px] bg-[#627E5C] pt-5 text-center">
                <p className="font-['Cormorant_Garamond'] text-[20px] font-bold text-white">
                  Candles & Essential Oils
                </p>
                <p className="text-[16px] leading-[100%] text-white/80">
                  Create a calm, sensory space that restores balance
                </p>
              </div>
            </div>

            <div className="w-[379px] overflow-hidden rounded-[20px]">
              <div className="relative h-[346px]">
                <Image
                  src="/why-yoga.png"
                  alt="Yoga mats and activewear"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="h-[93px] bg-[#627E5C] pt-5 text-center">
                <p className="font-['Cormorant_Garamond'] text-[20px] font-bold text-white">
                  Yoga mat, Towels, and Activewear
                </p>
                <p className="text-[14px] leading-[100%] text-white/80">
                  Nourish and renew your body and skin from within.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
