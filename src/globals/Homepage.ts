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
      name: 'marketSection',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'The Expanding Health-Conscious Consumer Market',
          admin: { description: 'Market section heading (Shop page)' },
        },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'An increasing focus on mental health and wellness with at-home natural remedies, combined with a significant rise in the preference for spa therapies due to hectic lifestyles, drives the demand for health-conscious and organic products.',
          admin: { description: 'Market section body' },
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Learn More', admin: { description: 'Market CTA button' } },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Market section image (right column on large screens)' },
        },
      ],
    },
    {
      name: 'bentoGrid',
      type: 'array',
      maxRows: 6,
      admin: { description: 'Homepage bento tiles — up to 6; empty slots use built-in static artwork.' },
      labels: { singular: 'Tile', plural: 'Tiles' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Tile image' },
        },
        { name: 'label', type: 'text', defaultValue: '', admin: { description: 'Shown on the tile' } },
        {
          name: 'size',
          type: 'select',
          defaultValue: 'small',
          admin: { description: 'Layout hint (large = tall column on desktop).' },
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Large', value: 'large' },
          ],
        },
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
