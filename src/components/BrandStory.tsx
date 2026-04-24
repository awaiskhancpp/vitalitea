import Image from 'next/image'

/**
 * Layout references from Figma `4151:2` (cached exports; live API may 429):
 * Experience desktop: band min-height 677, image 703×610 @ ~51.25% width, copy pl ~6.94%, title ~40px, body 20px.
 * Experience mobile stack: image aspect 703/610, rounded 20px 0 0 20px; copy gutters align with px-page.
 * Market: `aspect-[1440/651]` band; photo as CSS `background-image`; copy left. Learn More sits on a `flex-1` spacer with `padding-bottom` ≈ logo bitmap height so the pill aligns with the watermark leaves (logo 427×200, bottom-left).
 * Why Choose cards: image areas 379×346 | 441×402 | 379×346; green bars ~93 / 96 / 93 px.
 */
interface BrandStoryProps {
  heading: string
  body: string
  image?: { url: string; alt: string } | null
}

const DEFAULT_BODY =
  "Our daily lives are non-stop and hectic. It's time to stop and relax. VitaliTea's unique store has full sense experience features and products that indulge all five senses, revitalizing, relaxing, and transporting you to another place."

const WHY = [
  {
    src: '/why-skincare-tea.png',
    label: 'Skincare & Teas',
    sub: 'Nourish and renew your body and skin from within.',
    imageAspect: 379 / 346,
    titleClass:
      "font-['Cormorant_Garamond'] text-[20px] font-bold text-white md:text-[20px] lg:text-[20px]",
    subClass: "font-['Inter'] text-[14px] leading-[1.21]",
    barMinH: 'min-h-[93px]',
  },
  {
    src: '/why-candles.png',
    label: 'Candles & Essential Oils',
    sub: 'Create a calm, sensory space that restores balance',
    imageAspect: 441 / 402,
    titleClass:
      "font-['Cormorant_Garamond'] text-[20px] font-bold text-white md:text-[22px] lg:text-[24px]",
    subClass: "font-['Inter'] text-[14px] leading-[1.21] md:text-[15px] lg:text-[16px]",
    barMinH: 'min-h-[96px]',
  },
  {
    src: '/why-yoga.png',
    label: 'Yoga mat, Towels, and Activewear',
    sub: 'Nourish and renew your body and skin from within.',
    imageAspect: 379 / 346,
    titleClass:
      "font-['Cormorant_Garamond'] text-[20px] font-bold text-white md:text-[20px] lg:text-[20px]",
    subClass: "font-['Inter'] text-[14px] leading-[1.21]",
    barMinH: 'min-h-[93px]',
  },
] as const

const MARKET_BG_URL = '/market-bg.png'

/** Logo watermark is 427×200; leaves peak near the top of the bitmap. Match button to that line. */
const MARKET_COPY_BOTTOM_PAD = 'max(1rem, calc(min(100vw, 427px) * 200 / 427 - 6px))'

