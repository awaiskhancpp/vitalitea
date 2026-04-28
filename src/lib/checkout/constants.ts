import type { FieldErrorKey } from './types'

export const FREE_SHIPPING_AT = 75

export const SHIPPING_METHOD_BY_COUNTRY: Record<
  string,
  { title: string; eta: string; summaryHint: string }
> = {
  US: { title: 'US Standard Shipping', eta: '5-7 business days', summaryHint: 'US Standard' },
  CA: { title: 'Canada Standard Shipping', eta: '5-7 business days', summaryHint: 'Canada' },
}

/** Scroll/focus first invalid field in this order */
export const FIELD_SCROLL_ORDER: readonly FieldErrorKey[] = [
  'email',
  'firstName',
  'lastName',
  'address',
  'city',
  'state',
  'zip',
  'phone',
  'country',
  'billFirst',
  'billLast',
  'billAddress',
  'billCity',
  'billState',
  'billZip',
]
