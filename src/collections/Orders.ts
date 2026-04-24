import type { CollectionConfig } from 'payload'

const statusOptions: { label: string; value: string }[] = [
  { label: 'Awaiting payment', value: 'awaiting_payment' },
  { label: 'Paid', value: 'paid' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Shipped', value: 'shipped' },
]

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: { useAsTitle: 'orderNumber', defaultColumns: ['orderNumber', 'email', 'status', 'total', 'createdAt'] },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: () => false,
  },
  fields: [
    { name: 'orderNumber', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    { name: 'status', type: 'select', options: statusOptions, defaultValue: 'awaiting_payment', required: true },
    { name: 'email', type: 'email', required: true },
    {
      name: 'lineItems',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'productId', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'imageUrl', type: 'text' },
        { name: 'imageAlt', type: 'text' },
      ],
    },
    { name: 'subtotal', type: 'number', required: true },
    { name: 'discount', type: 'number', defaultValue: 0 },
    { name: 'shipping', type: 'number', required: true, defaultValue: 0 },
    { name: 'total', type: 'number', required: true },
    { name: 'currency', type: 'text', defaultValue: 'usd' },
    {
      name: 'shippingRegion',
      type: 'relationship',
      relationTo: 'shipping-regions',
    },
    { name: 'coupon', type: 'relationship', relationTo: 'coupons' },
    { name: 'couponCodeSnapshot', type: 'text' },
    { name: 'shippingAddress', type: 'json', required: true },
    { name: 'billingAddress', type: 'json' },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'PayPal', value: 'paypal' },
      ],
    },
    { name: 'stripePaymentIntentId', type: 'text' },
    { name: 'stripeSessionId', type: 'text' },
    { name: 'paypalOrderId', type: 'text' },
    { name: 'paypalCaptureId', type: 'text' },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          const rand = () => Math.random().toString(36).slice(2, 8).toUpperCase()
          data.orderNumber = `ORD-${Date.now()}-${rand()}`
        }
        return data
      },
    ],
  },
}
