import Link from 'next/link'

interface FooterProps {
  about?: string
  quickLinks?: { label: string; href: string }[]
  phone?: string
  email?: string
  hours?: string
}

export default function Footer({ about, quickLinks, phone, email, hours }: FooterProps) {
  const links = quickLinks?.length
    ? quickLinks
    : [
        { label: 'Shop', href: '#' },
        { label: 'About', href: '#' },
        { label: 'WholeSale', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Social', href: '#' },
        { label: 'Newsletter', href: '#' },
      ]

  const hourLines = hours
    ? hours
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : ['Monday to Thursday 9:00AM – 4:30PM PST,', 'Friday 9:00AM – 2:30PM PST.']

  return (
    <footer className="w-full min-w-0 overflow-x-hidden bg-[#483326] text-white">
      <div className="app-container w-full pb-0 pt-[clamp(3rem,7.3vw,6.5rem)]">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="min-w-0">
            <img
              src="/footer-logo.png"
              alt="Vitali Tea"
              className="h-[clamp(2.5rem,4.5vw,4rem)] w-auto max-w-[8.75rem] object-contain brightness-0 invert"
            />
            <p
              className="mt-7 min-w-0 max-w-md font-['Inter'] leading-[1.21] text-white sm:max-w-lg lg:max-w-[33rem]"
              style={{ fontSize: 'clamp(0.875rem,1.11vw,1rem)' }}
            >
              {about ||
                'VitaliTea is a new and unique retail brand that provides an attainable healthy lifestyle experience for our customers. We carry diverse lineup products that promote health and well-being from the inside out. Step into our boutique and be transported to a place of vitality and serenity.'}
            </p>
          </div>

          <div className="min-w-0">
            <h4
              className="font-['Cormorant_Garamond'] font-bold leading-[1.55]"
              style={{ fontSize: 'clamp(1.125rem,1.4vw,1.25rem)' }}
            >
              Use Full Links
            </h4>
            <div className="mt-3 h-px w-16 max-w-full bg-white sm:mt-4" />
            <ul
              className="mt-6 font-['Inter'] font-normal"
              style={{ lineHeight: '2.3125em', fontSize: 'clamp(0.875rem,1.11vw,1rem)' }}
            >
              {links.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-white transition-opacity hover:opacity-80">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 break-words">
            <h4
              className="font-['Cormorant_Garamond'] font-bold leading-[1.55]"
              style={{ fontSize: 'clamp(1.125rem,1.4vw,1.25rem)' }}
            >
              Contact Us
            </h4>
            <div className="mt-3 h-px w-16 max-w-full bg-white sm:mt-4" />
            <div
              className="mt-6 space-y-6 font-['Inter'] leading-[1.21] text-white"
              style={{ fontSize: 'clamp(0.875rem,1.11vw,1rem)' }}
            >
              <p>Number: {phone || '1-888-546-9704'}</p>
              <p>E-mail: {email || 'info@vitalitea.us'}</p>
              {hourLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 w-full border-t border-white/30" />

      <div className="app-container py-6 text-center">
        <p
          className="font-['Poppins'] font-normal leading-[1.5] text-white"
          style={{ fontSize: 'clamp(0.8125rem,1.11vw,1rem)' }}
        >
          Copyright © 2026 Vitali Tea | Powered by Vitali Tea
        </p>
      </div>
    </footer>
  )
}
