import type { Payload } from 'payload'

/**
 * Idempotent: sets order to paid, increments coupon use once. Used by webhook + success-page sync.
 */
export async function markOrderAsPaid(
  payload: Payload,
  orderId: string | number,
  stripeOrPaypalId: string,
) {
  const order = await payload.findByID({ collection: 'orders', id: orderId, overrideAccess: true })
  if (!order) return
  const o = order as { status: string; coupon: number | { id: number } | null; id: string | number }
  if (o.status === 'paid') return
  await payload.update({
    collection: 'orders',
    id: orderId,
    data: { status: 'paid', stripePaymentIntentId: stripeOrPaypalId } as any,
    overrideAccess: true,
  })
  const c = o.coupon
  const couponId = typeof c === 'object' && c && 'id' in c ? c.id : typeof c === 'number' ? c : null
  if (couponId) {
    const doc = await payload.findByID({ collection: 'coupons', id: couponId, overrideAccess: true })
    if (doc) {
      const u = (doc as { usedCount?: number }).usedCount ?? 0
      await payload.update({
        collection: 'coupons',
        id: couponId,
        data: { usedCount: u + 1 } as any,
        overrideAccess: true,
      })
    }
  }
}
