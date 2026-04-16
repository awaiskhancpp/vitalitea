'use client'
import { useState } from 'react'

interface NewsletterProps {
  heading: string
  subtext: string
  backgroundImage?: { url: string } | null
}

export default function Newsletter({ heading, subtext, backgroundImage }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="relative h-[320px] overflow-hidden bg-[#F5F1E8]">
      {/* Background */}
      {backgroundImage?.url ? (
        <>
          <img
            src={backgroundImage.url}
            alt=""
            className="w-full absolute inset-0 h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#f5f1e8]/80" />
        </>
      ) : (
        <>
          <img
            src="/newsletterimage.png"
            alt="newsletter"
            className="w-full h-full absolute inset-0 object-cover"
          />
          <div className="absolute inset-0 bg-[#f5f1e8]/80" />
        </>
      )}

      <div className="relative z-10 mx-auto h-full w-full max-w-[1442px] flex flex-col items-center justify-center text-center">
        <h2 className="pt-[106px] font-['Cormorant_Garamond'] text-[50px] font-bold leading-[43px] text-[#6F5845]">
          {heading}
        </h2>
        <p className="mx-auto mt-[20px] max-w-[444px] text-center font-['Inter'] text-[20px] leading-[1] text-black">
          {subtext}
        </p>

        {submitted ? (
          <div className="mx-auto mt-6 max-w-[520px] rounded-[20px] bg-[#627E5C] p-6">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-white font-semibold text-lg">Welcome to the ritual!</p>
            <p className="text-white/80 text-sm mt-1">
              Check your email for your 10% discount code.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex max-w-[540px] flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="h-[50px] flex-1 rounded-full border border-[#6F5846] bg-white px-5 text-sm text-black placeholder:text-black/40 focus:outline-none"
            />
            <button
              type="submit"
              className="pb-[10px] h-[50px] whitespace-nowrap rounded-full bg-[#627E5C] px-7 text-sm font-semibold text-white transition-colors hover:opacity-90"
            >
              Join the Ritual
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
