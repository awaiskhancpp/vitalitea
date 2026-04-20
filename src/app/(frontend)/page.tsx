import {
  getHomepage,
  getHeader,
  getFooter,
  getFeaturedProducts,
  getCategories,
  getTestimonials,
} from '@/lib/payload'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import SkincareSection from '@/components/SkincareSection'
import CategoryCarousel from '@/components/CategoryCarousel'
import BentoGrid from '@/components/BentoGrid'
import FeaturedProducts from '@/components/FeaturedProducts'
import BrandStory from '@/components/BrandStory'
import Testimonials from '@/components/Testimonials'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'

export default async function HomePage() {
  const [homepage, header, footer, products, categories, testimonials] = await Promise.all([
    getHomepage(),
    getHeader(),
    getFooter(),
    getFeaturedProducts(),
    getCategories(),
    getTestimonials(),
  ])

  const hero = homepage.hero as {
    heading: string
    subtext: string
    primaryCta: string
    secondaryCta: string
    image?: { url: string; alt: string } | null
  }
  const skincare = homepage.skincare as {
    heading: string
    body: string
    cta: string
    image?: { url: string; alt: string } | null
  }
  const brandStory = homepage.brandStory as {
    heading: string
    body: string
    image?: { url: string; alt: string } | null
  }
  const newsletter = homepage.newsletter as {
    heading: string
    subtext: string
    backgroundImage?: { url: string } | null
  }

  return (
    <main>
      <Navbar links={(header.navLinks as { label: string; href: string }[]) ?? []} />
      <HeroSection
        heading={hero?.heading ?? 'Intentional Wellness for Everyday Life.'}
        subtext={hero?.subtext ?? ''}
        primaryCta={hero?.primaryCta ?? 'Shop the Collection'}
        secondaryCta={hero?.secondaryCta ?? 'Discover the Ritual'}
        image={hero?.image as { url: string; alt: string } | null}
      />
      <SkincareSection
        heading={skincare?.heading ?? 'Advanced Care, Naturally Renewed Skin.'}
        body={skincare?.body ?? ''}
        cta={skincare?.cta ?? 'Shop Zen Skincare'}
        image={skincare?.image as { url: string; alt: string } | null}
      />
      <CategoryCarousel
        categories={
          categories as {
            id: string | number
            name: string
            image?: { url: string; alt: string } | null
          }[]
        }
      />
      <BentoGrid />
      <FeaturedProducts
        products={
          products as {
            id: string | number
            name: string
            description: string
            price: number
            slug: string
            image?: { url: string; alt: string } | null
          }[]
        }
      />
      <BrandStory
        heading={brandStory?.heading ?? 'Experience VitaliTea'}
        body={brandStory?.body ?? ''}
        image={brandStory?.image as { url: string; alt: string } | null}
      />
      <Testimonials
        testimonials={
          testimonials as {
            id: string | number
            author: string
            quote: string
            rating: string | number
          }[]
        }
      />
      <Newsletter
        heading={newsletter?.heading ?? 'Join the Ritual.'}
        subtext={
          newsletter?.subtext ?? 'Get 10% off your first order and early access to new collections'
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
    </main>
  )
}
