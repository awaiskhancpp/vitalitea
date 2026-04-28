import type { Payload } from 'payload'
import { resolvedShippingRegionTitle } from './shippingRegionDisplayName'
import { repairOrphanedOrderShippingRegions } from './repairOrderShippingRegions'

async function backfillShippingRegionDisplayNames(payload: Payload): Promise<void> {
  const { docs } = await payload.find({
    collection: 'shipping-regions',
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })
  const usedCodes = new Set<string>()
  for (const doc of docs) {
    const c = String((doc as { code?: string | null }).code ?? '').trim().toLowerCase()
    if (c) usedCodes.add(c)
  }
  const sorted = [...docs].sort((a, b) => Number((a as { id: unknown }).id) - Number((b as { id: unknown }).id))

  for (const raw of sorted) {
    const d = raw as {
      id: string | number
      name?: string | null
      country?: string | null
      rate?: number | null
      code?: string | null
      stateCode?: string | null
    }
    const cc =
      typeof d.country === 'string' ? d.country.replace(/\s/g, '').slice(0, 3).toUpperCase() : ''
    const st =
      typeof d.stateCode === 'string' && d.stateCode.trim().length > 0
        ? String(d.stateCode).replace(/\s/g, '').toUpperCase().slice(0, 12)
        : ''
    const computedCode = cc ? (st ? `${cc}-${st}` : cc).toLowerCase() : ''
    const nameTrim = typeof d.name === 'string' ? d.name.trim() : ''
    const patch: Record<string, unknown> = {}
    const synthesized = resolvedShippingRegionTitle({
      id: d.id,
      name: d.name,
      country: d.country,
      rate: d.rate,
    })
    if (synthesized !== nameTrim) patch.name = synthesized

    const de = typeof (d as { deliveryEta?: string | null }).deliveryEta === 'string'
      ? (d as { deliveryEta?: string }).deliveryEta?.trim() ?? ''
      : ''
    if (!de) patch.deliveryEta = '5–7 business days'

    const hadCode = String(d.code ?? '').trim().length > 0
    if (!hadCode && computedCode) {
      let candidate = computedCode
      if (usedCodes.has(candidate)) candidate = `${computedCode}-${String(d.id)}`
      usedCodes.add(candidate)
      patch.code = candidate
    }

    if (Object.keys(patch).length === 0) continue
    await payload.update({
      collection: 'shipping-regions',
      id: d.id,
      data: patch as Record<string, unknown>,
      overrideAccess: true,
    })
  }
}

const SHIPPING_SEED_ROWS = [
  {
    country: 'US',
    name: 'United States — Standard',
    rate: 8.99,
    sort: 10,
    code: 'us',
    deliveryEta: '5–7 business days',
    summaryHint: 'Standard',
  },
  {
    country: 'US',
    name: 'United States — Express',
    rate: 19.99,
    sort: 11,
    code: 'us-express',
    deliveryEta: '2–3 business days',
    summaryHint: 'Express',
  },
  {
    country: 'CA',
    name: 'Canada — Standard',
    rate: 12.99,
    sort: 20,
    code: 'ca',
    deliveryEta: '7–10 business days',
    summaryHint: 'Standard',
  },
  {
    country: 'CA',
    name: 'Canada — Express',
    rate: 24.99,
    sort: 21,
    code: 'ca-express',
    deliveryEta: '3–5 business days',
    summaryHint: 'Express',
  },
] as const

/**
 * Ensure seeded shipping catalog rows exist, then repair orders. Idempotent.
 */
export async function seedOrderCommerce(payload: Payload): Promise<void> {
  try {
    for (const row of SHIPPING_SEED_ROWS) {
      const existing = await payload.find({
        collection: 'shipping-regions',
        where: { code: { equals: row.code } },
        limit: 1,
        overrideAccess: true,
      })
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'shipping-regions',
          data: { ...row, isActive: true },
        } as any)
      }
    }

    await backfillShippingRegionDisplayNames(payload)
    await repairOrphanedOrderShippingRegions(payload)

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