export default function BrandStory({ heading, body, image }: BrandStoryProps) {
  const expImg = image?.url ?? '/experience-image.png'
  const expAlt = image?.alt ?? 'Experience VitaliTea'
  const expBody = body || DEFAULT_BODY

  return (
    <>
      <section className="relative bg-[#F5F1E8] pb-10 sm:pb-16 lg:pb-[125px]">
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
              type="button"
              className="mt-6 rounded-full bg-[#627E5C] px-8 py-2.5 font-['Inter'] font-medium text-white transition-opacity hover:opacity-90 sm:px-10"
              style={{ fontSize: 'clamp(0.875rem,1.11vw,1rem)' }}
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

        <div
          className="relative mx-auto hidden w-full max-w-[1440px] lg:block"
          style={{ minHeight: 677 }}
        >
          <div
            className="absolute inset-y-0 overflow-hidden"
            style={{
              left: '51.25%',
              right: 0,
              borderRadius: '20px 0 0 20px',
            }}
          >
            <Image
              src={expImg}
              alt={expAlt}
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 50vw, 0"
            />
          </div>
          <div
            className="relative z-10 flex min-w-0 max-w-full flex-col"
            style={{
              width: '51.25%',
              paddingLeft: '6.94%',
              paddingTop: 'clamp(8rem, 12.2vw, 15.2rem)',
              paddingBottom: 'clamp(3rem, 6.1vw, 7.9rem)',
            }}
          >
            <h3
              className="min-w-0 max-w-full font-['Cormorant_Garamond'] font-bold text-black"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 3.125rem)', lineHeight: '1.21em' }}
            >
              {heading}
            </h3>
            <p
              className="mt-1 min-w-0 max-w-md font-['Inter'] leading-[1.21] sm:max-w-lg lg:max-w-lg"
              style={{ fontSize: 'clamp(0.875rem, 1.39vw, 1.25rem)', color: 'rgba(0,0,0,0.7)' }}
            >
              {expBody}
            </p>
            <button
              type="button"
              className="mt-8 w-fit min-w-0 max-w-full rounded-full bg-[#627E5C] px-8 py-2.5 font-['Inter'] font-medium text-white transition-opacity hover:opacity-90 sm:px-12 lg:px-20"
              style={{ fontSize: 'clamp(0.875rem, 1.39vw, 1.25rem)' }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-[#F5F1E8] pt-8 sm:pt-12 lg:pt-16">
        <div className="relative aspect-[1440/651] w-full min-h-0 max-w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-[center_40%] bg-no-repeat sm:bg-center"
            style={{ backgroundImage: `url(${MARKET_BG_URL})` }}
            aria-hidden
          />
          <div className="pointer-events-none absolute bottom-0 left-0 z-[1] w-[min(100%,27rem)] max-w-[40%] opacity-[0.09]">
            <Image
              src="/logo1.png"
              alt=""
              width={427}
              height={200}
              className="h-auto w-full object-contain object-left-bottom"
            />
          </div>
          <div className="absolute inset-0 z-10 flex min-h-0 w-full min-w-0 sm:px-20">
            <div
              className="app-container flex h-full min-h-0 w-full min-w-0 max-w-full flex-col items-start justify-start pt-10 text-left sm:pt-12 lg:pt-[min(5.625rem,6.25vw)]"
              style={{ paddingBottom: MARKET_COPY_BOTTOM_PAD }}
            >
              <h2
                className="max-w-full font-['Cormorant_Garamond']  pt-4 font-bold leading-[1.21] text-black sm:max-w-lg sm:pt-6 lg:max-w-[min(100%,33.5rem)]"
                style={{ fontSize: 'clamp(1.5rem, 2.78vw, 2.5rem)' }}
              >
                The Expanding Health-Conscious Consumer Market
              </h2>
              <p
                className="mt-4 max-w-full font-['Inter'] leading-[1.21] sm:max-w-xl lg:max-w-[39.5rem]"
                style={{ fontSize: 'clamp(0.875rem, 1.39vw, 1.25rem)', color: 'rgba(0,0,0,0.7)' }}
              >
                An increasing focus on mental health and wellness with at-home natural remedies,
                combined with a significant rise in the preference for spa therapies due to hectic
                lifestyles, drives the demand for health-conscious and organic products.
              </p>
              <div className="min-h-2 w-full flex-1" aria-hidden />
              <button
                type="button"
                className="w-fit min-w-0 max-w-full shrink-0 rounded-full bg-[#627E5C] px-8 py-2.5 font-['Inter'] font-medium text-white transition-opacity hover:opacity-90 sm:px-10 lg:px-20"
                style={{ fontSize: 'clamp(0.875rem, 1.39vw, 1.25rem)' }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose — Figma image ratios; md+ uses staggered row like desktop */}
      <section className="bg-[#F5F1E8] pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-[clamp(3rem,8.7vw,7.8rem)]">
        <div className="app-container w-full">
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
          <div className="mt-12 hidden items-end gap-3 min-[900px]:gap-4 lg:gap-5 md:flex">
            {WHY.map((item, idx) => (
              <div
                key={item.label}
                className={`min-w-0 overflow-hidden rounded-[20px] ${idx === 1 ? 'md:-mt-6 lg:-mt-7' : ''} ${idx === 0 ? 'md:flex-[379]' : idx === 1 ? 'md:flex-[441]' : 'md:flex-[379]'}`}
              >
                <div className="relative w-full" style={{ aspectRatio: item.imageAspect }}>
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </div>
                <div
                  className={`flex flex-col items-center justify-center bg-[#627E5C] px-4 text-center ${item.barMinH}`}
                >
                  <p className={item.titleClass}>{item.label}</p>
                  <p className={`mt-1 ${item.subClass}`} style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 md:hidden">
            {WHY.map((item) => (
              <div key={item.label} className="overflow-hidden rounded-[20px]">
                <div className="relative w-full" style={{ aspectRatio: item.imageAspect }}>
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                <div
                  className={`flex flex-col items-center justify-center bg-[#627E5C] px-4 py-5 text-center ${item.barMinH}`}
                >
                  <p className={item.titleClass}>{item.label}</p>
                  <p className={`mt-1 ${item.subClass}`} style={{ color: 'rgba(255,255,255,0.5)' }}>
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
