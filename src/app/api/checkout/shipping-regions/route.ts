import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

/** Public storefront-only list; does not shadow Payload REST at /api/shipping-regions. */
export const dynamic = 'force-dynamic'

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'shipping-regions',
    where: { isActive: { equals: true } },
    limit: 200,
    sort: 'sort',
    overrideAccess: true,
  })
  return NextResponse.json({
    regions: docs.map((d) => {
      const r = d as {
        id: string | number
        name: string
        country: string
        stateCode?: string | null
        rate: number
        sort?: number | null
        deliveryEta?: string | null
        summaryHint?: string | null
      }
      return {
        id: String(r.id),
        name: r.name,
        country: r.country,
        stateCode: r.stateCode ?? null,
        rate: r.rate,
        sort: typeof r.sort === 'number' ? r.sort : 0,
        deliveryEta: r.deliveryEta?.trim() || null,
        summaryHint: r.summaryHint?.trim() || null,
      }
    }),
  })
}
