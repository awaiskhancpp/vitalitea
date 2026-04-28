import type { Payload } from 'payload'
import { Resend } from 'resend'
import {
  buildOrderConfirmationHtml,
  buildOrderConfirmationMarkdown,
  type OrderEmailPayload,
} from './orderConfirmationHtml'

/**
 * Sends order confirmation via Resend. No-op without `RESEND_API_KEY`.
 * Fire-and-forget from payment handlers; failures are logged, not thrown.
 */
export async function sendOrderConfirmationEmail(
  payload: Payload,
  orderId: string | number,
): Promise<void> {
  const apiKey = typeof process.env.RESEND_API_KEY === 'string' ? process.env.RESEND_API_KEY.trim() : ''
  if (!apiKey) {
    return
  }

  const order = (await payload.findByID({
    collection: 'orders',
    id: orderId,
    overrideAccess: true,
  })) as {
    orderNumber?: string
    email?: string
    status?: string
    lineItems?: OrderEmailPayload['lineItems']
    subtotal?: number
    discount?: number
    shipping?: number
    total?: number
    couponCodeSnapshot?: string | null
    paymentMethod?: string | null
    shippingAddress?: OrderEmailPayload['shippingAddress']
  } | null

  if (!order || order.status !== 'paid') return

  const to = (order.email ?? '').trim()
  if (!to) return

  const from =
    (typeof process.env.RESEND_FROM === 'string' && process.env.RESEND_FROM.trim()) ||
    'Vitalitea <onboarding@resend.dev>'

  const data: OrderEmailPayload = {
    orderNumber: String(order.orderNumber ?? orderId),
    email: to,
    lineItems: order.lineItems,
    subtotal: Number(order.subtotal ?? 0),
    discount: Number(order.discount ?? 0),
    shipping: Number(order.shipping ?? 0),
    total: Number(order.total ?? 0),
    couponCodeSnapshot: order.couponCodeSnapshot,
    paymentMethod: order.paymentMethod,
    shippingAddress: order.shippingAddress,
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Order confirmed — ${data.orderNumber}`,
    html: buildOrderConfirmationHtml(data),
    text: buildOrderConfirmationMarkdown(data),
  })

  if (error) {
    console.error('[sendOrderConfirmationEmail]', error.message ?? error)
  }
}
