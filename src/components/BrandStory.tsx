import Image from 'next/image'

interface BrandStoryProps {
  heading: string
  body: string
  image?: { url: string; alt: string } | null
}

const DEFAULT_BODY =
  "Our daily lives are non-stop and hectic. It's time to stop and relax. VitaliTea's unique store has full sense experience features and products that indulge all five senses, revitalizing, relaxing, and transporting you to another place."

export default function BrandStory({ heading, body, image }: BrandStoryProps) {
  const expImg = image?.url ?? '/experience-image.png'
  const expAlt = image?.alt ?? 'Experience VitaliTea'
  const expBody = body || DEFAULT_BODY

  return (
    <>
      <section className="relative bg-[#F5F1E8] pb-[60px] sm:pb-[80px] lg:pb-[125px]">
        <div className="lg:hidden">
          <div className="px-6 pt-[60px] pb-10 sm:px-10 sm:pt-[100px] sm:pb-14">
            <h3
              className="font-['Cormorant_Garamond'] font-bold leading-[1.21] text-black"
              style={{ fontSize: 'clamp(28px, 3.5vw, 50px)' }}
            >
              {heading}
            </h3>
            <p
              className="mt-4 font-['Inter'] leading-[1.21]"
              style={{ fontSize: 'clamp(15px, 1.39vw, 20px)', color: 'rgba(0,0,0,0.7)' }}
            >
              {expBody}
            </p>
            <button
              className="mt-6 rounded-full bg-[#627E5C] font-['Inter'] text-[16px] font-medium text-white transition-opacity hover:opacity-90"
              style={{ padding: '10px 40px' }}
            >
              Learn More
            </button>
          </div>
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: '703 / 610',
              borderRadius: '20px 0 0 20px',
            }}
          >
            <Image src={expImg} alt={expAlt} fill className="object-cover object-center" />
          </div>
        </div>

        <div className="hidden w-full lg:block" style={{ minHeight: 677 }}>
          <div
            className="absolute inset-y-0 overflow-hidden"
            style={{
              left: '51.25%',
              right: 0,
              borderRadius: '20px 0 0 20px',
            }}
          >
            <Image src={expImg} alt={expAlt} fill className="object-cover object-center" />
          </div>
          <div
            className="relative z-10 flex flex-col"
            style={{
              width: '51.25%',
              paddingLeft: '6.94%',
              paddingTop: 243,
              paddingBottom: 127,
            }}
          >
            <h3
              className="font-['Cormorant_Garamond'] font-bold text-black"
              style={{ fontSize: 'clamp(36px, 3.5vw, 50px)', lineHeight: '1.21em' }}
            >
              {heading}
            </h3>
            <p
              className="mt-1 font-['Inter'] text-[20px] leading-[1.21]"
              style={{ color: 'rgba(0,0,0,0.7)', maxWidth: 512 }}
            >
              {expBody}
            </p>
            <button
              className="mt-8 w-fit rounded-full bg-[#627E5C] font-['Inter'] text-[20px] font-medium text-white transition-opacity hover:opacity-90"
              style={{ padding: '10px 80px' }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-[#F5F1E8] lg:pt-20 min-h-[480px] sm:min-h-[560px]">
        <Image
          src="/market-bg.png"
          alt="Market background"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute bottom-0 left-0 z-0 opacity-[0.09]">
          <Image src="/logo1.png" alt="" width={427} height={200} />
        </div>
        <div className="relative z-10 w-full px-6 pt-[50px] pb-[80px] sm:px-10 sm:pt-[80px] sm:pb-[120px] lg:px-[6.94%] lg:pt-[130px] lg:pb-[186px]">
          <h2
            className="font-['Cormorant_Garamond'] font-bold leading-[1.21] text-black lg:max-w-[536px]"
            style={{ fontSize: 'clamp(26px, 2.78vw, 40px)' }}
          >
            The Expanding Health-Conscious Consumer Market
          </h2>
          <p
            className="mt-4 font-['Inter'] leading-[1.21] lg:max-w-[632px]"
            style={{ fontSize: 'clamp(15px, 1.39vw, 20px)', color: 'rgba(0,0,0,0.7)' }}
          >
            An increasing focus on mental health and wellness with at-home natural remedies,
            combined with a significant rise in the preference for spa therapies due to hectic
            lifestyles, drives the demand for health-conscious and organic products.
          </p>
          <button
            className="mt-6 rounded-full bg-[#627E5C] font-['Inter'] font-medium text-white transition-opacity hover:opacity-90 lg:mt-20"
            style={{ fontSize: 'clamp(15px, 1.2vw, 20px)', padding: '10px 80px' }}
          >
            Learn More
          </button>
        </div>
      </section>

      <section className="bg-[#F5F1E8] pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-[125px]">
        <div className="w-full px-6 sm:px-10 lg:px-[6.94%]">
          <div className="text-center">
            <h3
              className="font-['Cormorant_Garamond'] font-bold leading-[1.21] text-black"
              style={{ fontSize: 'clamp(26px, 2.78vw, 40px)' }}
            >
              Why Choose VitaliTea Wellness
            </h3>
            <p
              className="mx-auto mt-4 max-w-[932px] font-['Inter'] leading-[1.21] text-black/70"
              style={{ fontSize: 'clamp(14px, 1.4vw, 20px)' }}
            >
              Vitalitea Wellness is designed around a complete lifestyle, supporting your body,
              mind, and environment through intentional rituals. From restoring and relaxing to
              grounding and movement, each product works together to help you feel balanced,
              renewed, and aligned.
            </p>
          </div>
          <div className="mt-12 hidden items-end gap-5 lg:flex">
            <div className="min-w-0 flex-[379] overflow-hidden rounded-[20px]">
              <div className="relative w-full" style={{ aspectRatio: '379/346' }}>
                <Image
                  src="/why-skincare-tea.png"
                  alt="Skincare & Teas"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex min-h-[93px] flex-col items-center justify-center bg-[#627E5C] px-4 text-center">
                <p className="font-['Cormorant_Garamond'] text-[20px] font-bold text-white">
                  Skincare & Teas
                </p>
                <p
                  className="font-['Inter'] text-[14px] leading-[1.21]"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Nourish and renew your body and skin from within.
                </p>
              </div>
            </div>
            <div className="-mt-7 min-w-0 flex-[441] overflow-hidden rounded-[20px]">
              <div className="relative w-full" style={{ aspectRatio: '441/402' }}>
                <Image
                  src="/why-candles.png"
                  alt="Candles & Essential Oils"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex min-h-[96px] flex-col items-center justify-center bg-[#627E5C] px-4 text-center">
                <p className="font-['Cormorant_Garamond'] text-[24px] font-bold text-white">
                  Candles & Essential Oils
                </p>
                <p
                  className="font-['Inter'] text-[16px] leading-[1.21]"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Create a calm, sensory space that restores balance
                </p>
              </div>
            </div>
            <div className="min-w-0 flex-[379] overflow-hidden rounded-[20px]">
              <div className="relative w-full" style={{ aspectRatio: '379/346' }}>
                <Image
                  src="/why-yoga.png"
                  alt="Yoga mat, Towels, and Activewear"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex min-h-[93px] flex-col items-center justify-center bg-[#627E5C] px-4 text-center">
                <p className="font-['Cormorant_Garamond'] text-[20px] font-bold text-white">
                  Yoga mat, Towels, and Activewear
                </p>
                <p
                  className="font-['Inter'] text-[14px] leading-[1.21]"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Nourish and renew your body and skin from within.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:hidden">
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
              <div key={item.label} className="overflow-hidden rounded-[20px]">
                <div className="relative aspect-[4/3]">
                  <Image src={item.src} alt={item.label} fill className="object-cover" />
                </div>
                <div className="bg-[#627E5C] px-4 py-5 text-center">
                  <p className="font-['Cormorant_Garamond'] text-[18px] font-bold text-white">
                    {item.label}
                  </p>
                  <p
                    className="mt-1 font-['Inter'] text-[13px] leading-[1.4]"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
