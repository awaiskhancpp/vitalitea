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
      <footer className="bg-[#483326] text-white">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[100px] py-[105px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Column 1 - About */}
            <div>
              <img src="/logo.png" alt="Vitali Tea" className="h-[65px] w-[139px]" />
              <p className="mt-8 max-w-[530px] font-['Inter'] text-[16px] leading-[1.5] text-white">
                {about ||
                  'VitaliTea is a new and unique retail brand that provides an attainable healthy lifestyle experience for our customers.'}
              </p>
            </div>

            {/* Column 2 - Links */}
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-[20px] font-bold leading-[31px]">
                Use Full Links
              </h4>
              <div className="mt-3 h-px w-[79px] bg-white" />
              <ul className="mt-6 space-y-1 font-['Inter'] text-[16px] leading-[2.3]">
                {(quickLinks?.length
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

            {/* Column 3 - Contact */}
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-[20px] font-bold leading-[31px]">
                Contact Us
              </h4>
              <div className="mt-3 h-px w-[79px] bg-white" />
              <div className="mt-6 space-y-3 font-['Inter'] text-[16px] leading-[1.5]">
                <p>Number: {phone || '1-888-546-9704'}</p>
                <p>E-mail: {email || 'info@vitalitea.us'}</p>
                <p>
                  {hours || 'Monday to Thursday 9:00AM - 4:30PM PST, Friday 9:00AM - 2:30PM PST.'}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom divider + copyright */}
          <div className="mt-16 border-t border-white/30 pt-6 text-center">
            <p className="font-['Poppins'] text-[16px] text-white/80">
              Copyright © 2026 Vitali Tea | Powered by Vitali Tea
            </p>
          </div>
        </div>
      </footer>
    </footer>
  )
}
