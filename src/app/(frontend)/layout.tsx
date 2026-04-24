import type { Metadata } from 'next'
import './styles.css'
import { getHeader, getFooter, getHomepage } from '@/lib/payload'
import Navbar from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'
import { Cormorant_Garamond, Host_Grotesk, Martel_Sans } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-cormorant',
})

const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-grotesk',
})

const martel = Martel_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-martel',
})

export const metadata: Metadata = {
  title: 'VitaliTea',
  description: 'Intentional Wellness for Everyday Life',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [header, footer, homepage] = await Promise.all([getHeader(), getFooter(), getHomepage()])

  const newsletter = homepage.newsletter as {
    heading: string
    subtext: string
    backgroundImage?: { url: string } | null
  }

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${hostGrotesk.variable} ${martel.variable}`}
    >
      <body>
        <Providers>
          <Navbar links={(header.navLinks as { label: string; href: string }[]) ?? []} />
          {children}
          <Newsletter
            heading={newsletter?.heading ?? 'Join the Ritual.'}
            subtext={
              newsletter?.subtext ??
              'Get 10% off your first order and early access to new collections'
            }
            backgroundImage={newsletter?.backgroundImage as { url: string } | null}
          />
          <Footer
            about={footer.about as string}
            quickLinks={footer.quickLinks as { label: string; href: string }[]}
            phone={footer.phone as string}
            email={footer.email as string}
            hours={footer.hours as string}
          />
        </Providers>
      </body>
    </html>
  )
}
