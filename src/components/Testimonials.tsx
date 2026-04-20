'use client'
import { useState } from 'react'

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

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0)
  const items = testimonials.length > 0 ? testimonials : FALLBACK
  const total = items.length

  const prev = () => setActive((a) => (a - 1 + total) % total)
  const next = () => setActive((a) => (a + 1) % total)

  return (
    <section className="bg-[#F5F1E8] py-16 lg:py-20">
      <div className="w-full px-6 sm:px-10 lg:px-[6.94%]">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:flex lg:gap-6">
          <div
            className="flex min-h-[200px] w-full items-center justify-center rounded-[27px] p-8 lg:min-h-[297px] lg:flex-[490]"
            style={{ background: 'linear-gradient(180deg, #DEA270 0%, #DF9448 100%)' }}
          >
            <p
              className="text-center font-['Cormorant_Garamond'] font-normal italic text-white"
              style={{
                fontSize: 'clamp(32px, 3.5vw, 50px)',
                lineHeight: '0.86em',
              }}
            >
              Love at first sip...
            </p>
          </div>
          <div
            className="relative flex min-h-[200px] w-full flex-col justify-between rounded-[27px] bg-[#F5F1E8] p-8 lg:min-h-[297px] lg:flex-[732] lg:p-10"
            style={{ border: '1px solid #6F5846' }}
          >
            <div>
              <span className="block font-serif text-[50px] leading-none text-black">"</span>
              <blockquote
                className="font-['Inter'] font-medium leading-relaxed text-[#202020]"
                style={{ fontSize: 'clamp(15px, 1.4vw, 20px)' }}
              >
                {items[active].quote}
              </blockquote>
              <p
                className="mt-3 font-['Host_Grotesk'] font-medium text-[#8D8C8C]"
                style={{ fontSize: 'clamp(14px, 1.2vw, 20px)' }}
              >
                - {items[active].author}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path
                    d="M11 2l2.39 4.84L19 7.63l-4 3.9.94 5.5L11 14.27 6.06 17.03 7 11.53 3 7.63l5.61-.79L11 2z"
                    fill="#202020"
                  />
                </svg>
                <span className="font-['Host_Grotesk'] text-[22px] font-medium text-[#202020]">
                  Trustpilot
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-60"
                >
                  <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                    <path d="M9.207 0.354L0.707 8.854L9.207 17.354" stroke="black" />
                  </svg>
                </button>
                <span className="font-['Poppins'] text-[20px] font-medium text-[#8D8C8C]">
                  {active + 1}&nbsp;/&nbsp;{total}
                </span>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-60"
                >
                  <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                    <path d="M0.793 0.354L9.293 8.854L0.793 17.354" stroke="black" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
