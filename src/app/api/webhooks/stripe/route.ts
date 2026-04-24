import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripeServer'
import { markOrderAsPaid } from '@/lib/orderMarkPaid'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request) {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  const stripe = getStripe()
  if (!stripe || !whSecret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }
  const raw = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid payload'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }
    const orderId = session.metadata?.orderId
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId in metadata' }, { status: 400 })
    }
    const amountCents = session.amount_total
    if (amountCents == null) {
      return NextResponse.json({ error: 'No amount' }, { status: 400 })
    }
    const payload = await getPayload({ config: configPromise })
    const order = await payload.findByID({ collection: 'orders', id: orderId, overrideAccess: true })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    const o = order as { total: number; id: string | number; status: string }
    const expected = Math.round(o.total * 100)
    if (expected !== amountCents) {
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
    }
    const pi = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id
    await markOrderAsPaid(payload, o.id, pi || session.id)
  }

  return NextResponse.json({ received: true })
}
