import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Media } from '@/payload-types'
import { SEED_PRODUCTS, type Product } from './seeds'

type ApiProductDoc = {
  id: number | string
  name: string
  description: string
  price: number
  slug: string
  image?: number | Media | null
  featured?: boolean | null
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

function sortShopProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const fa = a.featured ? 1 : 0
    const fb = b.featured ? 1 : 0
    if (fb !== fa) return fb - fa
    return String(a.name).localeCompare(String(b.name), undefined, { sensitivity: 'base' })
  })
}

function mapApiDocToProduct(doc: ApiProductDoc): Product {
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    slug: doc.slug,
    image: mapMediaToProductImage(doc.image, doc.name),
    featured: doc.featured === true,
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
/**
 * Full product catalog for shop from Payload (same DB as homepage/categories).
 * Does not rely on NEXT_PUBLIC_PAYLOAD_URL — that env is optional for REST/admin URLs only.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      limit: 1000,
      depth: 2,
      sort: 'name',
    })
    const docs = result.docs as ApiProductDoc[]
    if (!docs.length) return SEED_PRODUCTS
    return sortShopProducts(docs.map(mapApiDocToProduct))
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
  const result = await payload.find({
    collection: 'testimonials',
    limit: 20,
    depth: 1,
    sort: '-createdAt',
  })
  return result.docs
}

/** Active catalog rows — used server-side where shipping options must mirror Payload. */
export async function getShippingRegions() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'shipping-regions',
    where: { isActive: { equals: true } },
    sort: 'sort',
    limit: 50,
    depth: 0,
  })
  return result.docs
}
