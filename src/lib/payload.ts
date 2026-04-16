import configPromise from '@payload-config'
import { getPayload } from 'payload'

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
