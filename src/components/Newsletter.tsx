interface NewsletterProps {
  heading: string
  subtext: string
  backgroundImage?: { url: string } | null
}
export default function Newsletter({ heading, subtext, backgroundImage }: NewsletterProps) {
  const bgSrc = backgroundImage?.url ?? '/newsletterimage.png'

  return (
    <section className="relative w-full min-w-0 overflow-hidden bg-[#F5F1E8]">
      <img src={bgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'rgba(245,241,232,0.79)' }} />
      <div className="app-container relative z-10 flex min-h-[min(100%,15rem)] w-full min-w-0 flex-col items-center justify-center py-[clamp(2.5rem,6vw,5rem)] text-center sm:min-h-[17.5rem] lg:min-h-80 lg:py-[clamp(3rem,8vw,5rem)]">
        <h2
          className="w-full min-w-0 max-w-4xl font-['Cormorant_Garamond'] font-bold text-[#6F5845]"
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 3.125rem)',
            lineHeight: '0.86em',
          }}
        >
          {heading}
        </h2>
        <p
          className="mx-auto mt-5 min-w-0 max-w-md font-['Inter'] font-normal leading-[1.21] text-black sm:max-w-lg"
          style={{ fontSize: 'clamp(0.875rem, 1.4vw, 1.25rem)' }}
        >
          {subtext}
        </p>
      </div>
    </section>
  )
}
