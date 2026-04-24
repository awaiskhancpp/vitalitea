import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: { read: () => true },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Intentional Wellness for Everyday Life.' },
        { name: 'subtext', type: 'textarea' },
        { name: 'primaryCta', type: 'text', defaultValue: 'Shop the Collection' },
        { name: 'secondaryCta', type: 'text', defaultValue: 'Discover the Ritual' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'skincare',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Advanced Care, Naturally Renewed Skin.' },
        { name: 'body', type: 'textarea' },
        { name: 'cta', type: 'text', defaultValue: 'Shop Zen Skincare' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'brandStory',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Experience VitaliTea' },
        { name: 'body', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Join the Ritual.' },
        { name: 'subtext', type: 'text', defaultValue: 'Get 10% off your first order.' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
