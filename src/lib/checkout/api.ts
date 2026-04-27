import type { CheckoutLine, CheckoutQuote, OrderDraftResponse } from './types'
import { parseApiError } from './parseApiError'

type Ok<T> = { ok: true; data: T }
type Err = { ok: false; error: string; status: number }
type Result<T> = Ok<T> | Err

function readError(res: Response, bodyText: string, fallback: string): Err {
  return { ok: false, error: parseApiError(bodyText, res.status, fallback), status: res.status }
}

export async function fetchShippingRegions(): Promise<
  Result<{ regions: { id: string; name: string; rate: number; country?: string }[] }>
> {
  const res = await fetch('/api/shipping-regions')
  const text = await res.text()
  if (!res.ok) return readError(res, text, 'Could not load shipping regions')
  try {
    const d = JSON.parse(text) as { regions?: { id: string; name: string; rate: number; country?: string }[] }
    return { ok: true, data: { regions: d.regions || [] } }
  } catch {
    return { ok: false, error: 'Invalid response', status: 500 }
  }
}

export async function postCheckoutQuote(
  body: {
    items: CheckoutLine[]
    shippingRegionId: string
    couponCode: string | null
  },
  signal?: AbortSignal,
): Promise<Result<CheckoutQuote>> {
  const res = await fetch('/api/checkout/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  const text = await res.text()
  if (!res.ok) return readError(res, text, 'Could not update totals')
  try {
    return { ok: true, data: JSON.parse(text) as CheckoutQuote }
  } catch {
    return { ok: false, error: 'Invalid response', status: 500 }
  }
}

export async function postOrderDraft(
  body: unknown,
  signal?: AbortSignal,
): Promise<Result<OrderDraftResponse>> {
  const res = await fetch('/api/orders/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  const text = await res.text()
  if (!res.ok) return readError(res, text, 'Could not start checkout')
  try {
    return { ok: true, data: JSON.parse(text) as OrderDraftResponse }
  } catch {
    return { ok: false, error: 'Invalid response', status: 500 }
  }
}

export async function postStripePaymentIntent(
  orderId: string,
  signal?: AbortSignal,
): Promise<Result<{ clientSecret: string; paymentIntentId: string }>> {
  const res = await fetch('/api/checkout/stripe-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
    signal,
  })
  const text = await res.text()
  if (!res.ok) return readError(res, text, 'Could not start card payment')
  try {
    const j = JSON.parse(text) as { clientSecret: string; paymentIntentId: string }
    return { ok: true, data: j }
  } catch {
    return { ok: false, error: 'Invalid response', status: 500 }
  }
}

export async function postPaypalPrepare(
  body: unknown,
  signal?: AbortSignal,
): Promise<Result<{ orderId: string; paypalOrderId: string }>> {
  const res = await fetch('/api/checkout/paypal-prepare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  if (!res.ok) {
    const t = await res.text()
    return readError(res, t, 'Could not start PayPal')
  }
  try {
    return { ok: true, data: (await res.json()) as { orderId: string; paypalOrderId: string } }
  } catch {
    return { ok: false, error: 'Invalid response', status: 500 }
  }
}

export async function postPaypalCapture(
  orderId: string,
  paypalOrderId: string,
  signal?: AbortSignal,
): Promise<Result<true>> {
  const res = await fetch('/api/checkout/paypal-capture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, paypalOrderId }),
    signal,
  })
  if (!res.ok) {
    const t = await res.text()
    return readError(res, t, 'Payment capture failed')
  }
  return { ok: true, data: true }
}
