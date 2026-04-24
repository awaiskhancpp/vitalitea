import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { paypalCaptureOrder } from '@/lib/paypalServer'
import type { Payload } from 'payload'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function incrementCouponUse(payload: Payload, couponId: string | number) {
  const doc = await payload.findByID({ collection: 'coupons', id: couponId, overrideAccess: true })
  if (!doc) return
  const u = (doc as { usedCount?: number }).usedCount ?? 0
  await payload.update({
    collection: 'coupons',
    id: couponId,
    data: { usedCount: u + 1 } as any,
    overrideAccess: true,
  })
}

export async function POST(request: Request) {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json({ error: 'PayPal is not configured' }, { status: 503 })
  }
  let orderId: string
  let paypalOrderId: string
  try {
    const b = (await request.json()) as { orderId?: string; paypalOrderId?: string }
    orderId = (b.orderId || '').trim()
    paypalOrderId = (b.paypalOrderId || '').trim()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!orderId || !paypalOrderId) {
    return NextResponse.json({ error: 'orderId and paypalOrderId required' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  const order = await payload.findByID({ collection: 'orders', id: orderId, overrideAccess: true })
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  const o = order as {
    id: string | number
    status: string
    total: number
    paymentMethod: string
    paypalOrderId?: string
    coupon: number | { id: number } | null
  }
  if (o.status === 'paid') {
    const updated = await payload.findByID({ collection: 'orders', id: o.id, overrideAccess: true })
    return NextResponse.json({ ok: true, orderNumber: (updated as { orderNumber: string }).orderNumber })
  }
  if (o.status !== 'awaiting_payment' || o.paymentMethod !== 'paypal') {
    return NextResponse.json({ error: 'Invalid order state' }, { status: 400 })
  }
  if (o.paypalOrderId && o.paypalOrderId !== paypalOrderId) {
    return NextResponse.json({ error: 'PayPal order mismatch' }, { status: 400 })
  }

  const result = await paypalCaptureOrder(paypalOrderId)
  if (result.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'PayPal payment not completed' }, { status: 400 })
  }
  const purchase = result.purchase_units?.[0]
  const capture = purchase?.payments?.captures?.[0]
  const capId = capture?.id
  const amt = capture?.amount?.value
  if (amt) {
    const got = parseFloat(amt)
    if (Math.abs(got - o.total) > 0.02) {
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
    }
  }

  await payload.update({
    collection: 'orders',
    id: o.id,
    data: { status: 'paid', paypalCaptureId: capId } as any,
    overrideAccess: true,
  })

  const c = o.coupon
  const couponId = typeof c === 'object' && c && 'id' in c ? c.id : typeof c === 'number' ? c : null
  if (couponId) await incrementCouponUse(payload, couponId)

  const updated = await payload.findByID({ collection: 'orders', id: o.id, overrideAccess: true })
  return NextResponse.json({
    ok: true,
    orderNumber: (updated as { orderNumber: string }).orderNumber,
  })
}
