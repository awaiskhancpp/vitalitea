import type { CartItem } from '@/contexts/CartContext'

export type ShippingRegionDto = {
  id: string
  name: string
  rate: number
  country?: string
  stateCode?: string | null
  sort?: number
}

export type CheckoutQuote = {
  subtotal: number
  discount: number
  shipping: number
  total: number
}

/** Cart line as sent to quote / draft APIs (matches cart + optional variant) */
export type CheckoutLine = Pick<
  CartItem,
  'id' | 'slug' | 'name' | 'price' | 'quantity' | 'imageUrl' | 'imageAlt' | 'variantLabel'
>

export type ValidateCheckoutInput = {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  /** Shipping country (US / CA) — drives phone (+1 NANP only). */
  shippingCountry: string
  phone: string
  sameAsShipping: boolean
  billFirst: string
  billLast: string
  billAddress: string
  billCity: string
  billState: string
  billZip: string
  shippingRegionId: string
}

export type OrderDraftResponse = {
  orderId: string
  orderNumber: string
  total: number
  subtotal: number
  discount: number
  shipping: number
}

export type FieldErrorKey =
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'address'
  | 'city'
  | 'state'
  | 'zip'
  | 'phone'
  | 'country'
  | 'billFirst'
  | 'billLast'
  | 'billAddress'
  | 'billCity'
  | 'billState'
  | 'billZip'
