import Stripe from 'stripe'

let stripe: Stripe | null = null

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!stripe) stripe = new Stripe(key, { apiVersion: '2024-06-20' })
  return stripe
}

export function assertStripe() {
  const s = getStripe()
  if (!s) throw new Error('STRIPE_SECRET_KEY is not configured')
  return s
}
