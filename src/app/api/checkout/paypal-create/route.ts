import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { paypalCreateOrder } from '@/lib/paypalServer'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function getOrigin(request: Request) {
  const env = process.env.NEXT_PUBLIC_APP_URL
  if (env) return env.replace(/\/$/, '')
  return new URL(request.url).origin
}

export async function POST(request: Request) {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json({ error: 'PayPal is not configured' }, { status: 503 })
  }

  let orderId: string
  try {
    const b = (await request.json()) as { orderId?: string }
    orderId = (b.orderId || '').trim()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })

  const payload = await getPayload({ config: configPromise })
  const order = await payload.findByID({ collection: 'orders', id: orderId, overrideAccess: true })
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  const o = order as {
    id: string | number
    status: string
    total: number
    orderNumber: string
    paymentMethod: string
  }
  if (o.status !== 'awaiting_payment' || o.paymentMethod !== 'paypal') {
    return NextResponse.json({ error: 'Order is not ready for PayPal' }, { status: 400 })
  }

  const value = o.total.toFixed(2)
  const origin = getOrigin(request)
  const created = await paypalCreateOrder(
    value,
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

  return NextResponse.json({ paypalOrderId: created.id })
}
