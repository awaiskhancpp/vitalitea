import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Media } from '@/payload-types'
import { SEED_PRODUCTS, type Product } from './seeds'

type ApiProductDoc = {
  id: number
  name: string
  description: string
  price: number
  slug: string
  image?: number | Media | null
}

function mapMediaToProductImage(
  image: number | Media | null | undefined,
  name: string,
): { url: string; alt: string } | null {
  if (image == null || typeof image === 'number') return null
  const url = image.url
  if (typeof url !== 'string' || !url.trim()) return null
  return {
    url: url.trim(),
    alt: (typeof image.alt === 'string' && image.alt.trim()) || name,
  }
}

function mapApiDocToProduct(doc: ApiProductDoc): Product {
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    slug: doc.slug,
    image: mapMediaToProductImage(doc.image, doc.name),
  }
}

export async function getPayloadClient() {
  return getPayload({ config: configPromise })
}

export async function getHomepage() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'homepage', depth: 2 })
}

export async function getHeader() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'header', depth: 1 })
}

export async function getFooter() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'footer', depth: 1 })
}
export async function getProducts(): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_PAYLOAD_URL
  if (!base) return SEED_PRODUCTS
  try {
    const res = await fetch(`${base}/api/products?limit=100&depth=2`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error('fetch failed')
    const data = (await res.json()) as { docs?: ApiProductDoc[] }
    if (data.docs?.length) {
      return data.docs.map(mapApiDocToProduct)
    }
    return SEED_PRODUCTS
  } catch {
    return SEED_PRODUCTS
  }
}

export async function getFeaturedProducts() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    where: { featured: { equals: true } },
    limit: 6,
    depth: 2,
  })
  return result.docs
}

export async function getCategories() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    sort: 'order',
    depth: 2,
  })
  return result.docs
}

export async function getTestimonials() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'testimonials', depth: 1 })
  return result.docs
}
