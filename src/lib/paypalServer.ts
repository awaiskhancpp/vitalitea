const BASE =
  process.env.PAYPAL_MODE === 'live' || process.env.NEXT_PUBLIC_PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

let cached: { token: string; exp: number } | null = null

async function getAccessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID
  const sec = process.env.PAYPAL_CLIENT_SECRET
  if (!id || !sec) throw new Error('PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are not configured')
  if (cached && Date.now() < cached.exp) return cached.token
  const auth = Buffer.from(`${id}:${sec}`).toString('base64')
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`PayPal auth failed: ${t}`)
  }
  const j = (await res.json()) as { access_token: string; expires_in: number }
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 }
  return j.access_token
}

export async function paypalCreateOrder(
  valueUsd: string,
  returnUrl: string,
  cancelUrl: string,
  customId: string,
): Promise<{ id: string }> {
  const token = await getAccessToken()
  const res = await fetch(`${BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: customId,
          amount: { currency_code: 'USD', value: valueUsd },
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        user_action: 'PAY_NOW',
        shipping_preference: 'GET_FROM_FILE',
      },
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`PayPal create order: ${t}`)
  }
  const j = (await res.json()) as { id: string }
  return j
}

export type PayPalCaptureResult = {
  id: string
  status: string
  purchase_units?: {
    payments?: { captures?: { id: string; amount?: { value: string; currency_code?: string } }[] }
  }[]
}

export async function paypalCaptureOrder(paypalOrderId: string): Promise<PayPalCaptureResult> {
  const token = await getAccessToken()
  const res = await fetch(`${BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`PayPal capture: ${t}`)
  }
  return (await res.json()) as PayPalCaptureResult
}
