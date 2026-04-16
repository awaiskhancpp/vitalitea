import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: { read: () => true },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'price', type: 'number', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Skincare', value: 'skincare' },
        { label: 'Teas', value: 'teas' },
        { label: 'Candles', value: 'candles' },
        { label: 'Yoga', value: 'yoga' },
        { label: 'Essential Oils', value: 'oils' },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}
