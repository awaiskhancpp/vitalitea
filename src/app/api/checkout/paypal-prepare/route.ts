import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { computeOrderTotals } from '@/lib/computeOrderTotals'
import type { ClientCartLine } from '@/lib/order-pricing'
import { paypalCreateOrder } from '@/lib/paypalServer'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Address = {
  firstName: string
  lastName: string
  address: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  email: string
}

type Body = {
  items: ClientCartLine[]
  shippingRegionId: string
  couponCode: string | null
  shippingAddress: Address
  billingAddress?: Address | null
  sameAsShipping?: boolean
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim())

function getOrigin(request: Request) {
  const env = process.env.NEXT_PUBLIC_APP_URL
  if (env) return env.replace(/\/$/, '')
  return new URL(request.url).origin
}

export async function POST(request: Request) {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json({ error: 'PayPal is not configured' }, { status: 503 })
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const email = (body.shippingAddress?.email || '').trim()
  if (!emailOk(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (!body.items?.length || !body.shippingRegionId) {
    return NextResponse.json({ error: 'items and shippingRegionId are required' }, { status: 400 })
  }
  if (!body.shippingAddress?.firstName?.trim() || !body.shippingAddress?.lastName?.trim()) {
    return NextResponse.json({ error: 'Shipping name is required' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const tot = await computeOrderTotals(payload, {
    lines: body.items,
    shippingRegionId: body.shippingRegionId,
    couponCode: body.couponCode?.trim() || null,
  })
  if (!tot.ok) {
    return NextResponse.json({ error: tot.error }, { status: 400 })
  }
  const d = tot.data

  const same = body.sameAsShipping !== false
  const shippingJson = { ...body.shippingAddress, email: body.shippingAddress.email || email }
  const billingJson = same
    ? shippingJson
    : body.billingAddress
      ? { ...body.billingAddress }
      : shippingJson

  const lineItems = d.lines.map((l) => ({
    productId: String(l.id),
    slug: l.slug,
    name: l.name,
    price: l.price,
    quantity: l.quantity,
    imageUrl: l.imageUrl,
    imageAlt: l.imageAlt,
  }))

  const regionId = Number(d.shippingRegionId)
  if (Number.isNaN(regionId)) {
    return NextResponse.json({ error: 'Invalid shipping region' }, { status: 400 })
  }
  const order = await payload.create({
    collection: 'orders',
    data: {
      email: email.toLowerCase(),
      status: 'awaiting_payment',
      lineItems,
      subtotal: d.subtotal,
      discount: d.discount,
      shipping: d.shipping,
      total: d.total,
      currency: 'usd',
      shippingRegion: regionId,
      coupon: d.coupon
        ? (typeof d.coupon.id === 'number'
            ? d.coupon.id
            : (() => {
                const n = Number(d.coupon.id)
                return Number.isNaN(n) ? undefined : n
              })())
        : undefined,
      couponCodeSnapshot: d.coupon?.code ?? undefined,
      shippingAddress: shippingJson,
      billingAddress: billingJson,
      paymentMethod: 'paypal',
    },
    overrideAccess: true,
  })

  const o = order as { id: string | number; total: number; orderNumber: string }
  const origin = getOrigin(request)
  const created = await paypalCreateOrder(
    o.total.toFixed(2),
    `${origin}/checkout/success?paypal=1&orderId=${encodeURIComponent(String(o.id))}`,
    `${origin}/checkout?cancelled=1`,
    String(o.id),
  )

  await payload.update({
    collection: 'orders',
    id: o.id,
    data: { paypalOrderId: created.id } as any,
    overrideAccess: true,
  })

  return NextResponse.json({ orderId: String(o.id), orderNumber: o.orderNumber, paypalOrderId: created.id })
}
