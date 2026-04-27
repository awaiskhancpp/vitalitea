import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripeServer'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

/**
 * Create a PaymentIntent for embedded Stripe (Payment Element). The client stays on-site.
 * Redirect Checkout is handled separately via /api/checkout/stripe-session.
 */
export async function POST(request: Request) {
  try {
    let orderId: string
    try {
      const b = (await request.json()) as { orderId?: string }
      orderId = (b.orderId || '').trim()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 })
    }

    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json(
        {
          error:
            'STRIPE_SECRET_KEY is not set. Add it to your environment to use card checkout.',
        },
        { status: 503 },
      )
    }
    const payload = await getPayload({ config: configPromise })
    const order = await payload.findByID({ collection: 'orders', id: orderId, overrideAccess: true })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
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
      return NextResponse.json(
        { error: 'Amount below Stripe minimum ($0.50 USD)' },
        { status: 400 },
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: String(o.id) },
      receipt_email: o.email,
      description: `VitaliTea order ${o.orderNumber}`,
    })

    await payload.update({
      collection: 'orders',
      id: o.id,
      data: { stripePaymentIntentId: paymentIntent.id } as any,
      overrideAccess: true,
    })

    if (!paymentIntent.client_secret) {
      return NextResponse.json({ error: 'Stripe did not return a client secret' }, { status: 500 })
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id })
  } catch (e) {
    console.error('[checkout/stripe-payment-intent]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Payment intent failed' },
      { status: 500 },
    )
  }
}
