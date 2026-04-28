import type { Payload } from 'payload'
import { SEED_PRODUCTS } from './seeds'

export type ClientCartLine = {
  id: string
  slug: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  imageAlt: string
}

type ProductDoc = { id: string | number; name: string; price: number; slug: string }

/**
 * Locate the CMS row for one cart line. Slug is authoritative (what the shop showed);
 * numeric `id` alone is unsafe — seed ids and Payload auto-ids can collide (e.g. both "2",
 * different products).
 */
async function findProductDocForLine(
  payload: Payload,
  line: ClientCartLine,
): Promise<ProductDoc | undefined> {
  const slugTrim = line.slug.trim()

  if (slugTrim) {
    const bySlug = await payload.find({
      collection: 'products',
      where: { slug: { equals: slugTrim } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const d = bySlug.docs[0] as ProductDoc | undefined
    if (d) return d
  }

  const n = Number(line.id)
  let res = await payload.find({
    collection: 'products',
    where: { id: { equals: line.id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (!res.docs[0] && !Number.isNaN(n)) {
    res = await payload.find({
      collection: 'products',
      where: { id: { equals: n } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
  }
  const doc = res.docs[0] as ProductDoc | undefined
  if (!doc) return undefined
  // Reject lookup-by-id when it points at another product (same numeric id collision).
  if (slugTrim && String(doc.slug) !== slugTrim) return undefined
  return doc
}

/**
 * Re-price cart from the products collection. Resolves each line by **slug first**, then by
 * **id only if the CMS row’s slug matches** the line (avoids id collision between storefront
 * seeds and Payload). Emits canonical `id` from Payload when a CMS row is used.
 */
export async function resolveCartLines(
  payload: Payload,
  lines: ClientCartLine[],
): Promise<
  { ok: true; lines: ClientCartLine[]; subtotal: number } | { ok: false; error: string }
> {
  if (!lines.length) return { ok: false, error: 'Cart is empty' }
  const out: ClientCartLine[] = []
  let subtotal = 0
  for (const line of lines) {
    const doc = await findProductDocForLine(payload, line)
    if (doc) {
      const price = Number(doc.price)
      if (!Number.isFinite(price)) {
        return { ok: false, error: `Invalid price for: ${line.name}` }
      }
      const q = Math.max(1, Math.floor(line.quantity))
      subtotal += price * q
      out.push({
        ...line,
        id: String(doc.id),
        name: doc.name,
        price,
        slug: doc.slug,
        quantity: q,
      })
      continue
    }
    const seed =
      SEED_PRODUCTS.find(
        (p) => String(p.id) === String(line.id) && p.slug === line.slug,
      ) ?? SEED_PRODUCTS.find((p) => String(p.id) === String(line.id))
    if (seed) {
      const q = Math.max(1, Math.floor(line.quantity))
      subtotal += seed.price * q
      out.push({
        ...line,
        name: seed.name,
        price: seed.price,
        slug: seed.slug,
        imageUrl: seed.image?.url ?? line.imageUrl,
        imageAlt: seed.image?.alt ?? line.imageAlt,
        quantity: q,
      })
      continue
    }
    return { ok: false, error: `Product not found: ${line.name}` }
  }
  return { ok: true, lines: out, subtotal: Math.round(subtotal * 100) / 100 }
}

export function applyPercentDiscount(
  subtotal: number,
  percent: number,
  maxDiscount?: number | null,
): number {
  const p = Math.min(100, Math.max(0, percent))
  let d = (subtotal * p) / 100
  if (maxDiscount != null && maxDiscount > 0) d = Math.min(d, maxDiscount)
  d = Math.round(d * 100) / 100
  return Math.min(d, subtotal)
}

export function applyFixedDiscount(subtotal: number, amount: number): number {
  const d = Math.max(0, amount)
  return Math.min(Math.round(d * 100) / 100, subtotal)
}
