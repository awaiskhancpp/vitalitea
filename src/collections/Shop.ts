import type { CollectionConfig } from 'payload'

const Shop: CollectionConfig = {
  slug: 'shop',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'price', type: 'number' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export default Shop
