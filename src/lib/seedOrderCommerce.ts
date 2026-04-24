import type { Payload } from 'payload'

/**
 * Default shipping + sample coupon. Idempotent.
 */
export async function seedOrderCommerce(payload: Payload): Promise<void> {
  try {
    const { totalDocs } = await payload.count({ collection: 'shipping-regions' })
    if (totalDocs > 0) return

    const pkStates: { name: string; stateCode: string; rate: number; sort: number }[] = [
      { name: 'Pakistan — Punjab', stateCode: 'Punjab', rate: 4.99, sort: 0 },
      { name: 'Pakistan — Sindh', stateCode: 'Sindh', rate: 4.99, sort: 1 },
      { name: 'Pakistan — Balochistan', stateCode: 'Balochistan', rate: 6.99, sort: 2 },
      { name: 'Pakistan — KPK', stateCode: 'KPK', rate: 6.99, sort: 3 },
      { name: 'Pakistan — Azad Kashmir', stateCode: 'Azad Kashmir', rate: 6.99, sort: 4 },
    ]
    for (const r of pkStates) {
      await payload.create({
        collection: 'shipping-regions',
        data: { country: 'PK', isActive: true, ...r },
      } as any)
    }
    await payload.create({
      collection: 'shipping-regions',
      data: { name: 'United States (standard)', country: 'US', rate: 12, sort: 10, isActive: true },
    } as any)
    await payload.create({
      collection: 'shipping-regions',
      data: { name: 'United Kingdom', country: 'GB', rate: 15, sort: 20, isActive: true },
    } as any)
    await payload.create({
      collection: 'shipping-regions',
      data: { name: 'Rest of world', country: 'XX', rate: 25, sort: 99, isActive: true },
    } as any)

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
