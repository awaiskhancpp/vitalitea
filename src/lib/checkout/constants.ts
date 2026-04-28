import type { FieldErrorKey } from './types'

/** Subtotal (USD before discount) above which standard shipping is free — keep in sync with server pricing (`computeOrderTotals`). */
export const FREE_SHIPPING_AT = 75

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
