import { getHomepage, getFeaturedProducts, getCategories, getTestimonials } from '@/lib/payload'
import HeroSection from '@/components/HeroSection'
import SkincareSection from '@/components/SkincareSection'
import CategoryCarousel from '@/components/CategoryCarousel'
import BentoGrid from '@/components/BentoGrid'
import FeaturedProducts from '@/components/FeaturedProducts'
import BrandStory from '@/components/BrandStory'
import Testimonials from '@/components/Testimonials'

export default async function HomePage() {
  const [homepage, products, categories, testimonials] = await Promise.all([
    getHomepage(),
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

  return (
    <>
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
    </>
  )
}
