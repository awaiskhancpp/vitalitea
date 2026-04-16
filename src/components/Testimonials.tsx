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

  return (
    <section className="bg-[#F5F1E8] py-20 font-sans">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[101px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[490px_1fr] items-stretch">
          {/* Left Orange Card */}
          <div className="flex min-h-[350px] items-center justify-center rounded-[27px] bg-gradient-to-b from-[#DEA270] to-[#DF9448] p-10">
            <p className="text-center font-['Cormorant_Garamond'] text-[40px] lg:text-[50px] italic leading-tight text-white">
              Love at first sip...
            </p>
          </div>

          {/* Right Content Card */}
          <div className="relative flex flex-col justify-between rounded-[27px] border border-[#6F5846]/30 bg-[#F5F1E8] p-8 lg:p-12">
            <div>
              {/* Quote Icon */}
              <span className="block font-serif text-[60px] leading-none text-black">“</span>

              <blockquote className="mt-2 text-[18px] lg:text-[22px] leading-relaxed text-[#202020]">
                {items[active].quote}
              </blockquote>

              <p className="mt-6 text-[18px] font-medium text-[#8D8C8C]">
                — {items[active].author}
              </p>
            </div>

            {/* Bottom Row: Trustpilot & Nav */}
            <div className="mt-12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-bold text-[#202020]">★ Trustpilot</span>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActive((a) => (a - 1 + items.length) % items.length)}
                  className="group flex h-10 w-10 items-center justify-center rounded-full bg-transparent border border-black/20 hover:border-black transition-colors"
                >
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                    <path
                      d="M7 1L1 7L7 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
