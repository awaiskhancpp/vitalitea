import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: { read: () => true },
  admin: { useAsTitle: 'author' },
  fields: [
    { name: 'author', type: 'text', required: true },
    { name: 'quote', type: 'textarea', required: true },
    {
      name: 'rating',
      type: 'select',
      options: ['1', '2', '3', '4', '5'].map((n) => ({ label: `${n} stars`, value: n })),
      defaultValue: '5',
    },
    { name: 'verified', type: 'checkbox', defaultValue: true },
  ],
}
