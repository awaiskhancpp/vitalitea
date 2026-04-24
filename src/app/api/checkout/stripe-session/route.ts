import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripeServer'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

function getOrigin(request: Request) {
  const env = process.env.NEXT_PUBLIC_APP_URL
  if (env) return env.replace(/\/$/, '')
  return new URL(request.url).origin
}

export async function POST(request: Request) {
  try {
    let orderId: string
    try {
      const b = (await request.json()) as { orderId?: string }
      orderId = (b.orderId || '').trim()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })

    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY is not set. Add it to your environment to use card checkout.' },
        { status: 503 },
      )
    }
    const payload = await getPayload({ config: configPromise })
    const order = await payload.findByID({ collection: 'orders', id: orderId, overrideAccess: true })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    const o = order as {
      id: string | number
      status: string
      total: number
      orderNumber: string
      email: string
      paymentMethod: string
    }
    if (o.status !== 'awaiting_payment' || o.paymentMethod !== 'stripe') {
      return NextResponse.json({ error: 'Order is not ready for Stripe payment' }, { status: 400 })
    }
    const amountCents = Math.round(o.total * 100)
    if (amountCents < 50) {
      return NextResponse.json({ error: 'Amount below Stripe minimum ($0.50 USD)' }, { status: 400 })
    }

    const origin = getOrigin(request)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `VitaliTea order ${o.orderNumber}` },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      client_reference_id: String(o.id),
      customer_email: o.email,
      metadata: { orderId: String(o.id) },
    })

    await payload.update({
      collection: 'orders',
      id: o.id,
      data: { stripeSessionId: session.id } as any,
      overrideAccess: true,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a session URL' }, { status: 500 })
    }
    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (e) {
    console.error('[checkout/stripe-session]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Stripe session failed' },
      { status: 500 },
    )
  }
}
