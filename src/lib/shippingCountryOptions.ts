/** Admin + coupon validation: must match `country` on shipping region rows. */
export const SHIPPING_COUNTRY_SELECT_OPTIONS = [
  { label: 'United States (US)', value: 'US' },
  { label: 'Canada (CA)', value: 'CA' },
] as const

export type ShippingCountryCode = (typeof SHIPPING_COUNTRY_SELECT_OPTIONS)[number]['value']
