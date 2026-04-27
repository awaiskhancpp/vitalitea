import type { Payload } from 'payload'
import {
  applyFixedDiscount,
  applyPercentDiscount,
  resolveCartLines,
  type ClientCartLine,
} from './order-pricing'

type CouponDoc = {
  id: string | number
  code: string
  discountType: 'percent' | 'fixed'
  value: number
  minSubtotal: number
  maxDiscount?: number | null
  isActive: boolean
  expiresAt?: string | null
  maxRedemptions?: number | null
  usedCount?: number | null
  /** Empty / unset = all countries. Otherwise must include the shipping region's `country` code. */
  allowedCountryCodes?: string[] | null
}

type RegionDoc = { id: string | number; rate: number; isActive: boolean; country: string }

export type TotalsResult = {
  lines: ClientCartLine[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  shippingRegionId: string
  coupon: { id: string | number; code: string } | null
}

export async function computeOrderTotals(
  payload: Payload,
  input: { lines: ClientCartLine[]; shippingRegionId: string; couponCode: string | null },
): Promise<{ ok: true; data: TotalsResult } | { ok: false; error: string }> {
  const resolved = await resolveCartLines(payload, input.lines)
  if (!resolved.ok) return resolved

  const { lines, subtotal } = resolved

  let reg = await payload
    .findByID({
      collection: 'shipping-regions',
      id: input.shippingRegionId,
      overrideAccess: true,
    })
    .catch(() => null)
  const n = Number(input.shippingRegionId)
  if (!reg && !Number.isNaN(n)) {
    reg = await payload
      .findByID({
        collection: 'shipping-regions',
        id: n,
        overrideAccess: true,
      })
      .catch(() => null)
  }
  if (!reg || !(reg as RegionDoc).isActive) {
    return { ok: false, error: 'Invalid shipping region' }
  }
  const rate = Math.round((reg as RegionDoc).rate * 100) / 100
  /** Free standard shipping on orders at or above this subtotal (before discount). */
  const FREE_SHIPPING_MIN_USD = 75
  const shipping = subtotal >= FREE_SHIPPING_MIN_USD ? 0 : rate

  let discount = 0
  let coupon: TotalsResult['coupon'] = null
  if (input.couponCode && input.couponCode.trim()) {
    const code = input.couponCode.trim().toUpperCase()
    const cRes = await payload.find({
      collection: 'coupons',
      where: { code: { equals: code } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const c = cRes.docs[0] as CouponDoc | undefined
    if (!c || !c.isActive) {
      return { ok: false, error: 'Invalid or expired coupon' }
    }
    if (c.expiresAt) {
      const ex = new Date(c.expiresAt)
      if (ex.getTime() < Date.now()) return { ok: false, error: 'Coupon has expired' }
    }
    if (subtotal < (c.minSubtotal ?? 0)) {
      return { ok: false, error: `Order minimum $${(c.minSubtotal ?? 0).toFixed(2)} for this code` }
    }
    if (c.maxRedemptions != null && c.maxRedemptions > 0 && (c.usedCount ?? 0) >= c.maxRedemptions) {
      return { ok: false, error: 'Coupon is no longer available' }
    }
    const allowedCountries = c.allowedCountryCodes
    if (allowedCountries && Array.isArray(allowedCountries) && allowedCountries.length > 0) {
      const regCountry = (reg as RegionDoc).country
      if (!regCountry || !allowedCountries.includes(regCountry)) {
        return { ok: false, error: 'This coupon is not valid for your shipping country' }
      }
    }
    if (c.discountType === 'percent') {
      discount = applyPercentDiscount(subtotal, c.value, c.maxDiscount)
    } else {
      discount = applyFixedDiscount(subtotal, c.value)
    }
    coupon = { id: c.id, code: c.code }
  }

  const total = Math.max(0, Math.round((subtotal - discount + shipping) * 100) / 100)

  return {
    ok: true,
    data: {
      lines,
      subtotal,
      discount,
      shipping,
      total,
      shippingRegionId: input.shippingRegionId,
      coupon,
    },
  }
}
