import type { Payload } from 'payload'

const CHECKOUT_COUNTRIES = [
  { country: 'US', name: 'United States (standard)', rate: 8, sort: 10 },
  { country: 'CA', name: 'Canada (standard)', rate: 10, sort: 11 },
] as const

/**
 * Ensure one active shipping region per checkout country (US, CA). Idempotent.
 * Sample coupon when none exist.
 */
export async function seedOrderCommerce(payload: Payload): Promise<void> {
  try {
    for (const c of CHECKOUT_COUNTRIES) {
      const existing = await payload.find({
        collection: 'shipping-regions',
        where: { and: [{ country: { equals: c.country } }, { isActive: { equals: true } }] },
        limit: 1,
        overrideAccess: true,
      })
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'shipping-regions',
          data: { ...c, isActive: true },
        } as any)
      }
    }

    const { totalDocs: couponCount } = await payload.count({ collection: 'coupons' })
    if (couponCount > 0) return

    await payload.create({
      collection: 'coupons',
      data: {
        code: 'WELCOME10',
        discountType: 'percent',
        value: 10,
        minSubtotal: 0,
        isActive: true,
      } as any,
    })
  } catch (e) {
    console.warn('[seedOrderCommerce]', e)
  }
}
