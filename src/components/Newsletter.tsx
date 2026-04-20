interface NewsletterProps {
  heading: string
  subtext: string
  backgroundImage?: { url: string } | null
}
export default function Newsletter({ heading, subtext, backgroundImage }: NewsletterProps) {
  const bgSrc = backgroundImage?.url ?? '/newsletterimage.png'

  return (
    <section className="relative w-full overflow-hidden bg-[#F5F1E8]">
      <img src={bgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'rgba(245,241,232,0.79)' }} />
      <div className="relative z-10 flex w-full min-h-[240px] flex-col items-center justify-center px-6 py-14 text-center sm:px-10 sm:min-h-[280px] lg:min-h-[320px] lg:py-0 lg:px-[6.94%]">
        <h2
          className="font-['Cormorant_Garamond'] font-bold text-[#6F5845]"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 50px)',
            lineHeight: '0.86em',
          }}
        >
          {heading}
        </h2>
        <p
          className="mx-auto mt-5 max-w-[444px] font-['Inter'] font-normal leading-[1.21] text-black"
          style={{ fontSize: 'clamp(14px, 1.4vw, 20px)' }}
        >
          {subtext}
        </p>
      </div>
    </section>
  )
}
