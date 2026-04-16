import Link from 'next/link'

interface FooterProps {
  about?: string
  quickLinks?: { label: string; href: string }[]
  phone?: string
  email?: string
  hours?: string
}

export default function Footer({ about, quickLinks, phone, email, hours }: FooterProps) {
  return (
    <footer className="h-[542px] bg-[#483326] text-white">
      <div className="relative mx-auto h-full w-full max-w-[1442px]">
        <div className="absolute left-[100px] top-[105px]">
          <img src="/logo.png" alt="Vitali Tea" className="h-[65px] w-[139px]" />
          <p className="mt-[31px] max-w-[530px] font-['Inter'] text-[16px] leading-[1.21] text-white">
            {about ||
              'VitaliTea is a new and unique retail brand that provides an attainable healthy lifestyle experience for our customers. We carry diverse lineup products that promote health and well-being from that inside out. Step into our boutique and be to a place of vitality and serenity.'}
          </p>
        </div>

        <div className="absolute left-[739px] top-[105px]">
          <h4 className="font-['Cormorant_Garamond'] text-[20px] font-bold leading-[31px]">Use Full Links</h4>
          <div className="mt-[15px] h-px w-[79px] bg-white" />
          <ul className="mt-[25px] space-y-1 font-['Inter'] text-[16px] leading-[2.3125]">
            {(quickLinks && quickLinks.length > 0
              ? quickLinks
              : [
                  { label: 'Shop', href: '/shop' },
                  { label: 'About', href: '/about' },
                  { label: 'WholeSale', href: '/wholesale' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Social', href: '#' },
                  { label: 'Newsletter', href: '#' },
                ]
            ).map((link) => (
              <li key={link.href + link.label}>
                <Link href={link.href} className="text-white hover:text-white/80">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute left-[1040px] top-[105px]">
          <h4 className="font-['Cormorant_Garamond'] text-[20px] font-bold leading-[31px]">Contact Us</h4>
          <div className="mt-[15px] h-px w-[79px] bg-white" />
          <div className="mt-[30px] space-y-[14px] font-['Inter'] text-[16px] leading-[1.21]">
            <p>Number: {phone || '1-888-546-9704'}</p>
            <p>E-mail: {email || 'info@vitalitea.us'}</p>
            <p>{hours || 'Monday to Thursday 9:00AM - 4:30PM PST, Friday 9:00AM - 2:30PM PST.'}</p>
          </div>
        </div>

        <div className="absolute left-[9px] top-[454px] h-px w-[1423px] bg-white" />
        <div className="absolute left-1/2 top-[480px] -translate-x-1/2 text-center">
          <p className="font-['Poppins'] text-[16px] text-white/80">
            Copyright © 2026 Vitali Tea | Powered by Vitali Tea
          </p>
        </div>
      </div>
    </footer>
  )
}
