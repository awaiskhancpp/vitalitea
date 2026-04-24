import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { computeOrderTotals } from '@/lib/computeOrderTotals'
import type { ClientCartLine } from '@/lib/order-pricing'

export const dynamic = 'force-dynamic'

type Body = {
  items: ClientCartLine[]
  shippingRegionId: string
  couponCode: string | null
}

export async function POST(request: Request) {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body.items?.length || !body.shippingRegionId) {
    return NextResponse.json({ error: 'items and shippingRegionId are required' }, { status: 400 })
  }
  const payload = await getPayload({ config: configPromise })
  const result = await computeOrderTotals(payload, {
    lines: body.items,
    shippingRegionId: body.shippingRegionId,
    couponCode: body.couponCode?.trim() || null,
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  const d = result.data
  return NextResponse.json({
    subtotal: d.subtotal,
    discount: d.discount,
    shipping: d.shipping,
    total: d.total,
    coupon: d.coupon,
  })
}
