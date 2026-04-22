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
    <footer className="bg-[#483326] text-white">
      <div className="w-full px-6 pb-0 pt-16 sm:px-10 lg:px-[6.94%] lg:pt-[105px]">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)]">
          <div>
            <img
              src="/footer-logo.png"
              alt="Vitali Tea"
              className="h-[65px] w-[139px] object-contain brightness-0 invert"
            />
            <p className="mt-7 font-['Inter'] text-[16px] leading-[1.21] text-white lg:max-w-[530px]">
              {about ||
                'VitaliTea is a new and unique retail brand that provides an attainable healthy lifestyle experience for our customers. We carry diverse lineup products that promote health and well-being from the inside out. Step into our boutique and be transported to a place of vitality and serenity.'}
            </p>
          </div>

          <div>
            <h4 className="font-['Cormorant_Garamond'] text-[20px] font-bold leading-[1.55]">
              Use Full Links
            </h4>
            <div className="mt-[15px] h-px w-[79px] bg-white" />
            <ul
              className="mt-6 font-['Inter'] text-[16px] font-normal"
              style={{ lineHeight: '2.3125em' }}
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
          <div>
            <h4 className="font-['Cormorant_Garamond'] text-[20px] font-bold leading-[1.55]">
              Contact Us
            </h4>
            <div className="mt-[15px] h-px w-[79px] bg-white" />
            <div className="mt-6 space-y-6 font-['Inter'] text-[16px] leading-[1.21] text-white">
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

      <div className="py-6 text-center">
        <p className="font-['Poppins'] text-[16px] font-normal leading-[1.5] text-white">
          Copyright © 2026 Vitali Tea | Powered by Vitali Tea
        </p>
      </div>
    </footer>
  )
}
