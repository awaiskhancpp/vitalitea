import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripeServer'
import { markOrderAsPaid } from '@/lib/orderMarkPaid'

export const dynamic = 'force-dynamic'

/**
 * Resolves order details after redirect from Stripe (session_id) or PayPal (orderId on success).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('orderId')

  const payload = await getPayload({ config: configPromise })

  if (orderId) {
    const o = await payload.findByID({ collection: 'orders', id: orderId, overrideAccess: true })
    if (!o) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const r = o as { orderNumber: string; status: string; total: number }
    return NextResponse.json({
      orderNumber: r.orderNumber,
      status: r.status,
      total: r.total,
    })
  }

  if (sessionId) {
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    })
    const oid = session.metadata?.orderId
    if (!oid) return NextResponse.json({ error: 'Order not linked' }, { status: 400 })
    let o = (await payload.findByID({ collection: 'orders', id: oid, overrideAccess: true })) as
      | (null | { orderNumber: string; status: string; total: number; id: string | number })
    if (!o) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    // Local/dev: webhooks don't hit localhost. When user returns with session_id, sync paid status.
    if (
      o.status === 'awaiting_payment' &&
      session.payment_status === 'paid' &&
      session.amount_total != null
    ) {
      const expected = Math.round(o.total * 100)
      if (expected === session.amount_total) {
        const pi =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent && typeof session.payment_intent === 'object'
              ? (session.payment_intent as { id: string }).id
              : undefined
        await markOrderAsPaid(payload, o.id, pi || session.id)
        o = (await payload.findByID({ collection: 'orders', id: oid, overrideAccess: true })) as {
          orderNumber: string
          status: string
          total: number
        }
      }
    }
    return NextResponse.json({
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total,
    })
  }

  return NextResponse.json({ error: 'session_id or orderId required' }, { status: 400 })
}
