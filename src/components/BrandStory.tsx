import Image from 'next/image'

interface BrandStoryProps {
  heading: string
  body: string
  image?: { url: string; alt: string } | null
}

export default function BrandStory({ heading, body, image }: BrandStoryProps) {
  return (
    <section className="bg-[#F5F1E8] py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[100px]">
        {/* Top: text left, image right */}
        <div className="relative flex min-h-[500px] overflow-hidden rounded-br-[40px]">
          <div className="relative z-10 flex flex-col justify-center py-16 pr-8 lg:w-[55%]">
            <h3 className="max-w-[399px] font-['Cormorant_Garamond'] text-[40px] lg:text-[50px] font-bold leading-[1.21] text-black">
              {heading}
            </h3>
            <p className="mt-6 max-w-[512px] text-[18px] lg:text-[20px] leading-[1.4] text-black/70">
              {body}
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-[45%] overflow-hidden rounded-l-[40px]">
            <Image
              src={image?.url ?? '/experience-image.png'}
              alt={image?.alt ?? 'Experience VitaliTea'}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Market section */}
        <div className="relative mt-6 min-h-[500px] overflow-hidden rounded-[20px]">
          <Image src="/market-bg.png" alt="Market background" fill className="object-cover" />
          <Image
            src="/logo1.png"
            alt=""
            width={427}
            height={200}
            className="absolute bottom-0 left-0 opacity-10"
          />
          <div className="relative z-10 px-6 lg:px-[100px] py-[130px]">
            <h2 className="max-w-[536px] font-['Cormorant_Garamond'] text-[32px] lg:text-[40px] font-bold leading-[1.21] text-black">
              The Expanding Health-Conscious Consumer Market
            </h2>
            <p className="mt-4 max-w-[632px] text-[18px] lg:text-[20px] leading-[1.4] text-black/70">
              An increasing focus on mental health and wellness with at-home natural remedies...
            </p>
            <button className="mt-8 rounded-full bg-[#627E5C] px-[80px] py-[10px] text-[20px] font-medium text-white">
              Learn More
            </button>
          </div>
        </div>

        {/* Why Choose section */}
        <div className="bg-[#F5F1E8] py-[90px]">
          <div className="text-center">
            <h3 className="font-['Cormorant_Garamond'] text-[40px] font-bold text-black">
              Why Choose VitaliTea Wellness
            </h3>
            <p className="mx-auto mt-5 max-w-[932px] text-[18px] lg:text-[20px] leading-[1.4] text-black/70">
              Vitalitea Wellness is designed around a complete lifestyle...
            </p>
          </div>
          <div className="mx-auto mt-14 flex w-full max-w-[1240px] flex-wrap items-start gap-5">
            {[
              {
                src: '/why-skincare-tea.png',
                label: 'Skincare & Teas',
                sub: 'Nourish and renew your body and skin from within.',
              },
              {
                src: '/why-candles.png',
                label: 'Candles & Essential Oils',
                sub: 'Create a calm, sensory space that restores balance',
              },
              {
                src: '/why-yoga.png',
                label: 'Yoga mat, Towels, and Activewear',
                sub: 'Nourish and renew your body and skin from within.',
              },
            ].map((item) => (
              <div key={item.label} className="flex-1 min-w-[280px] overflow-hidden rounded-[20px]">
                <div className="relative aspect-[4/3]">
                  <Image src={item.src} alt={item.label} fill className="object-cover" />
                </div>
                <div className="bg-[#627E5C] py-5 text-center">
                  <p className="font-['Cormorant_Garamond'] text-[20px] font-bold text-white">
                    {item.label}
                  </p>
                  <p className="text-[14px] leading-[1.4] text-white/80">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
