import type { CollectionConfig } from 'payload'

/**
 * Flat shipping rate per region. Match checkout by `country` + optional `stateCode`.
 * Client receives `id` for quotes and order placement.
 */
export const ShippingRegions: CollectionConfig = {
  slug: 'shipping-regions',
  admin: { useAsTitle: 'name' },
  access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'country', type: 'text', required: true, index: true },
    { name: 'stateCode', type: 'text' },
    { name: 'rate', type: 'number', required: true, min: 0, admin: { description: 'USD' } },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'sort', type: 'number', defaultValue: 0 },
  ],
}
