import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { computeOrderTotals } from '@/lib/computeOrderTotals'
import { verifyCheckoutPostalAddresses } from '@/lib/geoapify/verifyCheckoutAddresses'
import type { ClientCartLine } from '@/lib/order-pricing'
import { snapshotShippingRegion } from '@/lib/orderShippingSnapshots'
import { isPhoneValidForCountry, PHONE_ERROR_US_CA } from '@/lib/checkout/phoneForCountry'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
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
  paymentMethod: 'stripe' | 'paypal'
  shippingAddress: Address
  billingAddress?: Address | null
  sameAsShipping?: boolean
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim())

function errMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return String(err)
}

export async function POST(request: Request) {
  try {
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
    if (body.paymentMethod !== 'stripe' && body.paymentMethod !== 'paypal') {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }
    if (!body.shippingAddress?.firstName?.trim() || !body.shippingAddress?.lastName?.trim()) {
      return NextResponse.json({ error: 'Shipping name is required' }, { status: 400 })
    }

    const shipCountry = (body.shippingAddress?.country ?? 'US').trim()
    const shipPhone = (body.shippingAddress?.phone ?? '').trim()
    if (!shipPhone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }
    if (!isPhoneValidForCountry(shipPhone, shipCountry)) {
      return NextResponse.json({ error: PHONE_ERROR_US_CA }, { status: 400 })
    }

    const same = body.sameAsShipping !== false
    const addrCheck = await verifyCheckoutPostalAddresses({
      shipping: {
        city: body.shippingAddress.city,
        state: body.shippingAddress.state,
        zip: body.shippingAddress.zip,
        country: body.shippingAddress.country,
      },
      billing: body.billingAddress
        ? {
            city: body.billingAddress.city,
            state: body.billingAddress.state,
            zip: body.billingAddress.zip,
            country: body.billingAddress.country,
          }
        : undefined,
      sameAsShipping: same,
    })
    if (!addrCheck.ok) {
      return NextResponse.json({ error: addrCheck.error }, { status: 400 })
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

    const regionSnap = await snapshotShippingRegion(payload, regionId)

    const orderData: Record<string, unknown> = {
      email: email.toLowerCase(),
      status: 'awaiting_payment',
      lineItems,
      subtotal: d.subtotal,
      discount: d.discount,
      shipping: d.shipping,
      total: d.total,
      currency: 'usd',
      shippingRegion: regionId,
      shippingCountryCode: regionSnap?.shippingCountryCode ?? String(shipCountry).toUpperCase(),
      shippingRegionSnapshot: regionSnap?.snapshot,
      shippingRegionCode: d.shippingRegionCode,
      couponCodeSnapshot: d.coupon?.code ?? undefined,
      shippingAddress: shippingJson,
      billingAddress: billingJson,
      paymentMethod: body.paymentMethod,
    }
    if (d.coupon) {
      const cid = d.coupon.id
      const n = typeof cid === 'number' ? cid : Number(cid)
      if (!Number.isNaN(n)) orderData.coupon = n
    }

    const order = await payload.create({
      collection: 'orders',
      data: orderData as any,
      overrideAccess: true,
    })

    return NextResponse.json({
      orderId: String(order.id),
      orderNumber: (order as { orderNumber: string }).orderNumber,
      total: d.total,
      subtotal: d.subtotal,
      discount: d.discount,
      shipping: d.shipping,
    })
  } catch (e) {
    console.error('[orders/draft]', e)
    return NextResponse.json(
      { error: errMessage(e) || 'Failed to create order' },
      { status: 500 },
    )
  }
}
