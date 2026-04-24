import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: { useAsTitle: 'code' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Stored uppercase' },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      options: [
        { label: 'Percent', value: 'percent' },
        { label: 'Fixed (Pkr)', value: 'fixed' },
      ],
      defaultValue: 'percent',
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Percent 0–100 or fixed rupees' },
    },
    { name: 'minSubtotal', type: 'number', min: 0, defaultValue: 0 },
    {
      name: 'maxDiscount',
      type: 'number',
      min: 0,
      admin: { description: 'Cap for percent discounts (optional)' },
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'expiresAt', type: 'date' },
    { name: 'maxRedemptions', type: 'number', min: 0 },
    { name: 'usedCount', type: 'number', min: 0, defaultValue: 0, admin: { readOnly: true } },
    {
      name: 'allowedRegions',
      type: 'relationship',
      relationTo: 'shipping-regions',
      hasMany: true,
      admin: { description: 'Empty = valid for all regions' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        if (data.code && typeof data.code === 'string') {
          data.code = data.code.trim().toUpperCase()
        }
        if (operation === 'create' && data.usedCount == null) data.usedCount = 0
        return data
      },
    ],
  },
}
