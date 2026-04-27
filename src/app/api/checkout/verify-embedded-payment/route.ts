import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripeServer'
import { markOrderAsPaid } from '@/lib/orderMarkPaid'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

type Body = { orderId?: string; paymentIntentId?: string }

/**
 * After embedded confirmPayment() succeeds in the browser, call this to mark the order paid
 * (webhooks are asynchronous; this keeps localhost / fast redirects reliable).
 */
export async function POST(request: Request) {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const orderId = (body.orderId || '').trim()
  const paymentIntentId = (body.paymentIntentId || '').trim()
  if (!orderId || !paymentIntentId) {
    return NextResponse.json({ error: 'orderId and paymentIntentId required' }, { status: 400 })
  }

  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
  if (intent.metadata?.orderId !== orderId) {
    return NextResponse.json({ error: 'Payment does not match order' }, { status: 400 })
  }
  if (intent.status !== 'succeeded') {
    return NextResponse.json({ error: 'Payment not complete' }, { status: 400 })
  }
  const payload = await getPayload({ config: configPromise })
  const order = await payload.findByID({ collection: 'orders', id: orderId, overrideAccess: true })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  const o = order as { total: number; id: string | number; status: string }
  const expected = Math.round(o.total * 100)
  if (expected !== intent.amount) {
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
  }
  if (o.status === 'awaiting_payment') {
    await markOrderAsPaid(payload, o.id, intent.id)
  }
  return NextResponse.json({ ok: true })
}
